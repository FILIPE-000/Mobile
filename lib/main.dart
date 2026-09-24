import 'package:flutter/material.dart';
import 'game_logic.dart';

void main() {
  runApp(const DamasApp());
}

class DamasApp extends StatelessWidget {
  const DamasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jogo de Damas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8D6E63),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F2EB),
      ),
      home: const DamasGameScreen(),
    );
  }
}

class DamasGameScreen extends StatefulWidget {
  const DamasGameScreen({super.key});

  @override
  State<DamasGameScreen> createState() => _DamasGameScreenState();
}

class _DamasGameScreenState extends State<DamasGameScreen> {
  final CheckersGame _game = CheckersGame();

  void _onSquareTapped(Position pos) {
    setState(() {
      _game.selectSquare(pos);
    });
  }

  void _resetGame() {
    setState(() {
      _game.resetGame();
    });
  }

  @override
  Widget build(BuildContext context) {
    final validMoves = _game.selectedPosition != null
        ? _game.getValidMovesForPosition(_game.selectedPosition!)
        : <Move>[];
    final validDestinations = validMoves.map((m) => m.to).toSet();
    final selectablePositions = _game.getSelectablePositions();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'JOGO DE DAMAS',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF5D4037),
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Reiniciar Partida',
            onPressed: _resetGame,
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            // Header Scoreboard & Turn Info
            _buildScoreBoard(),
            const SizedBox(height: 8),
            _buildStatusBanner(),
            const SizedBox(height: 12),

