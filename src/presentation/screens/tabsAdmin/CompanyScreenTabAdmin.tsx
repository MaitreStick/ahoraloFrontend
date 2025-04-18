import React from 'react';
import {StyleSheet} from 'react-native';
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';
import {MainLayout} from '../../layouts/MainLayout';
import {Company} from '../../../domain/entities/company';
import {FAB} from '../../components/ui/FAB';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {getCompaniesByPage} from '../../../actions/companies/get-companies-by-page';
import {CompanyList} from '../../components/companies/CompaniesList';

export const CompanyScreenTabAdmin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const navigateToCreateCompany = () => {
    navigation.navigate('CompanyScreenAdmin', {companyId: 'new'});
  };

  const {isLoading, data, fetchNextPage, isFetching} = useInfiniteQuery<
    Company[],
    Error,
    InfiniteData<Company[]>,
    [string, string],
    number
  >({
    queryKey: ['companies', 'infinite'],
    queryFn: async ({
      pageParam = 0,
    }: QueryFunctionContext<[string, string], number>): Promise<Company[]> => {
      return await getCompaniesByPage(pageParam);
    },
    getNextPageParam: (
      lastPage: Company[],
      allPages: InfiniteData<Company[]>['pages'],
    ) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const allCompanies = data?.pages.flat() ?? [];
  const uniqueCompaniesMap = new Map<string, Company>();

  for (const company of allCompanies) {
    uniqueCompaniesMap.set(company.id, company);
  }

  const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

  return (
    <>
      <MainLayout
        title="Ahoralo - Empresas"
        subTitle="Panel Administrativo"
        showBackAction={false}
      >
        <CompanyList
          companies={uniqueCompanies}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </MainLayout>

      <FAB
        iconName={'briefcase-outline'}
        onPress={navigateToCreateCompany}
        style={[
          styles.fabMain,
          {backgroundColor: '#d4603b', borderColor: '#d4603b'},
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fabMain: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  fab: {
    position: 'absolute',
    right: 20,
  },
});