import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMonthlyBudget } from "../models/budgetModel";
import { deleteExpense, getExpenses, type Expense } from "../models/expenseModel";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const expensesData = await getExpenses(db);
      const budgetData = await getMonthlyBudget(db);

      setExpenses(expensesData);
      setBudget(budgetData);

      const total = expensesData.reduce((sum, item) => sum + item.amount, 0);
      setTotalSpent(total);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = async (id: number) => {
    await deleteExpense(db, id);
    loadData();
  };

  const getProgressColor = () => {
    if (budget === 0) return theme.primary;
    const percentage = totalSpent / budget;
    if (percentage > 1) return theme.error;
    if (percentage > 0.8) return theme.warning;
    return theme.success;
  };

  const formattedCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return '🍔';
      case 'transport': return '🚗';
      case 'education': return '📚';
      case 'entertainment': return '🎬';
      case 'other': return '💸';
      default: return '🛍️';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header Area */}
      <LinearGradient
        colors={theme.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome Back</Text>
              <Text style={styles.mainTitle}>Dashboard</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/budget-settings')}
              style={styles.settingsButton}
              activeOpacity={0.8}
            >
              <IconSymbol name="gearshape.fill" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Budget Card */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Monthly Limit</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={[styles.spentAmount, { color: theme.text }]}>
                {formattedCurrency(totalSpent)}
              </Text>
              <Text style={[styles.budgetAmount, { color: theme.textSecondary }]}>
                {budget > 0 ? formattedCurrency(budget) : 'Not Set'}
              </Text>
            </View>

            <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min((totalSpent / (budget || 1)) * 100, 100)}%`,
                    backgroundColor: getProgressColor()
                  }
                ]}
              />
            </View>
            <Text style={[styles.percentageText, { color: theme.textSecondary }]}>
              {budget > 0 ? `${Math.round((totalSpent / budget) * 100)}% of budget used` : 'Set a budget to track progress'}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Transactions List */}
      <View style={styles.listContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              tintColor={theme.primary}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="tray.fill" size={48} color={theme.icon} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No expenses yet.</Text>
              <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Tap the + button to add one!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.transactionItem, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
                <Text style={{ fontSize: 22 }}>
                  {getCategoryIcon(item.category)}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={[styles.amountText, { color: theme.text }]}>
                  -{formattedCurrency(item.amount)}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={10}>
                  <Text style={[styles.deleteText, { color: theme.error }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => router.push('/add-expense')}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spentAmount: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});


