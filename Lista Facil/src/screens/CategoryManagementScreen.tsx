import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { Category } from '../types/models';
import { createCategory, deleteCategory, getCategories, renameCategory } from '../db/database';

export default function CategoryManagementScreen() {
  const db = useSQLiteContext();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [name, setName] = React.useState('');
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const load = React.useCallback(async () => setCategories(await getCategories(db)), [db]);
  React.useEffect(() => { load().catch(() => Alert.alert('Erro', 'Não foi possível carregar categorias.')); }, [load]);

  async function add() {
    const clean = name.trim();
    if (!clean) { Alert.alert('Nome obrigatório', 'Informe o nome da categoria.'); return; }
    try { await createCategory(db, clean); setName(''); await load(); }
    catch { Alert.alert('Categoria duplicada', 'Já existe uma categoria com esse nome.'); }
  }

  function edit(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function saveRename() {
    const clean = editingName.trim();
    if (editingId === null || !clean) return;
    try {
      await renameCategory(db, editingId, clean);
      setEditingId(null);
      setEditingName('');
      await load();
    } catch {
      Alert.alert('Erro', 'Não foi possível renomear a categoria.');
    }
  }

  function remove(category: Category) {
    Alert.alert('Excluir categoria', `As tarefas de “${category.name}” ficarão sem categoria.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { try { await deleteCategory(db, category.id); await load(); } catch { Alert.alert('Erro', 'Não foi possível excluir.'); } } },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categorias</Text>
      <Text style={styles.subtitle}>Organize as tarefas por contexto.</Text>
      <View style={styles.addRow}><TextInput value={name} onChangeText={setName} placeholder="Nova categoria" style={styles.input} onSubmitEditing={add} /><Pressable style={styles.addButton} onPress={add}><Text style={styles.addText}>Adicionar</Text></Pressable></View>
      <FlatList data={categories} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.dot} />
          {editingId === item.id ? (
            <>
              <TextInput value={editingName} onChangeText={setEditingName} style={styles.editInput} autoFocus />
              <Pressable onPress={saveRename} style={styles.action}><Text style={styles.edit}>Salvar</Text></Pressable>
              <Pressable onPress={() => setEditingId(null)} style={styles.action}><Text style={styles.delete}>Cancelar</Text></Pressable>
            </>
          ) : (
            <>
              <Text style={styles.name}>{item.name}</Text>
              <Pressable onPress={() => edit(item)} style={styles.action}><Text style={styles.edit}>Editar</Text></Pressable>
              <Pressable onPress={() => remove(item)} style={styles.action}><Text style={styles.delete}>Excluir</Text></Pressable>
            </>
          )}
        </View>
      )} ListEmptyComponent={<Text style={styles.empty}>Nenhuma categoria criada.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 18 },
  heading: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 4, marginBottom: 18 },
  addRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 13, fontSize: 16 },
  addButton: { backgroundColor: '#2563eb', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15 },
  addText: { color: '#fff', fontWeight: '800' },
  list: { paddingTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e5e7eb', padding: 14, marginBottom: 9 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563eb', marginRight: 10 },
  name: { flex: 1, fontWeight: '700', color: '#1f2937', fontSize: 16 },
  editInput: { flex: 1, borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 7, marginRight: 4 },
  action: { paddingHorizontal: 6 },
  edit: { color: '#2563eb', fontWeight: '700' },
  delete: { color: '#dc2626', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6b7280', paddingTop: 40 },
});
