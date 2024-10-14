import { StyleSheet } from "react-native";
import type { Styles, ThemeColors } from "../../infrastructure/interfaces/theme.styles";

export const colors:ThemeColors = {
//   primary: "#3955EF",
  primary: "#3B82F6",
  background: "#F3F2F7",
//   background: "#F3F2F7",
};

export const styles:Styles = StyleSheet.create({
    background: {
        backgroundColor: colors.background,
    },
    generalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        marginHorizontal: 40,
        backgroundColor: colors.background,
    },
    layoutTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    layoutForm: {
        marginTop: 20,
        backgroundColor: colors.background,
    },
    Image: {
        resizeMode: 'center',
        alignSelf: 'center',
        backgroundColor: colors.background,
    },
    RegisterImage: {
        resizeMode: 'center',
        alignSelf: 'center',
    },
    informationText: {
        height: 50,
        backgroundColor: colors.background,
    },
    input: {
        marginBottom: 10,
        backgroundColor: colors.background,
    },
    layoutSpace:  {
        height: 10,
        backgroundColor: colors.background,
    },
    layoutQuestion: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    welcomeButton: {
        // position: 'absolute', 
        width: "auto", 
        alignSelf: 'center'
    }
  });