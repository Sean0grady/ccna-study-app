import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
}

export function QuestionCard({ question, index, total }: QuestionCardProps) {
  return (
    <>
      <ThemedText type="small" themeColor="textSecondary">
        Question {index + 1} of {total} · {question.domain} · {question.topic}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.question}>
        {question.question}
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 22,
    lineHeight: 30,
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
});
