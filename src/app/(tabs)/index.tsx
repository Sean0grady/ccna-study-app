import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DomainCard } from '@/components/DomainCard';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDomainStats } from '@/hooks/useDomainStats';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const domainStats = useDomainStats();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            CCNA 200-301
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Pick a domain to practice, or take a mixed exam
          </ThemedText>

          <Pressable
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'exam' } })}
            style={[styles.examButton, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.examButtonText}>Start Mixed Exam (20 Q)</ThemedText>
          </Pressable>

          <ThemedView style={styles.domainList}>
            {domainStats.map((stat) => (
              <DomainCard
                key={stat.id}
                stat={stat}
                onPress={() => router.push({ pathname: '/quiz', params: { mode: 'practice', domain: stat.id } })}
              />
            ))}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    marginTop: -Spacing.one,
  },
  examButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  examButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  domainList: {
    gap: Spacing.two,
  },
});
