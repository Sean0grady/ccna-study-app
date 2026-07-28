import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ExplanationPanelProps {
  correct: boolean;
  explanation: string;
}

export function ExplanationPanel({ correct, explanation }: ExplanationPanelProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[styles.panel, { backgroundColor: correct ? theme.correctBackground : theme.incorrectBackground }]}>
      <ThemedText type="smallBold" style={{ color: correct ? theme.correct : theme.incorrect }}>
        {correct ? 'Correct' : 'Incorrect'}
      </ThemedText>
      <ThemedText style={styles.explanation}>{explanation}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  explanation: {
    fontSize: 15,
    lineHeight: 21,
  },
});
