import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { DomainDisplayStat } from '@/hooks/useDomainStats';
import { useTheme } from '@/hooks/use-theme';

interface DomainCardProps {
  stat: DomainDisplayStat;
  onPress: () => void;
}

export function DomainCard({ stat, onPress }: DomainCardProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="subtitle" style={styles.title}>
          {stat.label}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {stat.questionCount} question{stat.questionCount === 1 ? '' : 's'}
          {stat.missedCount > 0 ? ` · ${stat.missedCount} missed` : ''}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          {stat.accuracy === null ? 'Not started' : `Accuracy: ${stat.accuracy}%`}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
});
