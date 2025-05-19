# MentorPay - Mentor Payment Management System

![MentorPay Dashboard](https://via.placeholder.com/800x400?text=MentorPay+Dashboard)

A comprehensive solution for managing mentor payments with automated calculations, receipt generation, and secure communication.

## ✨ Features

### 1. Session Data Entry & Breakdown (Admin)

✅ **Completed Features:**

- Manual session entry form with validation
- CSV bulk upload capability
- Session fields: Mentor, Date, Time, Duration, Type, Rate
- Smart hourly rate breakdown calculations
- Date range filtering
- Cumulative payout summary

### 2. Payout Calculation Module (Admin)

✅ **Completed Features:**

- Automatic payout calculations
- Tax & deduction configuration (GST, TDS, Platform Fees)
- Final amount breakdown display
- Manual adjustment override with audit logging

### 3. Receipt Generation & Sharing (Admin)

✅ **Completed Features:**

- Interactive receipt preview
- Customizable thank-you messages
- One-click email simulation
- PDF generation with:
  - Session details
  - Rate breakdowns
  - Tax deductions
  - Final payout amount

### 4. Mentor Dashboard

✅ **Completed Features:**

- Filterable session history
- Payout summary visualization
- Receipt download (PDF)
- Payment status indicators:
  - ✅ Paid
  - ⏳ Pending
  - 🔍 Under Review

### 5. Secure Chat Module (Admin ↔ Mentor)

⚠️ **Planned Features:**

- End-to-end encrypted messaging
- Conversation threading
- Timestamped message history
- File attachment support

### 6. Audit Logs & History (Admin)

✅ **Completed Features:**

- Change tracking for all critical actions
- Filterable by:
  - User
  - Date range
  - Session ID
- Before/After diff viewer

### 7. Test Mode & Simulation (Admin)

✅ **Completed Features:**

- Safe payout previews
- Dry-run simulation
- Test mode toggle
- Simulation results dashboard:
  - Total payout
  - Affected mentors
  - Tax deductions
  - Net amounts

### 8. Export & Webhooks

✅ **Completed Features:**

- CSV/Excel export
- Webhook configuration panel:
  - URL setup
  - Secret key
  - Event selection
  - Test capability

⚠️ **Pending Integration:**

- Live webhook triggering (requires backend API)

## 🛠️ Technical Implementation

### Frontend Stack

- **Framework**: React 18
- **State Management**: Context API
- **UI Library**: Radix UI + custom Tailwind components
- **Data Visualization**: React Table (TanStack)
- **PDF Generation**: React-PDF
- **Security**: Crypto-JS for webhook signatures

🚀 Getting Started
Prerequisites

    Node.js v16+

    npm/yarn

git clone https://github.com/ksaurabh252/MentorPay
cd mentorpay
npm install
npm run dev
