/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet} from 'react-native';
import {Layout, Spinner, Text} from '@ui-kitten/components';

export const FullScreenLoader = () => {
  return (
    <Layout style={styles.container}>
      <Spinner size="giant" />
      <Text style={styles.message} category="h6">
        Un momento, estamos preparando todo para ti...
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
