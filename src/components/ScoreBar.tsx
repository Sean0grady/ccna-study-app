import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScoreBarProps {
  percent: number | null;
}

export function ScoreBar({ percent }: ScoreBarProps) {
  const theme = useTheme();
  const value = percent ?? 0;
  const color = value >= 80 ? theme.correct : value >= 50 ? theme.accent : theme.incorrect;

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: Spacing.two,
    borderRadius: Spacing.one,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: Spacing.one,
  },
});
