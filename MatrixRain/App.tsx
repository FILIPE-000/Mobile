import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MatrixRain } from './src/components/MatrixRain';
import { SettingsPanel } from './src/components/SettingsPanel';

export default function App() {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [density, setDensity] = useState(1);
  const [seed, setSeed] = useState(0);

  function restartRain() {
    // Mudar a semente força a chuva a criar colunas com novos valores aleatórios.
    setSeed((current) => current + 1);
    setRunning(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#030806" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EXPERIMENTO DIGITAL</Text>
          <Text style={styles.title}>MATRIX<Text style={styles.titleAccent}> RAIN</Text></Text>
          <Text style={styles.subtitle}>Uma chuva de código, em tempo real.</Text>
        </View>

        <View style={styles.animationFrame}>
          <MatrixRain
            running={running}
            speed={speed}
            density={density}
            seed={seed}
          />
          <View pointerEvents="none" style={styles.frameOverlay}>
            <Text style={styles.liveLabel}>{running ? '● LIVE' : 'Ⅱ PAUSADO'}</Text>
            <Text style={styles.frameHint}>CPU RENDER</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={running ? 'Pausar animação' : 'Retomar animação'}
            style={[styles.primaryButton, !running && styles.resumeButton]}
            onPress={() => setRunning((value) => !value)}
          >
            <Text style={styles.primaryButtonText}>{running ? 'Ⅱ  PAUSAR' : '▶  RETOMAR'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Reiniciar com configuração aleatória"
            style={styles.secondaryButton}
            onPress={restartRain}
          >
            <Text style={styles.secondaryButtonText}>↻  NOVA CHUVA</Text>
          </TouchableOpacity>
        </View>

        <SettingsPanel
          speed={speed}
          density={density}
          onSpeedChange={setSpeed}
          onDensityChange={setDensity}
        />

        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>CARACTERES ALEATÓRIOS · SEM VÍDEOS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#030806' },
  screen: { flex: 1, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 10 },
  header: { marginBottom: 14 },
  eyebrow: { color: '#4cba7a', fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  title: { color: '#effff4', fontSize: 30, fontWeight: '900', letterSpacing: 1.2, marginTop: 5 },
  titleAccent: { color: '#35f27b' },
  subtitle: { color: '#89a394', fontSize: 12, marginTop: 4 },
  animationFrame: {
    flex: 1,
    minHeight: 220,
    borderWidth: 1,
    borderColor: '#174d31',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000402',
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  liveLabel: { alignSelf: 'flex-start', color: '#7affaa', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  frameHint: { alignSelf: 'flex-end', color: '#47765b', fontSize: 9, letterSpacing: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryButton: {
    flex: 1, minHeight: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1ce66b',
  },
  resumeButton: { backgroundColor: '#137b43' },
  primaryButtonText: { color: '#031509', fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  secondaryButton: {
    flex: 1, minHeight: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#28794a', backgroundColor: '#08170e',
  },
  secondaryButtonText: { color: '#a5ffc4', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 13, gap: 7 },
  footerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#35f27b' },
  footerText: { color: '#5d7968', fontSize: 9, letterSpacing: 1.2 },
});