# MentorPay — Mentor Payment Management System

MentorPay is a role-based React app for tracking mentor sessions, calculating payouts with tax deductions, generating PDF receipts, and viewing audit activity.

> Current version uses a **mock API backed by browser localStorage** (no real backend/database).

---

## Key Features

### Admin Portal

| Feature            | Status                | Notes                                                                  |
| ------------------ | --------------------- | ---------------------------------------------------------------------- |
| Session Management | ✅ Live               | Manual entry + date-range filtering                                    |
| CSV Upload         | ⚠️ Partial            | UI/tab may exist; depends on `CSVUpload` component wiring              |
| Automated Payouts  | ✅ Live               | Net payout calculation + manual adjustments + simulation               |
| Tax Configuration  | ✅ Live               | Platform Fee, GST Rate, TDS Rate                                       |
| Receipt Generation | ✅ Live               | PDF generation; email sending is simulated                             |
| Audit Logs         | ✅ Live               | List + filters; diff viewer only when log contains `oldValue/newValue` |
| Test Mode          | ✅ Live               | Safe payout simulation mode                                            |
| Webhooks           | ✅ Live (client-side) | Sends POST to configured URLs with signature header (CORS may apply)   |

### Mentor Portal

| Feature              | Status  | Notes                                                       |
| -------------------- | ------- | ----------------------------------------------------------- |
| Session Submission   | ✅ Live | Saves to localStorage via `createSession()`                 |
| Live Payout Estimate | ✅ Live | Duration × Rate preview in the form                         |
| Mentor Dashboard     | ✅ Live | Filter by date/status + export CSV/Excel + receipt download |
| Activity Logs        | ⚠️ Mock | Uses mocked audit log data                                  |

---

## Feature Highlights

### ✅ Session Entry & Breakdown

- Admin adds sessions via form (CSV upload optional/partial)
- Mentor submits sessions from `/mentor/sessions/new`
- Tracks date, type, duration, rate, payout
- Filter by date range

### ✅ Payout Calculation Engine

- Auto deductions: Platform Fee, GST, TDS
- Admin can apply manual adjustments with reasons
- Simulation supported via Test Mode

### ✅ PDF Receipts & Email

- PDF receipts generated client-side using `@react-pdf/renderer`
- Custom message supported
- “Send via Email” is simulated UI (no email provider configured)

### ✅ Audit Logging

- Audit log list with filters (user/date)
- “View Changes” diff only shows when log includes both `oldValue` and `newValue`

### ✅ Export & Webhooks

- Export sessions as CSV/Excel
- Configure webhooks + secret
- Webhook request includes `X-MentorPay-Signature` header

---

## Tax Administration

- **Path:** `/admin/taxes`
- Configure:
  - Platform Fee (%)
  - GST Rate (%)
  - TDS Rate (%)

---

## Data & Mock API

### LocalStorage Keys

- `sessions`
- `auditLogs`

### Mock API (services/mockApi.js)

- `getSessions()`
- `createSession(sessionData)`
- `updateSession(updatedSession)`
- `deleteSession(sessionId)`
- `getAuditLogs()`

Reset app data:

- Clear site data in browser OR run:
  - `localStorage.removeItem("sessions")`
  - `localStorage.removeItem("auditLogs")`

---

## Routes

### Public

- `/` Home
- `/login`
- `/signup`
- `/forgot-password`
- `/unauthorized`

### Admin

- `/admin/sessions`
- `/admin/payouts`
- `/admin/taxes`
- `/admin/audit-logs`

### Mentor

- `/mentor/dashboard`
- `/mentor/sessions/new`

---

## Demo Credentials

- Admin: `admin@example.com` / `demo123`
- Mentor: `mentor@example.com` / `demo123`

---

## Setup

```bash
git clone https://github.com/ksaurabh252/MentorPay
cd MentorPay
npm install
npm run dev
```
