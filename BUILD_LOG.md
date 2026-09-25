
 Boa noite professor, aqui é filipe faço equipe com Cauã e nos alternamos para enviar as atividades, sou aquele menino que confundiu a atividade e fez uma nova aplicação então vou aproveitar e explicar sobre a aplicação e o passo a passo, eu fiz um jogo de damas usando ia, usei a ia code do android studio acho que era da geminy e usei o chat gpt para me ensinar a usar o ia code que eu não sabia usar, sim eu não sei usar ia que mexe no codigo automaticamentepor favor não me julgue, o prompt que eu usei foi esse:
 
 Implemente completamente neste projeto Flutter um jogo de Damas para dois jogadores locais, jogando no mesmo dispositivo.

Antes de modificar qualquer arquivo, analise a estrutura atual do projeto e preserve o que já estiver funcionando.

REGRAS DO JOGO:
- Tabuleiro 8x8.
- Dois jogadores locais, no mesmo dispositivo.
- Peças comuns movimentam 1 casa na diagonal para frente.
- Peças comuns não podem fazer movimento normal para trás.
- Peças comuns podem capturar peças adversárias nas 4 direções diagonais.
- Se houver uma captura disponível, a captura é obrigatória.
- Capturas múltiplas são permitidas.
- Depois de uma captura, se a mesma peça puder capturar novamente, o jogador deve continuar usando aquela peça.
- Ao chegar à última linha do lado adversário, a peça é promovida a Dama.
- A Dama pode se mover várias casas na diagonal.
- A Dama pode realizar capturas à distância, atravessando exatamente uma peça adversária e podendo pousar em qualquer casa vazia posterior na mesma diagonal.
- Damas também podem realizar capturas múltiplas.
- O jogador vence quando o adversário fica sem peças ou sem movimentos válidos.
- Não implementar modo online, login ou inteligência artificial.

INTERFACE:
- Criar um tabuleiro 8x8 visualmente claro.
- Diferenciar as casas claras e escuras.
- Exibir visualmente as peças dos dois jogadores.
- Diferenciar visualmente as Damas das peças comuns.
- Mostrar o jogador da vez.
- Indicar quando existe captura obrigatória.
- Destacar a peça selecionada e seus movimentos possíveis.
- Destacar as casas disponíveis para captura/movimento.
- Informar quando uma captura múltipla está em andamento.
- Mostrar uma mensagem quando houver vencedor.
- Incluir botão para reiniciar a partida.
- Interface responsiva para celular.
- Não utilizar imagens ou assets externos; desenhar as peças usando widgets Flutter.

ORGANIZAÇÃO:
- Manter a lógica do jogo separada da interface quando for razoável.
- Pode utilizar `lib/main.dart` para a interface e criar `lib/game_logic.dart` para as regras e estado do jogo.
- Não adicionar bibliotecas externas sem necessidade.
- Preferir somente recursos nativos do Flutter.

DOCUMENTAÇÃO:
- Criar ou atualizar `README.md` explicando como executar o projeto e suas funcionalidades.
- Criar ou atualizar `BUILD_LOG.md` registrando o processo real de desenvolvimento, decisões, ferramentas utilizadas e problemas encontrados.
- Registrar corretamente que o agente de programação utilizado é o Gemini Agent Mode dentro do Android Studio.
- Não atribuir ao ChatGPT a edição direta dos arquivos; o ChatGPT está sendo utilizado apenas como apoio para planejamento e elaboração das instruções.
- Se não souber o modelo exato utilizado pelo Gemini, não invente; registre somente o que puder ser confirmado.

VALIDAÇÃO:
- Ao terminar, execute `flutter analyze`.
- Execute os testes existentes do projeto.
- Verifique se o projeto consegue ser compilado para Android.
- Corrija diretamente quaisquer erros encontrados.
- Ao final, informe quais arquivos foram criados ou modificados e o resultado da validação.

e depois coloquei esse outro prompt

Agora valide a implementação. Execute `flutter analyze` e os testes existentes do projeto. Se encontrar erros ou problemas de compilação, corrija-os diretamente nos arquivos. Depois execute novamente `flutter analyze`, os testes e `flutter build apk --debug` para confirmar a correção. Não adicione bibliotecas externas.

fiz esses prompts para evitar que a ia code baixasse coisas desnecessarias no pc já que ele tá rodando o android studio na tora, apareceram problemas, o projeto falhou na primeira tentativa mas na segunda a ia code baixou mais algumas coisas e conseguiu rodar, dentro da aplicação não vi bugs e a aplicação rodou sem problemas.