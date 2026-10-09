# BUILD_LOG — Lista Fácil

Este arquivo registra decisões, mudanças e validações relevantes da implementação. As entradas devem ser mantidas e complementadas durante o desenvolvimento.

## 2026-10-08 — Inicialização

- **Tecnologia principal:** Expo + React Native + TypeScript.
- **Arquitetura:** organização por camadas simples, adequada a uma aplicação educacional pequena: `screens`, `components`, `db`, `services`, `navigation` e `types`.
- **Navegação:** React Navigation Native Stack.
- **Persistência:** `expo-sqlite`, com SQLite local e `SQLiteProvider`.
- **Estado:** estado local React (`useState`) e recarga dos dados ao voltar para a tela de lista.
- **Notificações:** `expo-notifications`, somente notificações locais agendadas; não há servidor de push.
- **Data/hora:** `@expo/ui/community/datetime-picker`, integrado ao ecossistema Expo e disponível no Expo Go para o SDK adotado.
- **Modelo de tarefa:** campos obrigatórios da especificação + `notificationId` para controlar o ciclo de vida do lembrete.
- **Exclusão de categoria:** usa `ON DELETE SET NULL`; tarefas relacionadas continuam existindo e ficam sem categoria.
- **Navegação para edição:** passa somente o `taskId`, e a tela de edição consulta o SQLite para obter os dados atuais.
- **Filtros:** executados em memória sobre as tarefas carregadas do SQLite, combinando status e categoria.
- **Categorias iniciais:** Pessoal, Estudo, Trabalho e Compras são inseridas apenas se ainda não existirem.

## 2026-10-08 — CRUD e telas

- Implementada tela principal com listagem, filtros de status, filtro de categoria e atalho para criar tarefa.
- Implementada tela de criação/edição com título obrigatório, descrição, categoria, status, data e hora.
- Implementada exclusão de tarefa com cancelamento da notificação associada.
- Implementada tela de gerenciamento de categorias com criação, renomeação e exclusão.

## 2026-10-08 — Notificações

- Lembretes são agendados somente quando a tarefa está pendente e possui data/hora futura.
- Ao editar uma tarefa, o lembrete anterior é cancelado antes de um novo ser criado.
- Ao concluir uma tarefa, o lembrete é cancelado.
- Ao reabrir uma tarefa pendente com vencimento futuro, um novo lembrete pode ser criado.
- Se a permissão de notificações for negada, a tarefa continua sendo salva sem notificação.

## 2026-10-08 — Validação do ambiente de entrega

- O projeto foi estruturado para Expo SDK 57 e React Native 0.86.
- A instalação automática das dependências foi tentada neste ambiente, mas o processo de `npm install` excedeu o tempo disponível; portanto, **não foi declarado um build executado com sucesso neste ambiente**.
- A validação final deve ser feita no computador do aluno com `npm install`, `npm run typecheck` e `npx expo start`/Expo Go.

## Próximas validações recomendadas

1. Instalar dependências.
2. Rodar `npm run typecheck`.
3. Corrigir qualquer incompatibilidade de versões reportada pelo Expo CLI.
4. Rodar no Expo Go.
5. Testar criação, edição, conclusão, reabertura e exclusão.
6. Testar persistência fechando e reabrindo o app.
7. Testar categorias e filtros.
8. Testar permissão de notificações e reagendamento/cancelamento.
9. Registrar cada falha/correção adicional neste arquivo.
10. Fazer commits significativos no Git e publicar no GitHub.

## Correção 2026-10-08 — compatibilidade com Expo Go

Foi reproduzido um erro do Expo Go no Android informando que a funcionalidade de **push notifications remotas** de `expo-notifications` foi removida do Expo Go a partir do SDK 53. A atividade, porém, exige somente notificações locais agendadas.

Correção aplicada:
- removido o carregamento de `expo-notifications` durante a inicialização do aplicativo;
- removido o `setNotificationHandler` executado no nível do módulo;
- `expo-notifications` passou a ser carregado de forma lazy somente quando uma operação local de notificação é realmente necessária;
- não existe chamada para `getExpoPushTokenAsync`, `getDevicePushTokenAsync` ou `addPushTokenListener`;
- a criação do canal Android ocorre apenas durante a configuração/agendamento local;
- o aplicativo não solicita nem utiliza token de push remoto.

A documentação atual do Expo diferencia explicitamente push remoto de notificações locais: push remoto exige development build no Android, enquanto notificações locais continuam disponíveis no Expo Go.
