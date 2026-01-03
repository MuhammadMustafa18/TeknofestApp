# Student Expense Tracker - Appathon 2026 Submission

A mobile application for university students to track daily expenses, manage monthly budgets, and analyze spending patterns. Built with React Native (Expo) and TypeScript, utilizing an offline-first architecture with SQLite.

## Functional Features

### Dashboard
- **Budget Tracking**: Real-time progress bar with color-coded status (Safe, Warning, Over Budget).
- **Recent Transactions**: Scrollable transaction history with deletion support.
- **Quick Add**: Floating Action Button for immediate expense entry.

### Expense Management
- **Expense Entry**: Input fields for title, numeric amount, category, and date.
- **Category System**: Categorization including Food, Transport, Education, Entertainment, and Other.
- **Date selection**: Native date selector for accurate record keeping.
- **Validation**: Strict validation to prevent zero or negative amounts and empty titles.

### Analytics and Summary
- **Monthly Summary**: dedicated tab calculating total expenditures for the current month.
- **Category Breakdown**: Percentage-based visualization of spending across different categories.

### Budget Settings
- **Monthly Limit**: Interface to set and update a persistent monthly spending cap.
- **Real-time Updates**: Immediate recalculation of remaining balance upon data changes.

### UI/UX Implementation
- **Custom Theme**: Dedicated design system built with Indigo and Emerald color palettes.
- **System Synchronization**: Automatic support for system Light and Dark modes.
- **Haptic Feedback**: Integrated haptics for navigation interactions.
- **Safe Area Management**: Proper layout handling for modern notched displays.

## Technical Implementation

| Category | Technology | Purpose |
|----------|------------|---------|
| Core | React Native 0.81 | UI Foundation |
| Framework | Expo SDK 52 | Tooling and Hardware API |
| Language | TypeScript | Type Safety |
| Navigation | Expo Router | File-based Routing |
| Database | Expo SQLite | Local Persistence |
| Styling | StyleSheet API | Native Styling |
| Icons | Material Icons | Icon System |

## Project Structure

- `app/`: Contains all application routes and screens.
- `app/(tabs)/`: Implementation of the primary tab navigation (Home, Summary).
- `app/models/`: Data access layer for expenses and budget settings.
- `app/db/`: Database initialization and migration scripts.
- `components/`: Atomic UI components and themed elements.
- `constants/`: Global style constants and theme definitions.
- `hooks/`: Custom React hooks for platform-specific logic.

## Data Persistence

The application employs an offline-first strategy using Expo SQLite.
- **Database**: `expenses.db`
- **Logic**: All CRUD operations are performed asynchronously to maintain UI responsiveness.
- **Persistence**: Data remains available across application restarts and without internet connectivity.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npx expo start
   ```

3. **Deployment**:
   - Use Expo Go on physical devices (Android/iOS).
   - Use `a` for Android emulator or `i` for iOS simulator.

## Technical Checklist Status

- [x] Add Expense (Title, Amount, Category, Date)
- [x] Input Validation
- [x] Mandatory Categories Support
- [x] Date-ordered Expense List
- [x] Edit/Delete Functionality
- [x] Monthly Budget Settings
- [x] Real-time Balance Calculation
- [x] Overspending Visual Indicators
- [x] Monthly/Category Summaries
- [x] Local SQLite Database Persistence
- [x] Full Offline Functionality
