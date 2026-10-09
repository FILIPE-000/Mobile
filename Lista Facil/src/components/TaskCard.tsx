import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Category, Task } from '../types/models';

function formatDue(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

type Props = {
  task: Task;
  category?: Category;
  onPress: () => void;
  onToggle: () => void;
};

export default function TaskCard({ task, category, onPress, onToggle }: Props) {
  const due = formatDue(task.dueDateTime);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Pressable onPress={onToggle} hitSlop={10} style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.done]} numberOfLines={2}>{task.title}</Text>
        {category ? <Text style={styles.meta}>#{category.name}</Text> : null}
        {due ? <Text style={[styles.meta, !task.completed && new Date(task.dueDateTime!).getTime() < Date.now() && styles.overdue]}>⏰ {due}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  pressed: { opacity: 0.7 },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxDone: { backgroundColor: '#2563eb' },
  check: { color: '#fff', fontWeight: '800' },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  done: { textDecorationLine: 'line-through', color: '#6b7280' },
  meta: { marginTop: 4, color: '#6b7280', fontSize: 13 },
  overdue: { color: '#dc2626', fontWeight: '700' },
});
