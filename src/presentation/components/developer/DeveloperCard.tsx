/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {StyleSheet, View, Image, Linking} from 'react-native';
import {Text, Card, Button, Icon} from '@ui-kitten/components';
import {MyIcon} from '../ui/MyIcon';

interface Developer {
  name: string;
  role: string;
  github?: string;
  image: string;
}

interface DeveloperCardProps {
  developer: Developer;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({developer}) => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Image source={{uri: developer.image}} style={styles.avatar} />
        <Text category="h6" style={styles.name}>
          {developer.name}
        </Text>
        <Text appearance="hint">{developer.role}</Text>
        <View style={styles.buttons}>
          {developer.github && (
            <Button
              style={styles.button}
              size="small"
              appearance="ghost"
              accessoryLeft={<MyIcon name="github-outline" />}
              onPress={() => developer.github && handlePress(developer.github)}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  name: {
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 8,
  },
});
