import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Task } from '../types/models';
import TaskListScreen from '../screens/TaskListScreen';
import TaskEditorScreen from '../screens/TaskEditorScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';

export type RootStackParamList = {
  TaskList: undefined;
  TaskEditor: { taskId?: number };
  Categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Minhas tarefas' }} />
        <Stack.Screen name="TaskEditor" component={TaskEditorScreen} options={{ title: 'Tarefa' }} />
        <Stack.Screen name="Categories" component={CategoryManagementScreen} options={{ title: 'Categorias' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
