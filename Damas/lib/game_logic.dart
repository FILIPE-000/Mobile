enum Player { light, dark }

extension PlayerExtension on Player {
  Player get opponent => this == Player.light ? Player.dark : Player.light;
  String get name => this == Player.light ? 'Peças Claras' : 'Peças Escuras';
}

enum PieceType { man, king }

class Piece {
  final Player player;
  final PieceType type;

  const Piece({required this.player, required this.type});

  Piece copyWith({Player? player, PieceType? type}) {
    return Piece(
      player: player ?? this.player,
      type: type ?? this.type,
    );
  }
}

class Position {
  final int row;
  final int col;

  const Position(this.row, this.col);

  bool get isValid => row >= 0 && row < 8 && col >= 0 && col < 8;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Position &&
          runtimeType == other.runtimeType &&
          row == other.row &&
          col == other.col;

  @override
  int get hashCode => row.hashCode ^ col.hashCode;

  @override
  String toString() => 'Position($row, $col)';
}

class Move {
  final Position from;
  final Position to;
  final Position? capturedPosition;

  const Move({
    required this.from,
    required this.to,
    this.capturedPosition,
  });

  bool get isCapture => capturedPosition != null;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Move &&
          runtimeType == other.runtimeType &&
          from == other.from &&
          to == other.to &&
          capturedPosition == other.capturedPosition;

  @override
  int get hashCode =>
      from.hashCode ^ to.hashCode ^ (capturedPosition?.hashCode ?? 0);

  @override
  String toString() =>
      'Move(from: $from, to: $to, captured: $capturedPosition)';
}

class CheckersGame {
  late List<List<Piece?>> board;
  Player currentPlayer = Player.light;
  Position? selectedPosition;
  Position? multiCapturePosition;
  Player? winner;
  String? winReason;

  CheckersGame() {
    resetGame();
  }

