import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { randomBetween, randomCharacter, randomColor, randomFont } from '../utils/random';

type Drop = {
  id: number;
  x: number;
  y: number;
  speed: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  character: string;
};

type Props = {
  running: boolean;
  speed: number;
  density: number;
  seed: number;
};

const CHARACTER_HEIGHT = 18;
const TICK_MS = 70;

function createDrops(width: number, height: number, density: number): Drop[] {
  const columnGap = 18;
  const columnCount = Math.max(4, Math.floor(width / columnGap * density));
  return Array.from({ length: columnCount }, (_, index) => ({
    id: index,
    x: (index * width) / columnCount + randomBetween(-3, 3),
    y: randomBetween(-height, height),
    speed: randomBetween(1.2, 4.8),
    fontSize: randomBetween(10, 17),
    fontFamily: randomFont(),
    color: randomColor(),
    character: randomCharacter(),
  }));
}

export function MatrixRain({ running, speed, density, seed }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [frame, setFrame] = useState(0);

  const initialDrops = useMemo(() => {
    if (!size.width || !size.height) return [];
    return createDrops(size.width, size.height, density);
    // A semente é usada como gatilho para gerar um conjunto novo, não como gerador pseudoaleatório.
  }, [size.width, size.height, density, seed]);

  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    setDrops(initialDrops);
  }, [initialDrops]);

  useEffect(() => {
    if (!running || size.height <= 0 || drops.length === 0) return;

    const timer = setInterval(() => {
      setDrops((currentDrops) =>
        currentDrops.map((drop) => {
          const nextY = drop.y + drop.speed * speed;
          const wrappedY = nextY > size.height + 30 ? randomBetween(-100, -20) : nextY;
          // Cada fluxo troca o caractere ocasionalmente para que a sequência nunca seja fixa.
          const nextCharacter = Math.random() < 0.28 ? randomCharacter() : drop.character;
          const nextColor = Math.random() < 0.08 ? randomColor() : drop.color;
          return { ...drop, y: wrappedY, character: nextCharacter, color: nextColor };
        }),
      );
      setFrame((value) => value + 1);
    }, TICK_MS);

    // Limpa o timer quando pausa ou quando o componente é desmontado.
    return () => clearInterval(timer);
  }, [running, speed, size.height, drops.length]);

  function onLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSize((old) => old.width === width && old.height === height ? old : { width, height });
  }

  return (
    <View style={styles.canvas} onLayout={onLayout} accessibilityLabel="Animação Matrix Rain">
      {drops.map((drop) => (
        <Text
          key={drop.id}
          style={{
            position: 'absolute',
            left: drop.x,
            top: drop.y,
            color: drop.color,
            fontSize: drop.fontSize,
            fontFamily: drop.fontFamily,
            lineHeight: CHARACTER_HEIGHT,
            textShadowColor: drop.color,
            textShadowRadius: 4,
            opacity: 0.65 + (drop.id % 4) * 0.1,
          }}
        >
          {drop.character}
          {'\n'}
          {randomCharacter()}
          {'\n'}
          {randomCharacter()}
        </Text>
      ))}
      <View pointerEvents="none" style={styles.frameCounter}>
        <Text style={styles.counterText}>{String(frame).padStart(5, '0')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 220,
    backgroundColor: '#000402',
    overflow: 'hidden',
  },
  frameCounter: { position: 'absolute', right: 10, bottom: 10 },
  counterText: { color: '#1d6d3c', fontSize: 9, fontFamily: 'monospace' },
});