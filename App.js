import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home.js';
import { useFonts } from 'expo-font';

import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    'Quicksand_Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand_SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand_Bold': require('./assets/fonts/Quicksand-Bold.ttf')

  }); 

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
