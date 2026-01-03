import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExpenses } from '../models/expenseModel';

type CategoryTotal = {
  category: string;
  total: number;
  percentage: number;
  color: string;
  icon: string;
};

const CATEGORIES_CONFIG: Record<string, { label: string, color: string, icon: string }> = {
  food: { label: 'Food', color: '#FF9F43', icon: '🍔' },
  transport: { label: 'Transport', color: '#54A0FF', icon: '🚗' },
  entertainment: { label: 'Fun', color: '#FD79A8', icon: '🎉' },
  bills: { label: 'Bills', color: '#55EFC4', icon: '💡' },
  shopping: { label: 'Shopping', color: '#A29BFE', icon: '🛍️' },
  health: { label: 'Health', color: '#FF7675', icon: '💊' },
  education: { label: 'Education', color: '#0984E3', icon: '📚' },
  other: { label: 'Other', color: '#636E72', icon: '💸' },
};

export default function SummaryScreen() {
  const db = useSQLiteContext();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [categoryData, setCategoryData] = useState<CategoryTotal[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const allExpenses = await getExpenses(db);

      // Filter for current month (simplification for MVP)
      const now = new Date();
      const currentMonthExpenses = allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const total = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
      setMonthTotal(total);

      // Aggregate by category
      const totals: Record<string, number> = {};
      currentMonthExpenses.forEach(item => {
        const cat = item.category.toLowerCase();
        totals[cat] = (totals[cat] || 0) + item.amount;
      });

      const data: CategoryTotal[] = Object.keys(totals).map(cat => {
        const catTotal = totals[cat];
        const config = CATEGORIES_CONFIG[cat] || CATEGORIES_CONFIG['other'];
        return {
          category: config.label,
          total: catTotal,
          percentage: total > 0 ? catTotal / total : 0,
          color: config.color,
          icon: config.icon,
        };
      }).sort((a, b) => b.total - a.total);

      setCategoryData(data);
    } catch (e) {
      console.error(e);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const formattedCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <ThemedText type="title" style={styles.headerTitle}>Monthly Summary</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.totalCard, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.totalLabel}>Total Spent This Month</ThemedText>
            <ThemedText style={styles.totalAmount}>{formattedCurrency(monthTotal)}</ThemedText>
          </View>

          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: theme.text }]}>Category Breakdown</ThemedText>

          {categoryData.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={{ color: theme.textSecondary }}>No data for this month.</ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {categoryData.map((item, index) => (
                <View key={index} style={[styles.categoryRow, { backgroundColor: theme.surface }]}>
                  <View style={styles.iconContainer}>
                    <ThemedText style={{ fontSize: 20 }}>{item.icon}</ThemedText>
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.rowHeader}>
                      <ThemedText style={[styles.catName, { color: theme.text }]}>{item.category}</ThemedText>
                      <ThemedText style={[styles.catAmount, { color: theme.text }]}>{formattedCurrency(item.total)}</ThemedText>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${item.percentage * 100}%`, backgroundColor: item.color }
                        ]}
                      />
                    </View>
                    <ThemedText style={[styles.percentageText, { color: theme.textSecondary }]}>
                      {(item.percentage * 100).toFixed(1)}%
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  totalCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    gap: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catName: {
    fontSize: 16,
    fontWeight: '600',
  },
  catAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
});