  void resetGame() {
    board = List.generate(8, (_) => List.filled(8, null));
    currentPlayer = Player.light;
    selectedPosition = null;
    multiCapturePosition = null;
    winner = null;
    winReason = null;

    // Place Dark pieces on rows 0, 1, 2 (dark squares)
    for (int r = 0; r < 3; r++) {
      for (int c = 0; c < 8; c++) {
        if ((r + c) % 2 != 0) {
          board[r][c] = const Piece(player: Player.dark, type: PieceType.man);
        }
      }
    }

    // Place Light pieces on rows 5, 6, 7 (dark squares)
    for (int r = 5; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        if ((r + c) % 2 != 0) {
          board[r][c] = const Piece(player: Player.light, type: PieceType.man);
        }
      }
    }
  }

  int get lightPieceCount {
    int count = 0;
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        if (board[r][c]?.player == Player.light) count++;
      }
    }
    return count;
  }

  int get darkPieceCount {
    int count = 0;
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        if (board[r][c]?.player == Player.dark) count++;
      }
    }
    return count;
  }

  int get lightKingCount {
    int count = 0;
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        final p = board[r][c];
        if (p?.player == Player.light && p?.type == PieceType.king) count++;
      }
    }
    return count;
  }

  int get darkKingCount {
    int count = 0;
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        final p = board[r][c];
        if (p?.player == Player.dark && p?.type == PieceType.king) count++;
      }
    }
    return count;
  }

  bool get isCaptureMandatory {
    if (winner != null) return false;
    List<Move> allMoves = _getAllPossibleMoves(currentPlayer);
    return allMoves.any((m) => m.isCapture);
  }

  List<Move> getValidMovesForCurrentPlayer() {
    if (winner != null) return [];

    if (multiCapturePosition != null) {
      Piece? p = board[multiCapturePosition!.row][multiCapturePosition!.col];
      if (p == null) return [];
      return _getCaptureMovesForPiece(multiCapturePosition!, p);
    }

    List<Move> allMoves = _getAllPossibleMoves(currentPlayer);
    bool hasCaptures = allMoves.any((m) => m.isCapture);

    if (hasCaptures) {
      return allMoves.where((m) => m.isCapture).toList();
    } else {
      return allMoves;
    }
  }

  List<Move> getValidMovesForPosition(Position pos) {
    if (winner != null) return [];
    Piece? piece = board[pos.row][pos.col];
    if (piece == null || piece.player != currentPlayer) return [];

    List<Move> allValidMoves = getValidMovesForCurrentPlayer();
    return allValidMoves.where((m) => m.from == pos).toList();
  }

  List<Position> getSelectablePositions() {
    List<Move> validMoves = getValidMovesForCurrentPlayer();
    return validMoves.map((m) => m.from).toSet().toList();
  }

  void selectSquare(Position pos) {
    if (winner != null) return;

    if (multiCapturePosition != null) {
      List<Move> moves = getValidMovesForCurrentPlayer();
      for (var m in moves) {
        if (m.to == pos) {
          makeMove(m);
          return;
        }
      }
      return;
    }

    if (selectedPosition != null) {
      List<Move> moves = getValidMovesForPosition(selectedPosition!);
      for (var m in moves) {
        if (m.to == pos) {
          makeMove(m);
          return;
        }
      }
    }

    Piece? piece = board[pos.row][pos.col];
    if (piece != null && piece.player == currentPlayer) {
      selectedPosition = pos;
    } else {
      selectedPosition = null;
    }
  }

  bool makeMove(Move move) {
    if (winner != null) return false;

    List<Move> validMoves = getValidMovesForCurrentPlayer();
    if (!validMoves.contains(move)) return false;

    Piece piece = board[move.from.row][move.from.col]!;
    board[move.from.row][move.from.col] = null;

    if (move.capturedPosition != null) {
      board[move.capturedPosition!.row][move.capturedPosition!.col] = null;
    }

    if (piece.type == PieceType.man) {
      if ((piece.player == Player.light && move.to.row == 0) ||
          (piece.player == Player.dark && move.to.row == 7)) {
        piece = piece.copyWith(type: PieceType.king);
      }
    }

    board[move.to.row][move.to.col] = piece;

    if (move.isCapture) {
      List<Move> nextCaptures = _getCaptureMovesForPiece(move.to, piece);
      if (nextCaptures.isNotEmpty) {
        multiCapturePosition = move.to;
        selectedPosition = move.to;
        return true;
      }
    }

    multiCapturePosition = null;
    selectedPosition = null;
    _endTurn();

    return true;
  }

  void _endTurn() {
    currentPlayer = currentPlayer.opponent;

    if (lightPieceCount == 0) {
      winner = Player.dark;
      winReason = 'As peças claras foram totalmente eliminadas!';
      return;
    }

    if (darkPieceCount == 0) {
      winner = Player.light;
      winReason = 'As peças escuras foram totalmente eliminadas!';
      return;
    }

    List<Move> nextPlayerMoves = getValidMovesForCurrentPlayer();
    if (nextPlayerMoves.isEmpty) {
      winner = currentPlayer.opponent;
      winReason = '${currentPlayer.name} não possui movimentos válidos!';
    }
  }

  List<Move> _getAllPossibleMoves(Player player) {
    List<Move> moves = [];
    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        Piece? piece = board[r][c];
        if (piece != null && piece.player == player) {
          Position pos = Position(r, c);
          moves.addAll(_getMovesForPiece(pos, piece));
        }
      }
    }
    return moves;
  }

  List<Move> _getMovesForPiece(Position pos, Piece piece) {
    List<Move> captures = _getCaptureMovesForPiece(pos, piece);
    if (captures.isNotEmpty) {
      return captures;
    }
    return _getNormalMovesForPiece(pos, piece);
  }

  List<Move> _getNormalMovesForPiece(Position pos, Piece piece) {
    List<Move> moves = [];
    if (piece.type == PieceType.man) {
      int forwardDir = piece.player == Player.light ? -1 : 1;
      for (int dc in [-1, 1]) {
        Position target = Position(pos.row + forwardDir, pos.col + dc);
        if (target.isValid && board[target.row][target.col] == null) {
          moves.add(Move(from: pos, to: target));
        }
      }
    } else {
      const directions = [
        Position(-1, -1),
        Position(-1, 1),
        Position(1, -1),
        Position(1, 1),
      ];
      for (var dir in directions) {
        int step = 1;
        while (true) {
          Position target = Position(pos.row + dir.row * step, pos.col + dir.col * step);
          if (!target.isValid || board[target.row][target.col] != null) break;
          moves.add(Move(from: pos, to: target));
          step++;
        }
      }
    }
    return moves;
  }

  List<Move> _getCaptureMovesForPiece(Position pos, Piece piece) {
    List<Move> captures = [];
    if (piece.type == PieceType.man) {
      const directions = [
        Position(-1, -1),
        Position(-1, 1),
        Position(1, -1),
        Position(1, 1),
      ];
      for (var dir in directions) {
        Position mid = Position(pos.row + dir.row, pos.col + dir.col);
        Position land = Position(pos.row + dir.row * 2, pos.col + dir.col * 2);

        if (land.isValid && board[land.row][land.col] == null) {
          Piece? midPiece = board[mid.row][mid.col];
          if (midPiece != null && midPiece.player == piece.player.opponent) {
            captures.add(Move(from: pos, to: land, capturedPosition: mid));
          }
        }
      }
    } else {
      const directions = [
        Position(-1, -1),
        Position(-1, 1),
        Position(1, -1),
        Position(1, 1),
      ];
      for (var dir in directions) {
        int step = 1;
        Position? capturedPos;
        while (true) {
          Position target = Position(pos.row + dir.row * step, pos.col + dir.col * step);
          if (!target.isValid) break;

          Piece? targetPiece = board[target.row][target.col];
          if (targetPiece != null) {
            if (capturedPos != null) {
              break;
            }
            if (targetPiece.player == piece.player) {
              break;
            } else {
              capturedPos = target;
            }
          } else {
            if (capturedPos != null) {
              captures.add(Move(from: pos, to: target, capturedPosition: capturedPos));
            }
          }
          step++;
        }
      }
    }
    return captures;
  }
}
