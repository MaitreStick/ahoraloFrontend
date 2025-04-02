import {ImageStyle, ViewStyle} from 'react-native';

export interface ThemeColors {
  primary: string;
  background: string;
}

export interface Styles {
  background: ViewStyle;
  generalContainer: ViewStyle;
  scrollView: ViewStyle;
  layoutTitle: ViewStyle;
  layoutForm: ViewStyle;
  Image: ImageStyle & ViewStyle;
  RegisterImage: ImageStyle;
  informationText: ViewStyle;
  input: ViewStyle;
  layoutSpace: ViewStyle;
  layoutQuestion: ViewStyle;
  welcomeButton: ViewStyle;
}
