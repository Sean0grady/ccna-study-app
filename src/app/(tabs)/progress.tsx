import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScoreBar } from '@/components/ScoreBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProgressStore } from '@/store/useProgressStore';
import { useDomainStats } from '@/hooks/useDomainStats';

export default function ProgressScreen() {
  const domainStats = useDomainStats();
  const examHistory = useProgressStore((state) => state.examHistory);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Progress
          </ThemedText>

          <ThemedView style={styles.section}>
            {domainStats.map((stat) => (
              <ThemedView key={stat.id} type="backgroundElement" style={styles.domainRow}>
                <ThemedText type="smallBold">{stat.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {stat.attempted === 0
                    ? 'Not attempted yet'
                    : `${stat.correct} correct / ${stat.incorrect} incorrect (${stat.accuracy}%)`}
                </ThemedText>
                <ScoreBar percent={stat.accuracy} />
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Exam History
          </ThemedText>
          {examHistory.length === 0 ? (
            <ThemedText themeColor="textSecondary">No mixed exams taken yet.</ThemedText>
          ) : (
            <ThemedView style={styles.section}>
              {examHistory.map((entry) => (
                <ThemedView key={entry.id} type="backgroundElement" style={styles.examRow}>
                  <ThemedText type="smallBold">
                    {entry.scoreCorrect}/{entry.scoreTotal} correct
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Date(entry.takenAt).toLocaleString()}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
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
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  domainRow: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  examRow: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
});
