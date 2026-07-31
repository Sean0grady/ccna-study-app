import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getDomainLabel, type DomainId } from '@/data/domains';
import { getAllQuestions, getQuestionCountByDomain } from '@/data/questionLoader';
import { useTheme } from '@/hooks/use-theme';
import type { QuizMode } from '@/store/useQuizSessionStore';

export default function QuizSetupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ mode: string; domain?: string }>();
  const mode = (params.mode as QuizMode) ?? 'practice';
  const domainId = params.domain as DomainId | undefined;

  const available = mode === 'exam' ? getAllQuestions().length : domainId ? getQuestionCountByDomain(domainId) : 0;
  const title = mode === 'exam' ? 'Mixed Exam' : domainId ? getDomainLabel(domainId) : 'Practice';

  const [countText, setCountText] = useState(String(available));
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    const count = Number(countText);
    if (!Number.isInteger(count) || count < 1 || count > available) {
      setError(`Enter a whole number between 1 and ${available}.`);
      return;
    }
    router.push({
      pathname: '/quiz',
      params: { mode, ...(domainId ? { domain: domainId } : {}), count: String(count) },
    });
  };

  if (available === 0) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
          <ThemedText type="title" style={styles.title}>
            No questions available
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          {available} question{available === 1 ? '' : 's'} available
        </ThemedText>

        <ThemedText type="smallBold" style={styles.label}>
          How many questions?
        </ThemedText>
        <TextInput
          value={countText}
          onChangeText={(text) => {
            setCountText(text);
            if (error) setError(null);
          }}
          keyboardType="number-pad"
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement },
          ]}
          placeholderTextColor={theme.textSecondary}
        />
        {error && <ThemedText style={{ color: theme.incorrect }}>{error}</ThemedText>}

        <Pressable onPress={handleStart} style={[styles.button, { backgroundColor: theme.accent }]}>
          <ThemedText style={styles.buttonText}>Start Quiz</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: -Spacing.one,
  },
  label: {
    marginTop: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 18,
  },
  button: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
