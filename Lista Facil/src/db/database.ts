import type { SQLiteDatabase } from 'expo-sqlite';
import type { Category, Task } from '../types/models';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      dueDateTime TEXT,
      createdAt TEXT NOT NULL,
      categoryId INTEGER,
      notificationId TEXT,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.runAsync(
    `INSERT OR IGNORE INTO categories (name) VALUES (?), (?), (?), (?)`,
    'Pessoal', 'Estudo', 'Trabalho', 'Compras'
  );
}

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<{
    id: number; title: string; description: string; completed: number;
    dueDateTime: string | null; createdAt: string; categoryId: number | null; notificationId: string | null;
  }>(`SELECT * FROM tasks ORDER BY completed ASC, COALESCE(dueDateTime, '9999-12-31') ASC, id DESC`);
  return rows.map((row) => ({ ...row, completed: Boolean(row.completed) }));
}

export async function getTask(db: SQLiteDatabase, id: number): Promise<Task | null> {
  const row = await db.getFirstAsync<{
    id: number; title: string; description: string; completed: number;
    dueDateTime: string | null; createdAt: string; categoryId: number | null; notificationId: string | null;
  }>(`SELECT * FROM tasks WHERE id = ?`, id);
  return row ? { ...row, completed: Boolean(row.completed) } : null;
}

export async function createTask(
  db: SQLiteDatabase,
  input: Omit<Task, 'id' | 'createdAt'>,
) {
  const result = await db.runAsync(
    `INSERT INTO tasks (title, description, completed, dueDateTime, createdAt, categoryId, notificationId)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    input.title.trim(), input.description.trim(), input.completed ? 1 : 0,
    input.dueDateTime, new Date().toISOString(), input.categoryId, input.notificationId
  );
  return result.lastInsertRowId;
}

export async function updateTask(db: SQLiteDatabase, task: Task) {
  await db.runAsync(
    `UPDATE tasks SET title = ?, description = ?, completed = ?, dueDateTime = ?, categoryId = ?, notificationId = ? WHERE id = ?`,
    task.title.trim(), task.description.trim(), task.completed ? 1 : 0,
    task.dueDateTime, task.categoryId, task.notificationId, task.id
  );
}

export async function deleteTask(db: SQLiteDatabase, id: number) {
  await db.runAsync(`DELETE FROM tasks WHERE id = ?`, id);
}

export async function getCategories(db: SQLiteDatabase): Promise<Category[]> {
  return db.getAllAsync<Category>(`SELECT id, name FROM categories ORDER BY name COLLATE NOCASE`);
}

export async function createCategory(db: SQLiteDatabase, name: string) {
  const result = await db.runAsync(`INSERT INTO categories (name) VALUES (?)`, name.trim());
  return result.lastInsertRowId;
}

export async function renameCategory(db: SQLiteDatabase, id: number, name: string) {
  await db.runAsync(`UPDATE categories SET name = ? WHERE id = ?`, name.trim(), id);
}

export async function deleteCategory(db: SQLiteDatabase, id: number) {
  await db.runAsync(`DELETE FROM categories WHERE id = ?`, id);
}
