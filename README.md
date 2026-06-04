# SAIL Voluntary Retirement Scheme (VRS) Application System

This project is a software application designed for the Steel Authority of India Limited (SAIL) to automate and manage their Voluntary Retirement Scheme (VRS), which was implemented from May 20, 2026. The system serves as a unified portal to evaluate employee eligibility, process performance grading algorithms, calculate financial compensation using dual-formula logic, and manage the application queue.

## 🎯 Core Objectives & Features
Based on the official scheme requirements, the application handles the following core functions:

- **Employee Profiling & Onboarding:** Captures essential initial details including Date of Birth (DOB), Date of Joining (DOJ), basic salary, Dearness Allowance (DA), and designation category (Executive vs. Non-Executive).
- **Automated Eligibility Verification:** Programmatically determines if an employee meets the strict age and service tenure minimums.
- **Grading/ACP Processing Engine:** For executives, the system evaluates the last 4 years of performance appraisals to calculate the Average Credit Point (ACP) and checks it against age-banded limits.
- **Dual-Basket Compensation Calculator:** Automatically computes the exact VRS payout using the official formulas (Formula A and Formula B).
- **Queue Management:** Handles applications strictly on a "first-come, first-served" basis with a timestamped administrative approval workflow, as final acceptance is at SAIL's discretion.

## ⚙️ Business Logic & System Rules

### 1. Eligibility Criteria
- **Age Requirement:** The employee must be **50 years or older** as of the release date. (Superannuation age in SAIL is 60).
- **Service Requirement:** The employee must have completed at least **15 years** of continuous service in SAIL (including JV/subsidiary or approved deputation).

### 2. ACP Criteria (Executives Only)
Non-executives are entirely exempt from this check. For executives, the system calculates the Average Credit Point (ACP) over **4 years of appraisal grading**, specifically excluding the most recent year (e.g., for applications in 2026-27, the 2025-26 grading is skipped).
* **Age 50 to <54 years:** ACP must be **≤ 42.5**
* **Age 54 to <57 years:** ACP must be **≤ 45.0**
* **Age 57 years and above:** Any ACP is accepted.

### 3. Financial Calculation Engine
The system calculates the daily salary based strictly on **Basic Pay + DA** as of the date of release. Two formulas ("baskets") must be computed:
* **Formula A:** `(35 days' salary × completed years of service) + (25 days' salary × remaining years of service)`
* **Formula B:** `(30 days' salary × months left before superannuation at age 60)`
* **Final Payout Rule:** The system will select the **lesser** value between Formula A and Formula B. The final VR Compensation is exactly **75%** of that chosen amount.

### 4. Benefits Tracking Module
The system should flag the applicant's approved profile for the disbursement of additional separation benefits:
- Leave encashment (EL & HPL balance)
- Provident Fund (PF) & Gratuity (as per rules)
- Medical facilities for self & spouse (SAIL Mediclaim)
- Pension / NPS as on superannuation

## 💻 Proposed Architecture & Tech Stack
To ensure a highly responsive, scalable, and easily deployable platform, the following stack is recommended:
* **Backend / API:** Node.js with Express for handling application submissions and complex compensation logic.
* **Database:** MongoDB. A NoSQL approach is ideal for handling flexible employee profiles, arrays for 4-year appraisal grading, and queue timestamping.
* **Frontend:** React / Next.js for building the applicant form and HR/Admin approval dashboards.
* **Hosting/Deployment:** Vercel for fast frontend and serverless API routing, utilizing GitHub for continuous integration.

## 📂 Data Model Draft (Employee Schema)
```javascript
{
  employeeId: String,
  designationType: String, // 'Executive' | 'Non-Executive'
  dob: Date,
  doj: Date,
  salary: {
    basicPay: Number,
    da: Number
  },
  gradingHistory: [{ year: String, grade: String, points: Number }], // Last 4 years
  applicationStatus: String, // 'Pending' | 'Approved' | 'Rejected'
  submissionTimestamp: Date // For first-come, first-serve tracking
}