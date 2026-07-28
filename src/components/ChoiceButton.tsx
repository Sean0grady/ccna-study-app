import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ChoiceButtonProps {
  label: string;
  index: number;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  isRevealed: boolean;
  onPress: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function ChoiceButton({ label, index, isSelected, isCorrectAnswer, isRevealed, onPress }: ChoiceButtonProps) {
  const theme = useTheme();

  let backgroundColor: string = theme.backgroundElement;
  let borderColor: string = 'transparent';
  let textColor: string = theme.text;

  if (isRevealed) {
    if (isCorrectAnswer) {
      backgroundColor = theme.correctBackground;
      borderColor = theme.correct;
      textColor = theme.correct;
    } else if (isSelected) {
      backgroundColor = theme.incorrectBackground;
      borderColor = theme.incorrect;
      textColor = theme.incorrect;
    }
  } else if (isSelected) {
    backgroundColor = theme.backgroundSelected;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isRevealed}
      style={({ pressed }) => [
        styles.choice,
        { backgroundColor, borderColor, opacity: pressed && !isRevealed ? 0.7 : 1 },
      ]}>
      <ThemedText type="smallBold" style={{ color: textColor }}>
        {LETTERS[index]}
      </ThemedText>
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 2,
    padding: Spacing.three,
  },
  label: {
    flex: 1,
  },
});
