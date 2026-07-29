import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceButton } from '@/components/ChoiceButton';
import { EmptyState } from '@/components/EmptyState';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { QuestionCard } from '@/components/QuestionCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { DomainId } from '@/data/domains';
import { getQuestionsByIds, sampleDomainQuestions, sampleMixedExam } from '@/data/questionLoader';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/useProgressStore';
import { useQuizSessionStore, type QuizMode } from '@/store/useQuizSessionStore';

export default function QuizScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ mode: string; domain?: string; count?: string }>();
  const mode = (params.mode as QuizMode) ?? 'practice';
  const domainId = params.domain as DomainId | undefined;
  const requestedCount = Number(params.count);
  const count = Number.isInteger(requestedCount) && requestedCount > 0 ? requestedCount : undefined;

  const startSession = useQuizSessionStore((s) => s.startSession);
  const selectChoice = useQuizSessionStore((s) => s.selectChoice);
  const nextQuestion = useQuizSessionStore((s) => s.nextQuestion);
  const finishSession = useQuizSessionStore((s) => s.finishSession);
  const questions = useQuizSessionStore((s) => s.questions);
  const currentIndex = useQuizSessionStore((s) => s.currentIndex);
  const selectedIndex = useQuizSessionStore((s) => s.selectedIndex);
  const answers = useQuizSessionStore((s) => s.answers);
  const missedQuestions = useProgressStore((s) => s.missedQuestions);

  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
  }, [mode, domainId, count]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let sessionQuestions;
    if (mode === 'exam') {
      sessionQuestions = sampleMixedExam(count ?? 20);
    } else if (mode === 'missed') {
      sessionQuestions = getQuestionsByIds(Object.keys(missedQuestions));
    } else {
      sessionQuestions = domainId ? sampleDomainQuestions(domainId, count) : [];
    }

    startSession(mode, sessionQuestions, domainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, domainId, count]);

  if (questions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
          <EmptyState
            title="No questions available"
            message="There are no questions to practice right now."
            actionLabel="Back to Home"
            onAction={() => router.replace('/')}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isRevealed = selectedIndex !== null;
  const lastAnswer = answers[answers.length - 1];
  const correctSoFar = answers.filter((a) => a.correct).length;

  const handleNext = () => {
    if (isLastQuestion) {
      finishSession();
      router.replace('/results');
    } else {
      nextQuestion();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="small" themeColor="textSecondary">
            Score: {correctSoFar}/{answers.length}
          </ThemedText>

          <QuestionCard question={currentQuestion} index={currentIndex} total={questions.length} />

          <ThemedView style={styles.choices}>
            {currentQuestion.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                label={choice}
                index={index}
                isSelected={selectedIndex === index}
                isCorrectAnswer={index === currentQuestion.correctAnswer}
                isRevealed={isRevealed}
                onPress={() => selectChoice(index)}
              />
            ))}
          </ThemedView>

          {isRevealed && lastAnswer && (
            <ExplanationPanel correct={lastAnswer.correct} explanation={currentQuestion.explanation} />
          )}

          {isRevealed && (
            <Pressable onPress={handleNext} style={[styles.nextButton, { backgroundColor: theme.accent }]}>
              <ThemedText style={styles.nextButtonText}>{isLastQuestion ? 'Finish' : 'Next'}</ThemedText>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  choices: {
    gap: Spacing.two,
  },
  nextButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
