# Questionário da atividade

## Observação importante

O material fornecido para esta implementação informa que existe um questionário que deve ser respondido com base no projeto resultante, porém as perguntas desse questionário **não foram incluídas no conteúdo disponibilizado**.

Para evitar inventar perguntas ou respostas e comprometer a fidelidade da entrega, este arquivo registra essa limitação. Assim que o questionário oficial for fornecido, as respostas devem ser preenchidas com base no código, no `BUILD_LOG.md`, nos testes e no histórico do Git.

## Informações já determinadas pelo projeto

- **Tecnologia:** Expo + React Native + TypeScript.
- **Banco:** SQLite local por meio de `expo-sqlite`.
- **Telas:** Lista de tarefas, Editor/Detalhe e Gerenciamento de categorias.
- **Operações:** criar, editar, concluir/reabrir e excluir tarefas; criar, renomear e excluir categorias.
- **Filtros:** status (Todas, Pendentes, Concluídas) e categoria.
- **Notificações:** locais, agendadas para datas futuras.
- **Estratégia de categoria excluída:** tarefas ficam sem categoria.
- **Estratégia de navegação para edição:** somente o ID da tarefa é passado; os dados são consultados no SQLite.
- **Estado:** estado local do React, com recarga ao retornar para a tela de tarefas.
- **Campo adicional:** `notificationId`, usado para cancelar e reagendar lembretes.
