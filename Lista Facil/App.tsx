import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/db/database';

function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Preparando seus dados…</Text>
    </View>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="lista-facil.db" onInit={initializeDatabase}>
      <AppNavigator />
    </SQLiteProvider>
  );
}


const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
});
