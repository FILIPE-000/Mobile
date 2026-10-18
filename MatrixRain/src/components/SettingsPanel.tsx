import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  speed: number;
  density: number;
  onSpeedChange: (value: number) => void;
  onDensityChange: (value: number) => void;
};

function SettingRow({
  title,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
}: {
  title: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingValue}>{valueLabel}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${title.toLowerCase()}`}
          disabled={value <= min}
          onPress={() => onChange(Math.max(min, Number((value - step).toFixed(2))))}
          style={[styles.stepButton, value <= min && styles.disabledButton]}
        >
          <Text style={styles.stepText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${title.toLowerCase()}`}
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, Number((value + step).toFixed(2))))}
          style={[styles.stepButton, value >= max && styles.disabledButton]}
        >
          <Text style={styles.stepText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SettingsPanel({ speed, density, onSpeedChange, onDensityChange }: Props) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>AJUSTES <Text style={styles.panelHint}>/ AO VIVO</Text></Text>
      <SettingRow
        title="Velocidade"
        valueLabel={`${speed.toFixed(1)}×`}
        value={speed}
        min={0.5}
        max={2.5}
        step={0.5}
        onChange={onSpeedChange}
      />
      <View style={styles.separator} />
      <SettingRow
        title="Densidade"
        valueLabel={`${Math.round(density * 100)}%`}
        value={density}
        min={0.5}
        max={1.8}
        step={0.25}
        onChange={onDensityChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { marginTop: 13, padding: 13, borderRadius: 12, backgroundColor: '#07120b', borderWidth: 1, borderColor: '#153b25' },
  panelTitle: { color: '#b9ffd0', fontSize: 10, fontWeight: '900', letterSpacing: 1.6, marginBottom: 7 },
  panelHint: { color: '#4b8c62', fontWeight: '500' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 42 },
  settingText: { gap: 3 },
  settingTitle: { color: '#d8e8dc', fontSize: 12, fontWeight: '600' },
  settingValue: { color: '#45ed85', fontSize: 11, fontFamily: 'monospace' },
  stepper: { flexDirection: 'row', gap: 8 },
  stepButton: { width: 34, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#2b7547', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c2113' },
  disabledButton: { opacity: 0.35 },
  stepText: { color: '#a9ffc5', fontSize: 20, lineHeight: 23 },
  separator: { height: 1, backgroundColor: '#163522', marginVertical: 4 },
});