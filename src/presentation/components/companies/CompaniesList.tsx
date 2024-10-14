import React, { useState } from 'react';
import { RefreshControl, Text } from 'react-native';
import { Company } from '../../../domain/entities/company';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Layout, List, ListItem } from '@ui-kitten/components';
import { useQueryClient } from '@tanstack/react-query';
import { FullScreenLoader } from '../ui/FullScreenLoader';
import { colors } from '../../../config/theme/ColorsTheme';

interface Props {
    companies: Company[];
    fetchNextPage: () => void;
    isFetching: boolean;
    isLoading: boolean;
}

export const CompanyList: React.FC<Props> = ({ companies, fetchNextPage, isFetching, isLoading }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();

    const companyNames = companies.map((company) => ({
        id: company.id,
        name: company.name,
        displayName: company.name,
    }));

    const onPullToRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        queryClient.invalidateQueries({ queryKey: ['companies', 'infinite'] });
        setIsRefreshing(false);
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <List
            data={companyNames}
            style={{ backgroundColor: colors.background, borderRadius: 20 }}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }: { item: Company }) => (
                <ListItem
                    title={`${item.name}`}
                    style={{ padding: 10 }}
                    onPress={() => navigation.navigate('CompanyScreenAdmin', { companyId: item.id })}
                />
            )}
            onEndReached={fetchNextPage}
            ListFooterComponent={() => <Layout style={{ height: 150, borderEndEndRadius: 20, borderEndStartRadius: 20 }} />}
            onEndReachedThreshold={0.8}
            refreshControl={
                <RefreshControl refreshing={isFetching || isRefreshing} onRefresh={onPullToRefresh} />
            }
        />
    );
};
