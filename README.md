# Nexora | Business Budget Optimization & Expense Intelligence Tool

A production-grade, full-stack **MERN** SaaS financial management application designed for modern high-growth businesses. It helps finance leaders track corporate expenses in real time, establish departmental budget caps with proactive threshold warnings, analyze spending anomalies, and generate transparent, rule-based budget optimization recommendations.

---

## 🌟 Key Features

### 1. Financial Dashboard & Executive Metrics
- **Dynamic KPIs**: Total Allocated Business Budget, Month Expenses, Remaining Capital, Monthly Surplus/Savings, and Overall Utilization Percentage.
- **Month-over-Month (MoM) Variance**: Real-time spending comparison against the preceding month with visual indicators.
- **Interactive Recharts Visuals**:
  - **Spending Velocity Area Chart**: Historical 6-month actual spending curve plotted against budget limits.
  - **Category Expense Doughnut**: Proportional breakdown of operational cost centers.
  - **Department Allocation vs Spend Bar Chart**: Side-by-side planned vs actual expenditure per department.
- **Overspending Alert Banner**: Instant warnings when departments cross 80%, 90%, or 100% capacity thresholds.
- **Smart Recommendations Teaser**: Highlights immediate cost-saving opportunities.

### 2. Transaction & Expense Management
- **Full CRUD Ledger**: Record, update, inspect, and delete income and expense transactions.
- **Rich Particulars**: Title, Amount (INR ₹), Category, Department, Date, Payment Method (Bank Transfer, Corporate Card, UPI, etc.), Vendor, and Notes.
- **Multi-Filter & Search**: Real-time debounce search across titles and vendors, category filtering, department filtering, type (income/expense), and custom date ranges.
- **Sorting & Pagination**: Column sorting by date and amount with windowed pagination.
- **Receipt & Invoice Upload**: Integrated Multer attachment supporting images and PDFs with built-in preview modal.
- **CSV Export**: Instant downloadable spreadsheet reports directly from the browser or REST endpoint.

### 3. Departmental Budget Management
- **Spending Caps**: Allocate monthly or quarterly limits by department (Technology, Marketing, Operations, Sales, Human Resources, etc.) and category.
- **Utilization Threshold Alerts**:
  - 🟢 **Healthy**: Utilization &lt; 80%
  - 🟡 **Warning**: Utilization between 80% – 89%
  - 🟠 **Critical**: Utilization between 90% – 99%
  - 🔴 **Exceeded**: Utilization &ge; 100% (with overage calculations)
- **Planned vs. Actual Variance**: Real-time comparison calculating variance amount and percentage.
- **Validation**: Enforces non-negative spending limits and unique constraints per period.

### 4. Smart Budget Optimization Engine
- **Dedicated Optimization Portal**: Independent backend service (`OptimizationEngine`) analyzing transaction velocity and budget caps.
- **Analytical Heuristics**:
  - **Run-Rate Projection**: Predicts end-of-month expenditure based on daily velocity.
  - **Cloud Infrastructure Waste**: Audits idle reserve instances and unoptimized compute tiers.
  - **Duplicate / Overlapping Subscriptions**: Flags overlapping SaaS tooling licenses.
  - **Capital Surplus Rebalancing**: Identifies underutilized budgets (&lt;40% utilization) and recommends reallocating capital to higher-demand departments.
  - **MoM Cost Spikes**: Flags abnormal category surges exceeding 30% month-over-month.
- **Action Execution**:
  - **Accept & Apply**: Automatically recalculates and updates active budget caps.
  - **Review / Dismiss**: Keeps track of review actions with audit timestamps.

### 5. Executive Reports & Analytics
- Multi-dimensional reporting matching custom date ranges.
- Summary metrics: Total Outflows, Inflows, Net Cashflow Surplus, and Operating Savings Margin.
- Category summaries and Department performance variance tables.
- **Printable Reports**: Integrated CSS print stylesheet for executive meetings and PDF export.

### 6. Authentication & Security
- Secure password hashing using `bcryptjs` (salt rounds: 10).
- Stateless JWT authentication with Bearer tokens and HTTP rate limiting.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin`, `Finance Manager`, and `Viewer`.
- **Business Data Isolation**: Strict multi-tenant data segregation keyed by `businessId`.
- Centralized Express error handler and Helmet security headers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React, Recharts, React Router DOM v6, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Helmet, Morgan, Express-Rate-Limit |
| **Database** | MongoDB with Mongoose schemas (supports both embedded in-memory MongoDB and external MongoDB Atlas) |
| **Testing** | Node Native Test Runner, Supertest, Vitest, React Testing Library |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Setup Repository
```bash
# Navigate to project folder
cd "c:/Users/Manash Kumar Rout/Desktop/Manash Minor Project"

