import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { addExpense } from './models/expenseModel';

// Categories with icons
const CATEGORIES = [
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'entertainment', name: 'Fun', icon: '🎉' },
    { id: 'bills', name: 'Bills', icon: '💡' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Health', icon: '💊' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'other', name: 'Other', icon: '💸' },
];

export default function AddExpenseScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (!amount || !title) return;

        await addExpense(
            db,
            title,
            parseFloat(amount),
            category,
            date.toISOString()
        );
        router.back();
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <ThemedText type="title" style={styles.headerTitle}>Add Expense</ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="xmark" size={24} color={theme.icon} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.inputGroup, { backgroundColor: theme.surface }]}>
                    <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Amount</ThemedText>
                    <View style={styles.amountInputContainer}>
                        <ThemedText style={[styles.currencyPrefix, { color: theme.text }]}>$</ThemedText>
                        <TextInput
                            style={[styles.amountInput, { color: theme.primary }]}
                            placeholder="0.00"
                            placeholderTextColor={theme.icon}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            autoFocus
                        />
                    </View>
                </View>

                <View style={[styles.inputGroup, { backgroundColor: theme.surface }]}>
                    <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Description</ThemedText>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                        placeholder="What is this for?"
                        placeholderTextColor={theme.icon}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <ThemedText style={[styles.label, { color: theme.textSecondary, marginBottom: 12 }]}>Category</ThemedText>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => {
                            const isSelected = category === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryItem,
                                        {
                                            backgroundColor: isSelected ? theme.primary : theme.surface,
                                            borderColor: isSelected ? theme.primary : theme.border
                                        }
                                    ]}
                                    onPress={() => setCategory(cat.id)}
                                    activeOpacity={0.7}
                                >
                                    <ThemedText style={{ fontSize: 24 }}>{cat.icon}</ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.categoryName,
                                            { color: isSelected ? '#fff' : theme.text }
                                        ]}
                                    >
                                        {cat.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.inputGroup, { backgroundColor: theme.surface }]}>
                    <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Date</ThemedText>
                    <TouchableOpacity
                        style={[styles.dateButton, { backgroundColor: theme.background }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <IconSymbol name="calendar" size={20} color={theme.primary} />
                        <ThemedText style={{ marginLeft: 10, color: theme.text }}>
                            {date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </ThemedText>
                    </TouchableOpacity>

                    {(showDatePicker || Platform.OS === 'ios') && (showDatePicker || Platform.OS === 'android') && (
                        <View style={Platform.OS === 'ios' ? {} : { display: showDatePicker ? 'flex' : 'none' }}>
                            {showDatePicker && Platform.OS === 'android' && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event: any, selectedDate?: Date) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setDate(selectedDate);
                                    }}
                                />
                            )}
                            {Platform.OS === 'ios' && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event: any, selectedDate?: Date) => {
                                        if (selectedDate) setDate(selectedDate);
                                    }}
                                />
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        { backgroundColor: amount && title ? theme.primary : theme.icon, opacity: amount && title ? 1 : 0.7 }
                    ]}
                    onPress={handleSave}
                    disabled={!amount || !title}
                >
                    <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    inputGroup: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyPrefix: {
        fontSize: 32,
        fontWeight: '700',
        marginRight: 4,
    },
    amountInput: {
        fontSize: 40,
        fontWeight: '700',
        flex: 1,
        paddingVertical: 5,
    },
    input: {
        fontSize: 18,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryItem: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 6,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
    },
    saveButton: {
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

