
---

# Appathon 2026: Student Expense Tracker — Mobile App Challenge

## 1. Challenge Overview

University students often struggle to track small daily expenses, leading to significant overspending. This challenge requires participants to build a practical mobile application to record, categorize, and analyze expenses while managing a monthly budget.

| Feature | Specification |
| --- | --- |
| **Duration** | 3 Hours 

 |
| **AI Policy** | AI assistance allowed; No AI IDEs or auto-coding agents 

 |
| **Platform** | Android, iOS, or Cross-platform 

 |
| **Internet** | Not required 

 |
| **Backend** | Optional (not required) 

 |

---

## 2. Requirements

### Core Functional Requirements

* 
**Add Expense:** Users must be able to input a title, numeric amount, category, and date.


* 
**Validation:** The app must prevent empty titles or amounts that are zero or negative.


* 
**Mandatory Categories:** At minimum, the app must include: Food, Transport, Education, Entertainment, and Other.


* 
**Expense List:** A scrollable list ordered by the most recent date first. Each entry must show the title, amount, category, and date.


* 
**Edit & Delete:** Users must be able to modify or remove entries (deletion requires confirmation).


* 
**State Management:** Any changes (add, edit, delete) must be reflected immediately in the UI.



### Budget & Summary Requirements

* 
**Monthly Budget:** Users must be able to set a monthly spending limit.


* 
**Real-time Balance:** The app must calculate and display the remaining budget instantly.


* 
**Overspending Indicator:** The UI must change (e.g., color change, warning, or icon) if expenses exceed the budget.


* 
**Summaries:** Display the total expenses for the selected month and a breakdown by category (numerical or visual).



### Technical & Non-Functional Requirements

* 
**Data Persistence:** All data must be stored in a **local SQLite database**.


* 
**Offline Support:** The app must be fully functional without an internet connection.


* 
**Usability & Stability:** The interface must be intuitive and stable enough to handle empty datasets or rapid interaction without crashing.



---

## 3. Bonus Features (Optional)

* Visual spending analysis via charts (pie or bar).


* Search, filter, or sorting functionality.


* Dark mode support.


* Data export to CSV or PDF.


* Daily spending limits with alerts.



---

## 4. Submission & Evaluation

### Submission Guidelines

* 
**README.md:** Must specify the framework and language used (e.g., Flutter, Kotlin, etc.).


* 
**Excluded Folders:** Do **not** include `node_modules`, `build/`, `.gradle/`, or `Pods/`.


* 
**Archive Format:** A single `.zip` file named `[YourName]_Appathon2026.zip`.


* 
**Deadline:** Upload to Google Classroom before the 3-hour timer expires; late entries will not be evaluated.



### Live Evaluation Process

Participants will demo the app on their own device or emulator to the judges, following this flow:

1. 
**CRUD Walkthrough:** Add, edit, and delete an expense.


2. 
**Budget Stress Test:** Demonstrate the "Overspending Indicator" by exceeding the budget.


3. 
**Persistence Check:** Restart the app to verify data is still there (SQLite check).


4. 
**Code Review:** Judges may inspect SQLite helper classes or state management logic.



### Evaluation Criteria

| Criteria | Weight |
| --- | --- |
| Functional Completeness | 40% 

 |
| UI/UX & Usability | 20% 

 |
| Code Quality & Architecture | 20% 

 |
| Stability & Validation | 10% 

 |
| Bonus Features | 10% 

 |

---
