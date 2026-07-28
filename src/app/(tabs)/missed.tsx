import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getDomainLabel } from '@/data/domains';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/useProgressStore';

export default function MissedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const missedQuestions = useProgressStore((state) => state.missedQuestions);
  const clearAllMissed = useProgressStore((state) => state.clearAllMissed);

  const entries = useMemo(
    () => Object.values(missedQuestions).sort((a, b) => b.timesMissed - a.timesMissed),
    [missedQuestions]
  );

  if (entries.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <EmptyState
            title="No missed questions"
            message="Questions you answer incorrectly will show up here so you can review them."
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleClearAll = () => {
    Alert.alert('Clear all missed questions?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAllMissed },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Missed Questions
          </ThemedText>

          <Pressable
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'missed' } })}
            style={[styles.practiceButton, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.practiceButtonText}>Practice All Missed ({entries.length})</ThemedText>
          </Pressable>

          <ThemedView style={styles.list}>
            {entries.map((entry) => (
              <ThemedView key={entry.questionId} type="backgroundElement" style={styles.row}>
                <ThemedText type="smallBold">{getDomainLabel(entry.domainId)}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Missed {entry.timesMissed} time{entry.timesMissed === 1 ? '' : 's'} · last on{' '}
                  {new Date(entry.lastMissedAt).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          <Pressable onPress={handleClearAll} style={styles.clearButton}>
            <ThemedText style={{ color: theme.incorrect }}>Clear All</ThemedText>
          </Pressable>
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
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  practiceButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
