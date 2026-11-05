# Found on Campus 🎓

**Found on Campus** is a polished, modern, responsive campus lost-and-found web application designed for university students, faculty, and campus safety staff. The platform streamlines the entire lifecycle of lost and found items: reporting missing property, turning in found items, discovering smart cross-matches, securely verifying ownership with private proof, and coordinating safe exchanges at verified campus service desks.

---

## 🌟 Key Features

### 1. Dual-Action Campus Home
- **"I Lost Something"** & **"I Found Something"** action cards.
- Live campus metrics ticker: Total reports, items in custody, verified returns, and active safe desks.
- Quick search bar with instant keyword chips (e.g. *AirPods*, *Hydro Flask*, *Student ID*, *Dorm Keys*, *TI-84*).
- 3-step campus safety walkthrough explaining theft prevention and verification.

### 2. Comprehensive Item Reporting
- Intuitive modal supporting both **Lost** and **Found** reports.
- **Photo Upload & Presets**: Drag-and-drop or select from your device, or pick from **9 realistic campus preset photos** (MacBook, AirPods, Hydro Flask, Dorm keys, IDs, jackets, backpacks, calculators) for instant demoing.
- Category, color swatch, campus building selection, specific room/spot, and date.
- **Private Identifying Challenge / Secret Proof**:
  - For Found items: Posters define a verification question for claimants (e.g., *"What sticker is on the laptop lid?"* or *"What is the lockscreen photo?"*).
  - For Lost items: Reporters provide a private distinguishing mark kept hidden from public listings.
- Real-time **Live Preview Card** to see how the listing will look before publishing.

### 3. Browse & Filter Hub
- Real-time search across titles, descriptions, categories, colors, and buildings.
- Filter tabs: **All Items**, **Lost Items**, **Found Items**.
- Advanced filter drawer: Category, Campus Building, Status, and Date Range (*Today*, *Past 3 Days*, *Past Week*, *Past Month*).
- Sorter (*Newest First*, *Oldest First*, *Title A-Z*).
- Toggle between **Responsive Card Grid** and **Detailed List View**.

### 4. Explainable Match Radar 🎯
- Smart cross-matching engine pairing Lost reports with Found posts across campus.
- **Explainable 0–100% Score Breakdown**:
  - **Category Match**: +35 points
  - **Color Similarity**: +20 points
  - **Campus Location Proximity**: +20 points
  - **Date Proximity**: +15 points
  - **Descriptive Keyword Overlap**: +10 points
- Sensitivity filter pills (*All Matches ≥40%*, *High Confidence ≥65%*, *Near Certain ≥80%*).
- Side-by-side visual comparison cards with point breakdown chips.

### 5. Private Claim Requests & Ownership Verification
- Claimants are required to supply private details **not visible in public listings**.
- Zero public exposure of personal phone numbers, emails, or student IDs.
- Item posters receive notifications and can review submitted proof.
- **Approve Claim**: Generates a secure **4-digit Handoff PIN** and activates desk exchange.
- **Decline Claim**: Reopens the listing for other claimants with optional polite feedback.

### 6. Clear Lifecycle Status Flow
```
Open ──► Claim Pending ──► Approved ──► Returned 🎉
   │             │
   │             └──► Declined ──► Re-opened
   └──► Flagged / Moderated / Archived
```
- Celebratory confetti triggers upon claim approval and final return completion!

### 7. Safe Campus Handoff Desks
- High-visibility designated exchange points:
  1. **Central Campus Library** — Circulation & Service Desk (1st Floor)
  2. **Student Union** — Main Info & Welcome Desk (Lobby)
  3. **Campus Public Safety & Police HQ** (Building 12 — 24/7 Monitored)
  4. **Campus Tech Hub & IT Help Bar** (Engineering Hall Ground Floor)
- Handoff instructions with attendant ID verification and PIN confirmation.

### 8. User Activity Dashboard
- **My Reported Items**: Manage active posts, review incoming claim proofs, approve/decline, or mark returned.
- **My Claims**: View status of claims submitted on others' items, view designated desk locations, and retrieve your **4-digit Handoff PIN**.
- **Activity Notifications**: Interactive alerts for new claims, match detections, and returns.

### 9. Campus Safety Admin Center
- Executive safety metrics: Total records, flagged items, archived posts, and return efficiency rate.
- Moderation Table with search, review, flag dismissal, content removal, and archival.
- One-click **"Reset Demo Data"** to restore clean initial sample state anytime.

### 10. Demo Persona Switcher
- Built-in header switcher to test all user roles with 1 click:
  - **Alex Rivera** (Undergrad Student — CS)
  - **Jordan Lee** (Student Assistant)
  - **Prof. Marcus Vance** (Faculty Member — Biology)
  - **Officer Davis** (Campus Public Safety & Admin)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Storage**: Browser `localStorage` with initial pre-populated realistic campus seed data
- **Responsive Design**: Tailored for mobile phones, tablets, and wide desktop screens

---

## 🚀 Setup & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### 1. Install Dependencies
```bash
npm install
```
*(On Windows PowerShell if scripts are restricted, run `npm.cmd install`)*

### 2. Start the Development Server
```bash
npm run dev
```
*(Or `npm.cmd run dev`)*

The app will start at `http://localhost:5173`. Open this URL in your web browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🧪 Testing the Main Flows in the Demo

1. **Submit a Lost Report**:
   - Click the red **"I Lost Something"** button in the header or hero.
   - Enter details (or click a quick preset like *Graphing Calculator*).
   - Add a private identifying hint and click **Publish Lost Report**.
2. **Submit a Found Report**:
   - Click the green **"I Found Something"** button.
   - Fill out where you found it, enter a verification question for claimants, and submit.
3. **Browse & Filter Items**:
   - Click **Browse Items** in the navigation bar.
   - Search by keyword (e.g., *"AirPods"*, *"Library"*, *"Hydro Flask"*).
   - Filter by type (*Lost* or *Found*), category, or campus building. Toggle between Grid and List view.
4. **Inspect Matches**:
   - Click **Match Radar** in the top navigation.
   - Observe the explainable matching score breakdown (+35 pts category, +20 pts color, +20 pts building, +15 pts date, +10 pts keywords).
5. **Submit a Private Claim**:
   - Click an item card (e.g. *Blue Hydro Flask*).
   - Click **"This is Mine — Submit Private Claim"**.
   - Answer the finder's verification question and submit.
6. **Approve / Decline a Claim**:
   - Switch persona in the top bar to **Jordan Lee** or view your dashboard.
   - Open the item with a pending claim (e.g. *AirPods Pro*).
   - Inspect the claimant's private proof and click **"Approve & Issue PIN"**.
7. **Mark an Item as Returned**:
   - In the item modal or under **My Activity**, click **"Mark as Returned"** to see celebratory confetti and update the lifecycle state.
8. **Admin Moderation**:
   - Switch to **Officer Davis (Admin)** and click **Admin Center**.
   - Review flagged items, archive posts, or remove inappropriate submissions.

