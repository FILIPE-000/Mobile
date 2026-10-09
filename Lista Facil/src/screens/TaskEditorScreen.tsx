import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useSQLiteContext } from 'expo-sqlite';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Category, Task } from '../types/models';
import { createTask, deleteTask, getCategories, getTask, updateTask } from '../db/database';
import { cancelTaskNotification, scheduleTaskNotification } from '../services/notificationService';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskEditor'>;

export default function TaskEditorScreen({ navigation, route }: Props) {
  const db = useSQLiteContext();
  const taskId = route.params?.taskId;
  const editing = taskId !== undefined;
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [completed, setCompleted] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [originalTask, setOriginalTask] = React.useState<Task | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const loadedCategories = await getCategories(db);
      setCategories(loadedCategories);
      if (taskId !== undefined) {
        const task = await getTask(db, taskId);
        if (!task) { Alert.alert('Erro', 'Tarefa não encontrada.'); navigation.goBack(); return; }
        setOriginalTask(task); setTitle(task.title); setDescription(task.description); setCompleted(task.completed); setCategoryId(task.categoryId); setDueDate(task.dueDateTime ? new Date(task.dueDateTime) : null);
      }
    })().catch(() => Alert.alert('Erro', 'Não foi possível carregar a tarefa.'));
  }, [db, navigation, taskId]);

  function onDateChange(_: unknown, selected?: Date) {
    setShowDate(false);
    if (!selected) return;
    const next = dueDate ? new Date(dueDate) : new Date();
    next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    setDueDate(next);
  }

  function onTimeChange(_: unknown, selected?: Date) {
    setShowTime(false);
    if (!selected) return;
    const next = dueDate ? new Date(dueDate) : new Date();
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setDueDate(next);
  }

  async function save() {
    const cleanTitle = title.trim();
    if (!cleanTitle) { Alert.alert('Título obrigatório', 'Informe um título para a tarefa.'); return; }
    if (dueDate && dueDate.getTime() <= Date.now() && !completed) { Alert.alert('Data inválida', 'Escolha uma data e hora futuras para o lembrete.'); return; }
    setSaving(true);
    try {
      let notificationId = originalTask?.notificationId ?? null;
      await cancelTaskNotification(notificationId);
      notificationId = null;
      if (!completed && dueDate) notificationId = await scheduleTaskNotification(cleanTitle, dueDate.toISOString());

      if (editing && originalTask) {
        await updateTask(db, { ...originalTask, title: cleanTitle, description, completed, categoryId, dueDateTime: dueDate?.toISOString() ?? null, notificationId });
      } else {
        await createTask(db, { title: cleanTitle, description, completed, categoryId, dueDateTime: dueDate?.toISOString() ?? null, notificationId });
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally { setSaving(false); }
  }

  async function remove() {
    if (!originalTask) return;
    Alert.alert('Excluir tarefa', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await cancelTaskNotification(originalTask.notificationId); await deleteTask(db, originalTask.id); navigation.goBack(); }
        catch { Alert.alert('Erro', 'Não foi possível excluir a tarefa.'); }
      } },
    ]);
  }

  const dueLabel = dueDate ? dueDate.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Nenhum lembrete';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Título *</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Ex.: Entregar trabalho" style={styles.input} maxLength={120} />
        <Text style={styles.label}>Descrição</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Detalhes opcionais" style={[styles.input, styles.multiline]} multiline textAlignVertical="top" />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.wrap}>{
          [{ id: null, name: 'Sem categoria' }, ...categories].map((category) => (
            <Pressable key={String(category.id)} onPress={() => setCategoryId(category.id)} style={[styles.choice, categoryId === category.id && styles.choiceActive]}>
              <Text style={[styles.choiceText, categoryId === category.id && styles.choiceTextActive]}>{category.name}</Text>
            </Pressable>
          ))
        }</View>

        <View style={styles.statusRow}><View><Text style={styles.label}>Concluída</Text><Text style={styles.helper}>Concluir cancela o lembrete.</Text></View><Switch value={completed} onValueChange={setCompleted} /></View>

        <Text style={styles.label}>Data e horário</Text>
        <View style={styles.dateRow}>
          <Pressable style={styles.secondaryButton} onPress={() => setShowDate(true)}><Text style={styles.secondaryText}>Escolher data</Text></Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setShowTime(true)}><Text style={styles.secondaryText}>Escolher hora</Text></Pressable>
        </View>
        <Text style={styles.dueValue}>{dueLabel}</Text>
        {dueDate ? <Pressable onPress={() => setDueDate(null)}><Text style={styles.clear}>Remover lembrete</Text></Pressable> : null}
        {showDate && <DateTimePicker value={dueDate ?? new Date()} mode="date" display="default" presentation="dialog" onValueChange={onDateChange} />}
        {showTime && <DateTimePicker value={dueDate ?? new Date()} mode="time" display="default" presentation="dialog" onValueChange={onTimeChange} />}

        <Pressable disabled={saving} style={[styles.saveButton, saving && styles.disabled]} onPress={save}><Text style={styles.saveText}>{saving ? 'Salvando…' : 'Salvar tarefa'}</Text></Pressable>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
        {editing ? <Pressable style={styles.deleteButton} onPress={remove}><Text style={styles.deleteText}>Excluir tarefa</Text></Pressable> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 18, paddingBottom: 40 },
  label: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 8, marginTop: 12 },
  helper: { color: '#6b7280', fontSize: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 16 },
  multiline: { minHeight: 100 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#fff' },
  choiceActive: { backgroundColor: '#dbeafe', borderColor: '#2563eb' },
  choiceText: { color: '#4b5563' },
  choiceTextActive: { color: '#1d4ed8', fontWeight: '700' },
  statusRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12 },
  dateRow: { flexDirection: 'row', gap: 8 },
  secondaryButton: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
  secondaryText: { color: '#1f2937', fontWeight: '700' },
  dueValue: { color: '#4b5563', marginTop: 10 },
  clear: { color: '#2563eb', fontWeight: '700', marginTop: 8 },
  saveButton: { marginTop: 28, backgroundColor: '#2563eb', paddingVertical: 15, borderRadius: 13, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cancelButton: { marginTop: 10, paddingVertical: 14, borderRadius: 13, alignItems: 'center', backgroundColor: '#e5e7eb' },
  cancelText: { color: '#374151', fontWeight: '700' },
  deleteButton: { marginTop: 22, paddingVertical: 14, alignItems: 'center' },
  deleteText: { color: '#dc2626', fontWeight: '800' },
});
