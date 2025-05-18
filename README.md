# MentorPay - Mentor Payment Management System

A React-based web application for managing mentor payments, sessions, and automated payout calculations with tax deductions.

## ✨ Features

### ✅ Authentication & User Management

- Role-based access (Admin/Mentor)
- Login/Signup with email/password
- Password reset functionality
- Protected routes based on user roles
- Dark mode preference persistence

### 📊 Admin Dashboard

- **Session Management**
  - Add sessions manually or via CSV upload
  - Filter sessions by date range
  - View all sessions in paginated table
  - Export sessions to CSV/Excel
- **Payout Calculations**
  - Automated payout calculations
  - Configurable tax deductions (GST, TDS, Platform Fee)
  - Manual payout adjustments
  - Payout summary with breakdown
- **Receipt Generation**
  - Structured receipt preview
  - Customizable thank-you message
  - One-click PDF generation
  - Email receipt simulation

### 👩‍🏫 Mentor Dashboard

- **Session History**
  - Filter by status (Paid/Pending/Under Review)
  - Filter by date range
  - Export personal sessions to CSV/Excel
- **Payout Tracking**
  - Total payout summary
  - Average rate calculation
  - Download PDF receipts per session
- **Payment Status**
  - Color-coded status indicators
  - Detailed payout breakdowns

## 🛠️ Technical Stack

### Frontend

- **Framework**: React 18
- **State Management**: Context API
- **Routing**: React Router 6
- **UI Components**:
  - Radix UI Primitives
  - Class Variance Authority (CVA)
- **Tables**: TanStack Table v8
- **PDF Generation**: React-PDF
- **Data Export**:
  - Papaparse (CSV)
  - SheetJS (Excel)
- **Date Handling**: date-fns
- **Icons**: React Icons

### Backend (Mock)

- LocalStorage-based mock API
- Simulated authentication
- Session data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm/yarn

### Installation

git clone https://github.com/ksaurabh252/MentorPay
cd mentorpay
npm install
npm run dev
