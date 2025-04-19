import React from 'react';
import { StyleSheet } from 'react-native';
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';
import { Company } from '../../../domain/entities/company';
import { getCompaniesByPage } from '../../../actions/companies/get-companies-by-page';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { CompanyList } from '../../components/companies/CompaniesList';
import { FAB } from '../../components/ui/FAB';

export const CompaniesTabScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const { isLoading, data, fetchNextPage, isFetching } =
    useInfiniteQuery<
      Company[],
      Error,
      InfiniteData<Company[]>,
      [string, string],
      number
    >({
      queryKey: ['companies', 'infinite'],
      queryFn: async ({
        pageParam = 0,
      }: QueryFunctionContext<[string, string], number>) =>
        getCompaniesByPage(pageParam),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? undefined : allPages.length,
      initialPageParam: 0,
      staleTime: 1000 * 60 * 60,
    });

  const companies = Array.from(
    new Map((data?.pages.flat() ?? []).map((c) => [c.id, c])).values(),
  );

  return (
    <>
      <CompanyList
        companies={companies}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isLoading={isLoading}
      />

      <FAB
        iconName="briefcase-outline"
        onPress={() =>
          navigation.navigate('CompanyScreenAdmin', { companyId: 'new' })
        }
        style={[styles.fab, { backgroundColor: '#d4603b', borderColor: '#d4603b' }]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});