# Install all dependencies across root, server, and client in one command:
npm run install:all
```

### 2. Environment Variables
Both `server/.env` and `server/.env.example` are pre-configured:
```env
PORT=5000
NODE_ENV=development
# Set your MongoDB Atlas URI, or leave as default to use the auto-provisioned in-memory instance:
MONGODB_URI=mongodb://127.0.0.1:27017/business_budget_optimizer
JWT_SECRET=super_secure_enterprise_jwt_secret_key_2026_nexora
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
DEFAULT_CURRENCY=INR
```

> **Note on Zero-Config Database:** If a local `mongod` service is not active, the server **automatically initializes a built-in embedded in-memory MongoDB instance** and seeds it with authentic financial records. This allows the application to run out of the box with zero external configuration!

### 3. Start Development Servers
Run both backend API and Vite frontend concurrently with:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🔑 Demo Login Credentials

The login screen provides **one-click instant evaluation buttons** to sign in automatically:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nexora.com` | `Admin@123` | Full access: budgets, transactions, settings, users |
| **Finance Manager** | `finance@nexora.com` | `Finance@123` | Create/edit budgets, record transactions, run optimization |

---

## 🧪 Automated Testing

### Run Server Tests
Tests health endpoint, authentication, authorization, budget calculations, and optimization engine:
```bash
npm run test:server
```

### Run Client Unit Tests
Tests financial formatters, INR representation, and utilization thresholds:
```bash
npm run test:client
```

### Run Full Test Suite
```bash
npm test
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Create user & company account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Current authenticated user profile
- `PUT /api/auth/profile` — Update user name, avatar, or department

### Dashboard
- `GET /api/dashboard/summary?period=YYYY-MM&department=All` — Executive metrics, alerts, recent activity
- `GET /api/dashboard/expense-trends?months=6` — Chronological monthly spend vs budget trend
- `GET /api/dashboard/category-breakdown?period=YYYY-MM` — Proportional category spend

### Transactions
- `GET /api/transactions` — Multi-filter ledger (search, category, department, type, date range, pagination)
- `POST /api/transactions` — Record new transaction (supports receipt upload via multipart/form-data)
- `GET /api/transactions/:id` — Get single transaction details
- `PUT /api/transactions/:id` — Update existing transaction
- `DELETE /api/transactions/:id` — Remove transaction
- `GET /api/transactions/export/csv` — Export filtered transactions as CSV

### Budgets
- `GET /api/budgets?period=YYYY-MM` — Enriched budget allocations with live spend & status
- `POST /api/budgets` — Create spending cap allocation
- `PUT /api/budgets/:id` — Update spending limit
- `DELETE /api/budgets/:id` — Delete budget limit
- `GET /api/budgets/comparison` — Planned vs Actual variance breakdown

### Optimization Engine
- `GET /api/optimization/recommendations` — Fetch potential and realized savings recommendations
- `POST /api/optimization/generate` — Execute real-time financial heuristic analysis
- `PATCH /api/optimization/recommendations/:id` — Mark recommendation as `Accepted`, `Dismissed`, or `Reviewed`

### Reports
- `GET /api/reports/summary` — Aggregated executive report
- `GET /api/reports/expenses` — Detailed transaction list for custom date range

### Departments & Notifications
- `GET /api/departments` — List departments with budget & headcount stats
- `POST /api/departments` — Create department
- `GET /api/notifications` — In-app system alerts
- `PATCH /api/notifications/mark-all-read` — Bulk mark notifications as read

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Set root directory to `client`.
2. Framework preset: **Vite**.
3. Environment variables: `VITE_API_URL=https://your-backend-domain.com/api`.
4. Build command: `npm run build`. Output directory: `dist`.

### Backend (Render / Railway / Heroku)
1. Set root directory to `server`.
2. Build command: `npm install`.
3. Start command: `node index.js`.
4. Environment variables: `NODE_ENV=production`, `PORT=5000`, `MONGODB_URI=<your_mongodb_atlas_uri>`, `JWT_SECRET=<secure_secret>`, `CLIENT_URL=https://your-frontend-domain.com`.

---

## 📄 License
MIT License. Built for enterprise financial intelligence.
