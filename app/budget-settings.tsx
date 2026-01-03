import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { getMonthlyBudget, setMonthlyBudget } from './models/budgetModel';

export default function BudgetSettingsScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [budget, setBudget] = useState('');

    useEffect(() => {
        getMonthlyBudget(db).then((val: number) => {
            if (val > 0) setBudget(val.toString());
        });
    }, []);

    const handleSave = async () => {
        if (!budget) return;
        await setMonthlyBudget(db, parseFloat(budget));
        router.back();
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <ThemedText type="title" style={styles.headerTitle}>Monthly Budget</ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="xmark" size={24} color={theme.icon} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="chart.pie.fill" size={80} color={theme.primary} />
                    </View>

                    <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Set a monthly spending limit to track your financial health.
                    </ThemedText>

                    <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
                        <ThemedText style={[styles.currency, { color: theme.text }]}>$</ThemedText>
                        <TextInput
                            style={[styles.input, { color: theme.primary }]}
                            value={budget}
                            onChangeText={setBudget}
                            placeholder="0"
                            placeholderTextColor={theme.icon}
                            keyboardType="numeric"
                            autoFocus
                            maxLength={7}
                        />
                    </View>

                    <ThemedText style={[styles.helperText, { color: theme.textSecondary }]}>
                        You can change this at any time.
                    </ThemedText>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            { backgroundColor: budget ? theme.primary : theme.icon, opacity: budget ? 1 : 0.7 }
                        ]}
                        onPress={handleSave}
                        disabled={!budget}
                    >
                        <ThemedText style={styles.saveButtonText}>Set Budget Limit</ThemedText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        flexGrow: 1,
        alignItems: 'center',
        padding: 30,
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 40,
        maxWidth: '80%',
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 24,
        marginBottom: 24,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    currency: {
        fontSize: 40,
        fontWeight: '700',
        marginRight: 8,
    },
    input: {
        fontSize: 56,
        fontWeight: '700',
        minWidth: 100,
        textAlign: 'center',
    },
    helperText: {
        fontSize: 14,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
    },
    saveButton: {
        paddingVertical: 18,
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

