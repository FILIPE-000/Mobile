# Mapa de requisitos → implementação

| Requisito | Implementação |
|---|---|
| SQLite para tarefas/categorias | `src/db/database.ts` |
| Persistência após reinício | `SQLiteProvider` + `lista-facil.db` |
| Tela de lista | `src/screens/TaskListScreen.tsx` |
| Tela editor/detalhe | `src/screens/TaskEditorScreen.tsx` |
| Tela categorias | `src/screens/CategoryManagementScreen.tsx` |
| CRUD de tarefas | `src/db/database.ts` + telas |
| CRUD de categorias | `src/db/database.ts` + `CategoryManagementScreen` |
| Status All/Pending/Completed | `TaskListScreen` |
| Filtro por categoria | `TaskListScreen` |
| Data/hora opcional | `TaskEditorScreen` |
| Notificação local | `src/services/notificationService.ts` |
| Reagendamento | cancelamento anterior + novo agendamento no editor |
| Cancelamento ao concluir | `TaskListScreen` / editor |
| Cancelamento ao excluir | `TaskEditorScreen` |
| Permissão de notificações | `requestNotificationPermission()` |
| Categoria excluída | SQLite FK `ON DELETE SET NULL` |
| Navegação | `src/navigation/AppNavigator.tsx` |
| Transferência para edição | somente `taskId` |
| Estado/refresh | React state + `useFocusEffect` |
| Dependências documentadas | `BUILD_LOG.md` |
| Histórico de desenvolvimento | `BUILD_LOG.md` + Git |
