import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { Card } from '@ui-kitten/components';
import { MainLayout } from '../../layouts/MainLayout';
import { colors, styles } from '../../../config/theme/ColorsTheme';

interface CustomAccordionProps {
  title: string;
  children: React.ReactNode;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={localStyles.accordionContainer}>
      <TouchableOpacity onPress={handlePress} style={localStyles.accordionHeader}>
        <Text style={localStyles.accordionTitle}>{title}</Text>
      </TouchableOpacity>
      {expanded && <View style={localStyles.accordionContent}>{children}</View>}
    </View>
  );
};

export const LegalScreen = () => {

  const { width, height } = useWindowDimensions();

  return (
    <MainLayout title='Documentos Legales'>
        <Image
          source={require('../../../assets/termsAndConditions.png')}
          style={[styles.Image, { width: width * 1, height: height * 0.35 }]}
        />
        <Card style={localStyles.card}>
          <CustomAccordion title="Acuerdo de Usuario">
            <Text style={localStyles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum, nisi id
              fermentum sagittis, justo mi aliquet eros, a placerat lectus turpis non odio. Integer
              non justo ut ipsum suscipit interdum.
            </Text>
          </CustomAccordion>

          <CustomAccordion title="Acuerdo de Licencia">
            <Text style={localStyles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et consequat felis, sed
              sagittis mi. In vel nisl bibendum, tincidunt augue et, dignissim nisl. Proin nec eros at
              ligula ullamcorper tincidunt.
            </Text>
          </CustomAccordion>

          <CustomAccordion title="Política de Privacidad">
            <Text style={localStyles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet ligula in mi
              placerat sagittis. Cras gravida ligula ac ligula sodales auctor. Integer et orci in
              magna interdum aliquet.
            </Text>
          </CustomAccordion>
        </Card>
    </MainLayout>
  );
};

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 12,
  },
  accordionContainer: {
    marginVertical: 4,
  },
  accordionHeader: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
