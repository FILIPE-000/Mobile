import React from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, type NativeStackScreenProps } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Category, Task, TaskStatusFilter } from '../types/models';
import { getCategories, getTasks, updateTask } from '../db/database';
import { cancelTaskNotification, scheduleTaskNotification } from '../services/notificationService';
import TaskCard from '../components/TaskCard';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const db = useSQLiteContext();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [status, setStatus] = React.useState<TaskStatusFilter>('all');
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = React.useCallback(async () => {
    const [loadedTasks, loadedCategories] = await Promise.all([getTasks(db), getCategories(db)]);
    setTasks(loadedTasks);
    setCategories(loadedCategories);
  }, [db]);

  useFocusEffect(React.useCallback(() => { load().catch(() => Alert.alert('Erro', 'Não foi possível carregar os dados.')); }, [load]));

  const filtered = tasks.filter((task) => {
    const statusOk = status === 'all' || (status === 'completed' ? task.completed : !task.completed);
    const categoryOk = categoryId === null || task.categoryId === categoryId;
    return statusOk && categoryOk;
  });

  async function toggleTask(task: Task) {
    try {
      const nextCompleted = !task.completed;
      let notificationId = task.notificationId;
      if (nextCompleted) {
        await cancelTaskNotification(notificationId);
        notificationId = null;
      } else if (task.dueDateTime && new Date(task.dueDateTime).getTime() > Date.now()) {
        await cancelTaskNotification(notificationId);
        notificationId = await scheduleTaskNotification(task.title, task.dueDateTime);
      }
      await updateTask(db, { ...task, completed: nextCompleted, notificationId });
      await load();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  }

  async function refresh() {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.heading}>Organize seu dia</Text>
          <Text style={styles.subtitle}>{filtered.length} tarefa(s) encontrada(s)</Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('TaskEditor')}><Text style={styles.addText}>＋</Text></Pressable>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed'] as TaskStatusFilter[]).map((value) => (
          <Pressable key={value} onPress={() => setStatus(value)} style={[styles.chip, status === value && styles.chipActive]}>
            <Text style={[styles.chipText, status === value && styles.chipTextActive]}>
              {value === 'all' ? 'Todas' : value === 'pending' ? 'Pendentes' : 'Concluídas'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={[{ id: null, name: 'Todas' }, ...categories]} keyExtractor={(item) => String(item.id ?? 'all')}
            contentContainerStyle={styles.categoryRow} renderItem={({ item }) => (
              <Pressable onPress={() => setCategoryId(item.id)} style={[styles.categoryChip, categoryId === item.id && styles.categoryActive]}>
                <Text style={[styles.categoryText, categoryId === item.id && styles.categoryTextActive]}>{item.name}</Text>
              </Pressable>
            )} />
        }
        renderItem={({ item }) => <TaskCard task={item} category={categories.find((c) => c.id === item.categoryId)} onPress={() => navigation.navigate('TaskEditor', { taskId: item.id })} onToggle={() => toggleTask(item)} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Nada por aqui</Text><Text style={styles.emptyText}>Crie uma tarefa usando o botão +.</Text></View>}
      />

      <Pressable style={styles.categoriesButton} onPress={() => navigation.navigate('Categories')}><Text style={styles.categoriesText}>Gerenciar categorias</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, paddingBottom: 12 },
  heading: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 3 },
  addButton: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontSize: 30, lineHeight: 32, fontWeight: '300' },
  filterRow: { flexDirection: 'row', marginBottom: 4, gap: 8 },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 20, backgroundColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#dbeafe' },
  chipText: { color: '#4b5563', fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: '#1d4ed8' },
  categoryRow: { gap: 8, paddingVertical: 12 },
  categoryChip: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#fff' },
  categoryActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  categoryText: { color: '#4b5563' },
  categoryTextActive: { color: '#1d4ed8', fontWeight: '700' },
  list: { paddingBottom: 90 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#374151' },
  emptyText: { color: '#6b7280', marginTop: 6 },
  categoriesButton: { position: 'absolute', left: 16, right: 16, bottom: 16, paddingVertical: 14, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center' },
  categoriesText: { color: '#fff', fontWeight: '700' },
});
