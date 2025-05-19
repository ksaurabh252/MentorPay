# 🚀 MentorPay - Mentor Payment Management System

A comprehensive platform to streamline mentor session tracking, automated payout calculations, tax deductions, and receipt generation — all with built-in audit logging and optional secure communication.

---

## 🌟 Key Features

### 🧑‍💼 **Admin Portal**

| Feature                | Status  | Description                                |
| ---------------------- | ------- | ------------------------------------------ |
| **Session Management** | ✅ Live | Manual entry + CSV upload with validations |
| **Automated Payouts**  | ✅ Live | Auto-calculated with tax deductions        |
| **Tax Configuration**  | ✅ Live | GST, TDS, and platform fees setup          |
| **Receipt Generation** | ✅ Live | PDF format + email dispatch                |
| **Audit Trail**        | ✅ Live | Full history with before/after viewer      |
| **Test Mode**          | ✅ Live | Run safe simulations for payouts           |

---

### 👩‍🏫 **Mentor Portal**

| Feature                | Status  | Description                         |
| ---------------------- | ------- | ----------------------------------- |
| **Session Submission** | ✅ Live | Structured form with admin approval |
| **Payout Dashboard**   | ✅ Live | Filterable transaction history      |
| **Receipt Downloads**  | ✅ Live | Download individual session PDFs    |
| **Activity Logs**      | ✅ Live | Track personal changes/actions      |

---

### 🔄 **Integrations**

| Feature              | Status     | Description                                   |
| -------------------- | ---------- | --------------------------------------------- |
| **CSV/Excel Export** | ✅ Live    | Full data export functionality                |
| **Webhooks**         | ⚠️ Partial | UI ready; backend trigger pending             |
| **Secure Chat**      | ⏳ Planned | Encrypted messaging with file sharing support |

---

## 🔍 Feature Highlights

### ✅ **Session Entry & Breakdown**

- Add sessions via form or CSV
- Track mentor, date, time, duration, type, and hourly rate
- Cumulative summary & smart breakdowns
- Filter by date range

### ✅ **Payout Calculation Engine**

- Auto-deductions (GST, TDS, fees)
- Override final amounts manually
- Audit all adjustments

### ✅ **PDF Receipts & Email**

- Downloadable receipts with detailed breakdown
- Add thank-you notes
- Simulated email previews

### ✅ **Mentor Payout Dashboard**

- Visual summary of earnings
- Track payment status:
  - ✅ Paid
  - ⏳ Pending
  - 🔍 Under Review

### ✅ **Audit Logging**

- Every change recorded
- Filter logs by session, user, or date
- Visual diff viewer for before/after

### ✅ **Test Mode**

- Dry-run calculations without actual dispatch
- View impact by mentor, session, and tax component

### ✅ **Export & Webhook Panel**

- Export sessions and payouts
- Setup webhook URLs, events, and secrets
- Trigger test payloads (live dispatch pending)

---

## 🧮 Tax Administration

- **Path:** `/admin/taxes`
- **Features:**
  - Real-time rate adjustment (GST, TDS, Platform Fees)
  - Input validation (0–100%)
  - Audit-ready logging of every change for compliance

---

## 📄 Mentor Receipt Flow

    Mentor->>System: Requests receipt
    System->>PDF: Generates document
    PDF->>Mentor: Downloads file
    System->>Database: Logs access

Setup Instructions

git clone https://github.com/ksaurabh252/MentorPay
cd mentorpay
npm install
npm run dev
