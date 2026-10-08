import 'package:flutter_test/flutter_test.dart';
import 'package:damas/main.dart';

void main() {
  testWidgets('Checkers app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const DamasApp());

    // Verify that game title is displayed.
    expect(find.text('JOGO DE DAMAS'), findsOneWidget);

    // Verify scoreboard player labels exist.
    expect(find.text('Claras'), findsOneWidget);
    expect(find.text('Escuras'), findsOneWidget);
  });
}
