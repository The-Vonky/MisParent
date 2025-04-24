// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1e3a8a" // mesma cor do header
        translucent={false}
      />
      <StackNavigator />
    </SafeAreaProvider>
  );
}