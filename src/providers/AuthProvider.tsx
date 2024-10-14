import {PropsWithChildren, useEffect} from 'react';
// import { useNavigation} from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useAuthStore } from '../presentation/store/auth/useAuthStore';
// import { RootStackParams } from '../presentation/navigation/StackNavigator';

export const AuthProvider = ({children}: PropsWithChildren) => {
    // const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    // const { checkStatus, status } = useAuthStore();

    // useEffect(() => {
    //   if ( status !== 'checking' ) {
    //     if ( status === 'authenticated' ) {
    //       // navigation.reset({
    //       //   index: 0,
    //       //   routes: [{ name: 'BottomTabNavigatorAdmin' }],
    //       // })
    //     } else {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'LoginScreen' }],
    //       })
    //     }
    //   }       
    // }, [status])

    // useEffect(() => {
    //   checkStatus();
    // }, []);
  

    return <>{children}</>;
    };