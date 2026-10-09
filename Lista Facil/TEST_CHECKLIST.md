# Checklist de validação manual

Execute depois de instalar as dependências no computador do projeto.

## Inicialização

- [ ] `npm install` termina sem erro.
- [ ] `npm run typecheck` termina sem erro.
- [ ] `npx expo start` inicia o Metro.
- [ ] QR Code abre no Expo Go.

## Tarefas

- [ ] Criar tarefa apenas com título.
- [ ] Criar tarefa com descrição.
- [ ] Criar tarefa com categoria.
- [ ] Editar tarefa existente.
- [ ] Concluir tarefa.
- [ ] Reabrir tarefa concluída.
- [ ] Excluir tarefa.
- [ ] Título vazio é rejeitado.

## Categorias

- [ ] Criar categoria.
- [ ] Renomear categoria.
- [ ] Excluir categoria.
- [ ] Ao excluir categoria usada, tarefa continua existindo sem categoria.

## Filtros

- [ ] Todas.
- [ ] Pendentes.
- [ ] Concluídas.
- [ ] Filtro por categoria.
- [ ] Combinação de status + categoria.

## Persistência

- [ ] Criar tarefas e categorias.
- [ ] Fechar o aplicativo.
- [ ] Reabrir o aplicativo.
- [ ] Confirmar que os dados continuam presentes.

## Notificações locais

- [ ] Criar tarefa com data/hora futura.
- [ ] Conceder permissão.
- [ ] Confirmar agendamento.
- [ ] Alterar data/hora e confirmar que o lembrete antigo não permanece.
- [ ] Remover data/hora.
- [ ] Concluir tarefa e confirmar cancelamento.
- [ ] Reabrir tarefa com vencimento futuro.
- [ ] Excluir tarefa.
- [ ] Negar permissão e confirmar que o app continua funcionando.

## Pós-teste

- [ ] Atualizar `BUILD_LOG.md` com falhas e correções.
- [ ] Fazer commit significativo.
- [ ] Fazer push para GitHub.
