# ⚓ SAIL VRS Portal

> **Voluntary Retirement Scheme Management System** for Steel Authority of India Limited (SAIL).
> A unified portal to evaluate employee eligibility, calculate VRS compensation, and manage the application queue — implemented from **20 May 2026** onwards.

---

## 📁 Project Structure

```
sail-vrs-portal/
│
├── 🖥️ frontend/                  # React.js + Vite + Tailwind CSS v4 + shadcn/ui
│    ├── src/
│    │    ├── components/
│    │    │    └── ui/             # shadcn/ui generated components (Button, Card, etc.)
│    │    ├── pages/               # Route-level pages (Employee Form, Admin Dashboard)
│    │    ├── services/            # Axios API service calls
│    │    └── main.tsx
│    ├── index.html
│    ├── components.json           # shadcn/ui configuration file
│    ├── vite.config.ts
│    └── package.json
│
├── ⚙️ backend/                   # Node.js + Express REST API
│    ├── src/
│    │    ├── routes/              # API route definitions
│    │    ├── controllers/         # Business logic handlers
│    │    └── middleware/          # Auth, validation, error handling
│    ├── db/
│    │    ├── schema.sql           # MySQL table creation scripts
│    │    └── migrations/          # Schema versioning scripts
│    └── package.json
│
├── 📖 docs/                      # SRS, DB diagrams, architecture docs
│    └── architecture-diagram.png
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer          | Technology                        | Purpose                                            |
|----------------|-----------------------------------|----------------------------------------------------|
| Frontend       | React.js + Vite                   | SPA scaffolding & fast dev/build pipeline          |
| UI / Styling   | Tailwind CSS v4 + shadcn/ui       | Utility-first styling & accessible component library |
| Backend        | Node.js + Express.js              | REST API & VRS compensation logic engine           |
| Database       | MySQL                             | Relational storage for employee & application data |
| ORM            | Sequelize (or mysql2 raw queries) | Database access layer                              |
| Version Control | Git + GitHub                    | Source control & CI/CD                             |

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine before setup:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MySQL](https://www.mysql.com/) v8.0 or higher
- [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/sail-vrs-portal.git
cd sail-vrs-portal
```

---

### 2. Database Setup (MySQL)

Log into MySQL and create the database:

```sql
CREATE DATABASE sail_vrs;
```

Then run the schema script to create all tables:

```bash
mysql -u root -p sail_vrs < backend/db/schema.sql
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sail_vrs
JWT_SECRET=your_jwt_secret_here
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`.

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

> **Note:** Tailwind CSS v4 no longer uses a `tailwind.config.ts` file. Configuration is handled directly inside your CSS via `@import "tailwindcss"` — no separate config file is needed.

Install and initialise **shadcn/ui**:

```bash
npx shadcn@latest init
```

This will generate a `components.json` file at the root of `frontend/` and set up the `src/components/ui/` directory. To add individual components (e.g. Button, Card, Table):

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🗃️ Database Schema Overview

### `employees`
| Column              | Type         | Description                              |
|---------------------|--------------|------------------------------------------|
| `employee_id`       | VARCHAR(20)  | Primary Key                              |
| `designation_type`  | ENUM         | `'Executive'` or `'Non-Executive'`       |
| `dob`               | DATE         | Date of Birth                            |
| `doj`               | DATE         | Date of Joining SAIL                     |
| `basic_pay`         | DECIMAL      | Basic salary (₹)                         |
| `da`                | DECIMAL      | Dearness Allowance (₹)                   |
| `created_at`        | TIMESTAMP    | Record creation time                     |

### `grading_history`
| Column          | Type        | Description                                      |
|-----------------|-------------|--------------------------------------------------|
| `id`            | INT (PK)    | Auto-increment primary key                       |
| `employee_id`   | VARCHAR(20) | Foreign key → `employees.employee_id`            |
| `appraisal_year`| VARCHAR(10) | e.g. `'2024-25'`                                 |
| `grade`         | VARCHAR(5)  | Grade label (e.g. `'A'`, `'B+'`)                 |
| `points`        | DECIMAL     | Credit points for that year                      |

### `vrs_applications`
| Column                 | Type        | Description                                          |
|------------------------|-------------|------------------------------------------------------|
| `application_id`       | INT (PK)    | Auto-increment primary key                           |
| `employee_id`          | VARCHAR(20) | Foreign key → `employees.employee_id`                |
| `submission_timestamp` | TIMESTAMP   | For first-come, first-served queue ordering          |
| `status`               | ENUM        | `'Pending'`, `'Approved'`, `'Rejected'`              |
| `formula_a_value`      | DECIMAL     | Computed Formula A payout                            |
| `formula_b_value`      | DECIMAL     | Computed Formula B payout                            |
| `final_compensation`   | DECIMAL     | 75% of lesser formula — final VR payout             |

---

## 🧮 VRS Business Logic

### Eligibility Criteria
- **Age:** Employee must be **50 years or older** as on date of release.
- **Service:** Must have completed **at least 15 years** of continuous service in SAIL (including JV/subsidiary or approved deputation).

### ACP Criteria (Executives Only)
ACP is the Average Credit Point computed over the **last 4 appraisal years**, excluding the most recent year.

| Age on Date of Release      | Required ACP |
|-----------------------------|--------------|
| 50 or more but less than 54 | ≤ 42.5       |
| 54 or more but less than 57 | ≤ 45.0       |
| 57 years or more            | Any ACP      |

> Non-executives are fully exempt from ACP criteria.

### Compensation Formulas

```
Daily Salary = (Basic Pay + DA) / 26

Formula A = (35 × Daily Salary × Completed Years of Service)
          + (25 × Daily Salary × Remaining Years of Service)

Formula B = 30 × Daily Salary × Months Left Before Superannuation (age 60)

Final VR Compensation = 75% of MIN(Formula A, Formula B)
```

### Benefits on Separation
- ✅ Lump-sum VR Compensation
- ✅ Leave Encashment (EL & HPL balance)
- ✅ Provident Fund & Gratuity (as per rules)
- ✅ SAIL Mediclaim coverage (self & spouse)
- ✅ Pension / NPS as on superannuation

> Applications are processed strictly on a **First Come, First Served** basis. Final acceptance is at the sole discretion of SAIL.

---

## 📡 API Endpoints (Reference)

| Method | Endpoint                          | Description                           |
|--------|-----------------------------------|---------------------------------------|
| POST   | `/api/employees`                  | Register a new employee profile       |
| GET    | `/api/employees/:id`              | Fetch employee details                |
| POST   | `/api/applications`               | Submit a new VRS application          |
| GET    | `/api/applications`               | List all applications (Admin)         |
| GET    | `/api/applications/:id`           | Get application status & compensation |
| PATCH  | `/api/applications/:id/status`    | Approve or reject an application      |

---

## 🔒 .gitignore

Ensure your `.gitignore` at the root includes:

```
# Dependencies
node_modules/

# Environment files — never commit these
.env
backend/.env
frontend/.env

# Build outputs
frontend/dist/
backend/dist/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## 📜 Important Disclaimers

- Salary for all calculations is **Basic Pay + DA only**, as on date of release.
- VR benefits are **subject to income tax** as per applicable rules.
- This system is a processing aid — **acceptance of any application remains at the sole discretion of SAIL management**.
- Refer to the **official SAIL VRS scheme document** for complete terms and conditions.

---

## 📄 License

This project is developed for internal use by **Steel Authority of India Limited (SAIL)**.
All rights reserved © SAIL 2026.
