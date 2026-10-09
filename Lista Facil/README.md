# Lista Fácil — Expo + React Native

Aplicativo mobile de tarefas desenvolvido para a atividade acadêmica. Implementado com Expo, React Native, SQLite local e notificações locais.

## Requisitos

- Node.js 22.13+ (recomendado pelo Expo SDK 57)
- npm
- Expo Go no Android/iOS para testes
- Git

## Executar

```bash
npm install
npx expo start
```

Depois, escaneie o QR Code pelo Expo Go.

## Comandos

```bash
npm run typecheck
npm run start
```

## Funcionalidades

- CRUD completo de tarefas;
- persistência de tarefas e categorias em SQLite;
- filtros por status e categoria;
- criação, edição, conclusão/reabertura e exclusão;
- gerenciamento de categorias;
- data e hora opcionais;
- notificações locais agendadas;
- cancelamento/reagendamento de notificações;
- tratamento de permissões e erros;
- navegação entre Lista, Editor e Categorias.

## Arquivos importantes

- `BUILD_LOG.md`: histórico das decisões e desenvolvimento;
- `QUESTIONNAIRE.md`: questionário baseado no que foi fornecido na atividade;
- `src/db/database.ts`: schema e inicialização do SQLite;
- `src/services/notificationService.ts`: notificações locais;
- `src/screens/`: telas principais.

## Observação sobre Expo Go

O projeto usa exclusivamente notificações locais agendadas. Não há registro de Expo Push Token, Device Push Token ou listener de push. O módulo de notificações é carregado sob demanda para evitar que APIs de push sejam avaliadas durante a inicialização no Expo Go. Push remoto continua exigindo development build no Android.
