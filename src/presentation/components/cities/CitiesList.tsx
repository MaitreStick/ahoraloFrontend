import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Layout, List, ListItem} from '@ui-kitten/components';
import {RootStackParams} from '../../navigation/StackNavigator';
import {City} from '../../../domain/entities/city';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshControl} from 'react-native';
import {FullScreenLoader} from '../ui/FullScreenLoader';
import {colors} from '../../../config/theme/ColorsTheme';

interface Props {
  cities: City[];
  fetchNextPage: () => void;
  isFetching: boolean;
  isLoading: boolean;
}

export const CityList: React.FC<Props> = ({
  cities,
  fetchNextPage,
  isFetching,
  isLoading,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const cityNames = cities.map(city => ({
    id: city.id,
    name: city.name,
    nameDep: city.nameDep,
    displayName: `${city.name} - ${city.nameDep}`,
  }));

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    queryClient.invalidateQueries({queryKey: ['cities', 'infinite']});
    setIsRefreshing(false);
  };

  if (isLoading) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <FullScreenLoader />;
  }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <List
      data={cityNames}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{backgroundColor: colors.background, borderRadius: 20}}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({item}: {item: City}) => (
        // eslint-disable-next-line react/react-in-jsx-scope
        <ListItem
          title={`${item.name}`}
          description={`${item.nameDep}`}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{padding: 10}}
          onPress={() =>
            navigation.navigate('CityScreenAdmin', {cityId: item.id})
          }
        />
      )}
      onEndReached={fetchNextPage}
      ListFooterComponent={
        // eslint-disable-next-line react/react-in-jsx-scope
        <Layout
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 150,
            borderEndEndRadius: 20,
            borderEndStartRadius: 20,
          }}
        />
      }
      onEndReachedThreshold={0.8}
      refreshControl={
        // eslint-disable-next-line react/react-in-jsx-scope
        <RefreshControl
          refreshing={isFetching || isRefreshing}
          onRefresh={onPullToRefresh}
        />
      }
    />
  );
};
