# StudyPlanner — Academic Task Manager & Calendar

> *"The afternoon notebook"*: a serene warm paper-and-ink workspace to organize your academic exams and assignments, built with a **Local-First** architecture, 0 ms latency, and automatic cloud backup.

![Texto alternativo](/study-planner.png)

---

## 🎯 Project Objective

The goal of **StudyPlanner** is to provide university and high school students with a focused, calm, distraction-free academic planner.

Unlike traditional productivity apps cluttered with intrusive notifications, gamified progress bars, or dependencies on constant internet connectivity, StudyPlanner:
- Clearly answers each day's most important question: **"What should I study/prepare right now?"**.
- Prioritizes **Today's** active workload and the anticipation of upcoming **Exams**.
- Guarantees **100% offline functionality** and instantaneous responsiveness thanks to its *Local-First* architecture.
- Keeps your data safe and synced to the cloud via Google authentication and Firebase Cloud Firestore.

---

## ⚙️ How It Works

### 1. Local-First Architecture (Dexie.js + IndexedDB)
- **Instant Read and Write (0 ms):** Every task creation, edit, or status toggle is saved immediately to the browser's local database (**IndexedDB** via **Dexie.js**). The user interface never blocks or shows loading spinners waiting on network round trips.
- **Full Offline Mode:** Use your planner in lecture halls with poor reception, on the subway, or in libraries without Wi-Fi; once connection is restored, cloud syncing happens seamlessly in the background.

### 2. Background Cloud Synchronization & Backup (Firebase Cloud Firestore)
- **Per-User Isolation:** When signing in with your Google account (Firebase Auth), the app loads your personal notebook and keeps tasks synchronized across devices.
- **Zero-Trust Security (ABAC):** Firestore security rules (`firestore.rules`) enforce strict authorization ensuring each student can only read, write, or delete their own tasks (`resource.data.userId == request.auth.uid`).

### 3. Strict Date Handling (No UTC Timezone Offset)
- **Pure `"YYYY-MM-DD"` Dates:** All due dates are handled as calendar date strings and broken down mathematically via `src/app/lib/dates.ts`. This eliminates the classic native constructor bug (`new Date("YYYY-MM-DD")`) that shifts dates backward by one day in western time zones (e.g., UTC-5 / Americas).

### 4. Notebook Views
- **List View:** Organizes deliveries in natural order of urgency:
  - *Overdue* (highlighted in signal terracotta).
  - *Today* (the active day's tasks).
  - *This Week* (upcoming 7 days).
  - *Later* (future planning).
  - *Completed* (dimmed and strikethrough without disappearing from the record).
- **Week View:** Seven stacked daily blocks (Monday through Sunday) showing visible workload distribution.
- **Month View:** 52px monthly grid with subject indicator dots, exam underlining in terracotta (`signal`), and detailed day inspection.
- **Editorial Sidebar:** Prominent countdown to the closest upcoming exam (featured in 4rem Fraunces), weekly workload bar chart, and subject filter with status indicator.

### 5. Design Direction ("The Afternoon Notebook")
- **Tonal Palette:** Paper background (`#f6f1e7`), surface (`#fffdf8`), ink (`#1c1a17`), muted ink (`#5b564c`), and subtle 1px border lines (`#ddd5c4`).
- **The One Signal Rule:** The terracotta vermillion hue (`signal` `#b9321a`) is strictly reserved for items requiring immediate attention (overdue tasks, exams, today's indicator).
- **Editorial Typography:** Titles and temporal numbers set in **Fraunces** (optical-size serif); UI elements and body text in **Hanken Grotesk** with tabular figures.
- **Dark Mode Support:** Fluid adaptation respecting system `prefers-color-scheme`.

---

## 🛠️ Built With

- **Framework:** Angular 21 (Zoneless, Signals, OnPush)
- **Styling:** Tailwind CSS v4
- **Local Database:** Dexie.js (IndexedDB)
- **Cloud & Authentication:** Firebase SDK v12 (Google Auth, Cloud Firestore)
- **Iconography:** Angular Material Icons
- **Typography:** Fraunces & Hanken Grotesk (Google Fonts)
- **Server:** Express SSR (Node.js)

---

## 🚀 Steps to Clone and Run the Project

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 20 or higher recommended).
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `bun`.
- [Git](https://git-scm.com/).

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/your-username/study-planner.git
cd study-planner
```

*(Replace `your-username/study-planner` with your actual GitHub repository URL).*

---

### 2. Install Dependencies

Install all project dependencies:

```bash
npm install
```

---

### 3. Environment Variables

Copy the example environment configuration file to setup environment variables if required:

```bash
cp .env.example .env
```

> **Note:** Client configuration for Firebase cloud persistence is managed and synchronized in `firebase-applet-config.json` and `src/app/core/services/firebase.service.ts`.

---

### 4. Start the Development Server

Launch the development server:

```bash
npm run dev
```

Once the server has compiled and is running, open your browser at:

```text
http://localhost:3000
```

---

### 5. Code Quality & Production Build

- **Linting & Code Validation:**
  ```bash
  npm run lint
  ```

- **Generate Production Build:**
  ```bash
  npm run build
  ```

---

## 📄 License

This project is available under the MIT License. Feel free to use, adapt, and distribute it.
