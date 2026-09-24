# Jogo de Damas em Flutter

Um aplicativo completo e simplificado de **Jogo de Damas** desenvolvido para dois jogadores locais jogando no mesmo celular Android.

---

## Objetivo do Aplicativo

Proporcionar uma experiência fluida, limpa e responsiva de jogo de damas em um único dispositivo móvel, sem necessidade de conexão com a internet, cadastros ou dependências de terceiros.

---

## Como Executar o Projeto

### Pré-requisitos
- Flutter SDK instalado (versão 3.x ou superior)
- Dispositivo Android (ou Emulador Android) conectado com depuração USB ativada

### Passos
1. Abra o terminal na raiz do projeto:
   ```bash
   cd damas
   ```
2. Obtenha as dependências padrão do Flutter (caso necessário):
   ```bash
   flutter pub get
   ```
3. Execute a aplicação no dispositivo/emulador conectado:
   ```bash
   flutter run
   ```

---

## Regras Implementadas

1. **Tabuleiro**: 8x8 casas alternadas claras e escuras (peças jogadas nas casas escuras).
2. **Jogadores**: Dois jogadores locais no mesmo dispositivo (Peças Claras vs. Peças Escuras).
3. **Movimento Comum**: Peças comuns movem-se uma casa na diagonal para frente.
4. **Captura Comum**: Peças comuns podem capturar peças adversárias para frente ou para trás.
5. **Captura Obrigatória**: Se houver alguma captura disponível no turno, movimentos normais ficam bloqueados até que a captura seja realizada.
6. **Múltiplas Capturas**: Se após uma captura a mesma peça possuir nova captura disponível, o jogador deve continuar capturando no mesmo turno com ela.
7. **Promoção a Dama**: Quando uma peça comum atinge a última fileira do lado adversário, ela é promovida a Dama.
8. **Movimento da Dama**: A Dama pode mover-se várias casas vazias na diagonal.
9. **Captura da Dama**: A Dama pode capturar uma peça adversária à distância na diagonal, desde que haja pelo menos uma casa livre para pouso após a captura.
10. **Condição de Vitória**: O jogador vence quando o adversário não possuir mais peças ou não possuir nenhum movimento válido disponível.

---

## Tecnologias Utilizadas

- **Framework**: Flutter
- **Linguagem**: Dart
- **Interface**: Widgets nativos do Flutter Material 3 (sem imagens ou bibliotecas externas)
- **Gerenciamento de Dependências**: Somente bibliotecas nativas inclusas no SDK do Flutter
