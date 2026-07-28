import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getDomainLabel, type DomainId } from '@/data/domains';
import { useTheme } from '@/hooks/use-theme';
import { useQuizSessionStore } from '@/store/useQuizSessionStore';

export default function ResultsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const session = useQuizSessionStore((s) => s.lastCompletedSession);

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
          <EmptyState
            title="No results yet"
            message="Complete a practice session or exam to see your results here."
            actionLabel="Back to Home"
            onAction={() => router.replace('/')}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const missedCount = session.answers.filter((a) => !a.correct).length;
  const breakdownEntries = Object.entries(session.domainBreakdown) as [string, { correct: number; total: number }][];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.score}>
            {session.score.correct}/{session.score.total}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            {Math.round((session.score.correct / Math.max(session.score.total, 1)) * 100)}% correct
          </ThemedText>

          {breakdownEntries.length > 0 && (
            <ThemedView style={styles.breakdown}>
              <ThemedText type="subtitle" style={styles.breakdownTitle}>
                By Domain
              </ThemedText>
              {breakdownEntries.map(([domainId, stat]) => (
                <ThemedView key={domainId} type="backgroundElement" style={styles.breakdownRow}>
                  <ThemedText type="smallBold">{getDomainLabel(domainId as DomainId)}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {stat.correct}/{stat.total} correct
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}

          {missedCount > 0 && (
            <Pressable
              onPress={() => router.replace({ pathname: '/quiz', params: { mode: 'missed' } })}
              style={[styles.button, { backgroundColor: theme.accent }]}>
              <ThemedText style={styles.buttonText}>Review {missedCount} Missed</ThemedText>
            </Pressable>
          )}

          <Pressable onPress={() => router.replace('/')} style={[styles.button, styles.secondaryButton]}>
            <ThemedText style={{ color: theme.accent, fontWeight: '700' }}>Back to Home</ThemedText>
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
    alignItems: 'stretch',
  },
  score: {
    fontSize: 56,
    lineHeight: 60,
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  subtitle: {
    textAlign: 'center',
  },
  breakdown: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  breakdownTitle: {
    fontSize: 20,
  },
  breakdownRow: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
