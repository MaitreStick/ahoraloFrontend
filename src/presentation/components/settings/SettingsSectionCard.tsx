/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet} from 'react-native';
import {Card, List, ListItem, Text, Divider, Icon} from '@ui-kitten/components';

interface Option {
  title: string;
  description?: string;
  iconName: string;
  onPress: () => void;
}

interface Props {
  title: string;
  options: Option[];
}

export const SettingsSectionCard = ({title, options}: Props) => {
  const renderItem = ({item, index}: {item: Option; index: number}) => (
    <ListItem
      title={item.title}
      description={item.description}
      accessoryLeft={props => <Icon {...props} name={item.iconName} />}
      onPress={item.onPress}
    />
  );

  return (
    <Card style={styles.card}>
      <Text category="h6" style={styles.title}>
        {title}
      </Text>
      <List
        style={styles.list}
        data={options}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 1.5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  list: {
    backgroundColor: 'transparent',
  },
});
