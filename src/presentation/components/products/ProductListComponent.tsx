/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {FlatList, RefreshControl} from "react-native";
import {Layout} from "@ui-kitten/components";
import {ProductCard} from "./ProductCard";
import {Prodcomcity} from "../../../domain/entities/prodcomcity";

interface ProductListProps {
  data: Prodcomcity[];
  fetchNextPage?: () => void;
  isFetching: boolean;
  isRefreshing: boolean;
  onPullToRefresh: () => void;
}

export const ProductsListComponent = ({
  data,
  fetchNextPage,
  isFetching,
  isRefreshing,
  onPullToRefresh,
}: ProductListProps) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({item}) => <ProductCard prodcomcity={item} />}
      ListFooterComponent={() => <Layout style={{height: 150}} />}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.8}
      refreshControl={
        <RefreshControl
          refreshing={isFetching || isRefreshing}
          onRefresh={onPullToRefresh}
        />
      }
    />
  );
};