            // Game Board
            Expanded(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: AspectRatio(
                    aspectRatio: 1.0,
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFF3E2723), width: 6),
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black26,
                            blurRadius: 10,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(2),
                        child: _buildBoardGrid(validDestinations, selectablePositions),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),
            // Bottom Action Bar / Reset
            Padding(
              padding: const EdgeInsets.only(bottom: 16.0, left: 16.0, right: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF5D4037),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: _resetGame,
                    icon: const Icon(Icons.replay),
                    label: const Text(
                      'Reiniciar Partida',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),

            // Victory Dialog Overlay if game ended
            if (_game.winner != null) ...[
              _buildVictoryBanner(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildScoreBoard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: Colors.white,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              // Player Light Score
              _buildPlayerInfo(
                title: 'Claras',
                color: Player.light,
                pieceCount: _game.lightPieceCount,
                kingCount: _game.lightKingCount,
                isCurrentTurn: _game.currentPlayer == Player.light && _game.winner == null,
              ),
              Container(width: 1, height: 40, color: Colors.grey.shade300),
              // Player Dark Score
              _buildPlayerInfo(
                title: 'Escuras',
                color: Player.dark,
                pieceCount: _game.darkPieceCount,
                kingCount: _game.darkKingCount,
                isCurrentTurn: _game.currentPlayer == Player.dark && _game.winner == null,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlayerInfo({
    required String title,
    required Player color,
    required int pieceCount,
    required int kingCount,
    required bool isCurrentTurn,
  }) {
    final isLight = color == Player.light;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
      decoration: BoxDecoration(
        color: isCurrentTurn
            ? (isLight ? Colors.amber.shade100 : Colors.grey.shade300)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isCurrentTurn ? const Color(0xFF5D4037) : Colors.transparent,
          width: 2,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isLight ? const Color(0xFFFFFDF7) : const Color(0xFF2C2C2C),
              border: Border.all(color: Colors.black38, width: 1.5),
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: isCurrentTurn ? const Color(0xFF3E2723) : Colors.grey.shade800,
                ),
              ),
              Text(
                'Peças: $pieceCount ${kingCount > 0 ? "($kingCount Damas)" : ""}',
                style: const TextStyle(fontSize: 12, color: Colors.black87),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBanner() {
    if (_game.winner != null) {
      return const SizedBox.shrink();
    }

    final isMandatory = _game.isCaptureMandatory;
    final isMulti = _game.multiCapturePosition != null;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        decoration: BoxDecoration(
          color: isMulti
              ? Colors.orange.shade800
              : isMandatory
                  ? Colors.red.shade700
                  : const Color(0xFF5D4037),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isMulti
                  ? Icons.replay_circle_filled
                  : isMandatory
                      ? Icons.bolt
                      : Icons.arrow_forward_ios,
              color: Colors.white,
              size: 18,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                isMulti
                    ? 'Captura múltipla! Continue jogando com a mesma peça.'
                    : isMandatory
                        ? 'Captura Obrigatória! Peça selecionada deve capturar.'
                        : 'Vez de: ${_game.currentPlayer.name}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBoardGrid(Set<Position> validDestinations, List<Position> selectablePositions) {
    return Column(
      children: List.generate(8, (row) {
        return Expanded(
          child: Row(
            children: List.generate(8, (col) {
              final pos = Position(row, col);
              final isDarkSquare = (row + col) % 2 != 0;
              final isSelected = _game.selectedPosition == pos;
              final isMultiPos = _game.multiCapturePosition == pos;
              final isValidDest = validDestinations.contains(pos);
              final isSelectable = selectablePositions.contains(pos) && _game.selectedPosition == null;
              final piece = _game.board[row][col];

              Color squareColor = isDarkSquare ? const Color(0xFFB58863) : const Color(0xFFF0D9B5);

              return Expanded(
                child: GestureDetector(
                  onTap: () => _onSquareTapped(pos),
                  child: Container(
                    color: squareColor,
                    child: Stack(
                      children: [
                        // Selected or MultiCapture Highlight
                        if (isSelected || isMultiPos)
                          Container(
                            decoration: BoxDecoration(
                              color: isMultiPos
                                  ? Colors.orange.withValues(alpha: 0.6)
                                  : Colors.amber.withValues(alpha: 0.6),
                              border: Border.all(
                                color: isMultiPos ? Colors.deepOrange : Colors.amber.shade800,
                                width: 3,
                              ),
                            ),
                          ),

                        // Highlight piece with mandatory capture available before selection
                        if (isSelectable && piece != null)
                          Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.redAccent.withValues(alpha: 0.8),
                                width: 2.5,
                              ),
                            ),
                          ),

                        // Piece Widget
                        if (piece != null)
                          Center(
                            child: PieceWidget(
                              piece: piece,
                              isSelected: isSelected,
                            ),
                          ),

                        // Destination Highlight
                        if (isValidDest)
                          Center(
                            child: Container(
                              width: piece == null ? 22 : 36,
                              height: piece == null ? 22 : 36,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _game.isCaptureMandatory
                                    ? Colors.redAccent.withValues(alpha: 0.75)
                                    : Colors.green.withValues(alpha: 0.75),
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        );
      }),
    );
  }

  Widget _buildVictoryBanner() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Card(
          margin: const EdgeInsets.all(24),
          elevation: 10,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.emoji_events, color: Colors.amber, size: 64),
                const SizedBox(height: 12),
                Text(
                  'VITÓRIA DAS ${_game.winner!.name.toUpperCase()}!',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF3E2723),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  _game.winReason ?? '',
                  style: const TextStyle(fontSize: 14, color: Colors.black87),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF5D4037),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onPressed: _resetGame,
                  icon: const Icon(Icons.replay),
                  label: const Text('Jogar Novamente'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class PieceWidget extends StatelessWidget {
  final Piece piece;
  final bool isSelected;

  const PieceWidget({
    super.key,
    required this.piece,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    final isLight = piece.player == Player.light;
    final isKing = piece.type == PieceType.king;

    return LayoutBuilder(
      builder: (context, constraints) {
        final size = constraints.maxWidth * 0.82;

        return Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: isLight
                  ? [const Color(0xFFFFFFFF), const Color(0xFFE0E0E0), const Color(0xFFBDBDBD)]
                  : [const Color(0xFF555555), const Color(0xFF2B2B2B), const Color(0xFF141414)],
              stops: const [0.2, 0.7, 1.0],
            ),
            border: Border.all(
              color: isLight ? Colors.grey.shade400 : Colors.black87,
              width: 2.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: isSelected ? 8 : 4,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(
            child: Container(
              width: size * 0.65,
              height: size * 0.65,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isLight ? Colors.grey.shade300 : Colors.grey.shade700,
                  width: 1.5,
                ),
              ),
              child: isKing
                  ? Center(
                      child: Icon(
                        Icons.workspace_premium,
                        color: Colors.amber.shade400,
                        size: size * 0.5,
                        shadows: const [
                          Shadow(
                            color: Colors.black87,
                            blurRadius: 3,
                            offset: Offset(0, 1),
                          )
                        ],
                      ),
                    )
                  : null,
            ),
          ),
        );
      },
    );
  }
}
