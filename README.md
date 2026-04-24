# DoxVerify — Modern Document Authentication Platform

A modern clone of doxcheck.com functionality, built with React + Vite, Ant Design, Tailwind CSS v4, and TanStack Query.

## Tech Stack
- React 18 + Vite
- React Router v6
- Ant Design (antd) + @ant-design/icons
- Tailwind CSS v4
- TanStack Query v5
- DayJS

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with authentication code search |
| `/verify/:code` | Document verification result page |
| `/admin` | Admin panel to manage documents |

## Sample Codes to Test
- `DIPLOMA1` — Active diploma
- `CERT-2024A` — Active certificate
- `TOR-20220B` — Expired transcript

## Features
- 🔍 Instant document lookup by auth code
- ✅ Verified / Expired / Revoked / Not Found states
- 📋 Admin panel: add, edit, delete, view documents
- 🗄️ Persists data in localStorage
- 🌙 Full dark theme with Syne + DM Sans typography
- 📱 Responsive layout
