import { useNavigation } from '@react-navigation/native';
import { Layout, TopNavigation, TopNavigationAction, Divider } from '@ui-kitten/components';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MyIcon } from '../components/ui/MyIcon';
import { Platform, StyleSheet, View } from 'react-native';
import { styles } from '../../config/theme/ColorsTheme';

interface Props {
    title: string;
    subTitle?: string;

    rightAction?: () => void;
    rightActionIcon?: string;
    showBackAction?: boolean;
    children?: React.ReactNode;
}

export const MainLayout = ({
    title,
    subTitle,
    rightAction,
    rightActionIcon,
    showBackAction = true,
    children,
}: Props) => {

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const topNavigationHeight = 56;

    const renderBackAction = () => (
        <TopNavigationAction
            icon={<MyIcon name={Platform.OS === 'ios' ? 'arrow-ios-back-outline' : 'arrow-back-outline'} />}
            onPress={navigation.goBack}
        />
    );

    const RenderRightAction = () => {
        if (!rightAction || !rightActionIcon) return <></>;

        return (
            <TopNavigationAction
                onPress={rightAction}
                icon={<MyIcon name={rightActionIcon} />}
            />
        );
    };

    return (
        <SafeAreaView style={stylesMainLayout.safeArea} edges={['top', 'left', 'right']}>
            <View style={[stylesMainLayout.backgroundWhite, { height: insets.top + topNavigationHeight }]} />

            <TopNavigation
                title={title}
                subtitle={subTitle}
                alignment='center'
                accessoryLeft={showBackAction ? renderBackAction : undefined}
                accessoryRight={RenderRightAction}
                style={stylesMainLayout.topNavigation}
            />
            <Divider/>

            <Layout style={stylesMainLayout.content}>
                {children}
            </Layout>
        </SafeAreaView>
    )
}

const stylesMainLayout = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundWhite: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: -1,
    },
    topNavigation: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        marginBottom: 1.5,
    },
    content: {
        flex: 1,
        backgroundColor: styles.background.backgroundColor,
    },
});