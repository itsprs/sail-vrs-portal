# SAIL VRS — Implementation Considerations

> This document captures open questions, schema gaps, edge cases, and recommended features
> identified during initial requirements review. Keep this file in the repo root and check
> off items as they are resolved or consciously deferred.

---

## 1. Unresolved Business Logic

### 1.1 ACP Grade → Points Mapping
The official flyer specifies ACP thresholds but **does not define the points scale** behind each
appraisal grade. Before building the ACP engine, confirm the mapping with your supervisor.

A likely scale (verify before using):

| Grade Label       | Points |
|-------------------|--------|
| Outstanding       | 10     |
| Very Good         | 8      |
| Good              | 6      |
| Average / Fair    | 4      |
| Below Average     | 2      |

- [ ] **Action:** Get the official grade-to-points table from SAIL HR documentation.

---

### 1.2 Daily Salary Divisor
Formula A and B both require a "day's salary." Indian labour practice uses either **26** or **30**
as the monthly divisor. The flyer does not specify.

```
Daily Salary = (Basic Pay + DA) / ?
```

- [ ] **Action:** Confirm whether SAIL uses 26 working days or 30 calendar days as the divisor.

---

### 1.3 "Remaining Years" Unit in Formula A
Formula A contains two terms:

```
(35 days' salary × completed years) + (25 days' salary × remaining years)
```

- **Completed years** = whole years from DOJ to release date (floor, not rounded).
- **Remaining years** = `60 − age on release date` — confirm whether this is expressed in
  **whole years** or **fractional years** (e.g., 7.5 years if 6 months remain in the year).

- [ ] **Action:** Clarify unit precision for "remaining years" with SAIL.

---

### 1.4 Formula A vs. Formula B Tie-Break
The rule is "whichever is **lesser**." If `Formula A === Formula B` exactly, both yield the same
payout, but the codebase should still explicitly document which is selected to avoid ambiguity
in audit logs.

- [ ] **Action:** Document the tie-break rule (e.g., "prefer Formula B on equality") in code comments.

---

### 1.5 Tax / TDS Display
The flyer states: *"VR benefits are subject to income tax."*
The system likely will not deduct TDS, but it should:

- Display a disclaimer on the compensation summary screen.
- Optionally show an estimated tax liability (informational only).

- [ ] **Action:** Decide scope — disclaimer only, or estimated TDS calculation?

---

### 1.6 JV / Subsidiary Service Verification
Eligibility includes service at JV companies or approved deputation. Decide:

- Is this **self-reported** by the employee (with supporting docs uploaded)?
- Or **fetched from an HR system** automatically?

- [ ] **Action:** Define verification method and who has authority to approve combined service claims.

---

## 2. Schema Additions

The fields below are missing from the initial data model draft and should be evaluated for inclusion.

```javascript
{
  // --- Identity & Location ---
  employeeName:    String,
  plant:           String,   // e.g., 'BSP' | 'RSP' | 'DSP' | 'BSL' | 'ISP' | 'SSP'
  department:      String,
  contactInfo: {
    email:         String,
    phone:         String
  },

  // --- Leave Balances (for encashment calculation) ---
  leaveBalance: {
    earnedLeave:   Number,   // EL balance in days
    halfPayLeave:  Number    // HPL balance in days
  },

  // --- Provident Fund ---
  pfAccountNumber: String,

  // --- Computed Compensation Snapshot (store at time of submission) ---
  calculatedCompensation: {
    dailySalary:   Number,
    completedYears: Number,
    remainingYears: Number,
    monthsToSuper:  Number,
    formulaA:      Number,
    formulaB:      Number,
    lesser:        Number,
    finalPayout:   Number    // 75% of lesser
  },

  // --- Admin Workflow ---
  approvedBy:         String,        // HR admin user ID
  approvalTimestamp:  Date,
  rejectionReason:    String,        // Populated if status = 'Rejected'

  // --- Audit ---
  statusHistory: [
    {
      status:    String,             // 'Pending' | 'Approved' | 'Rejected'
      changedBy: String,
      changedAt: Date,
      note:      String
    }
  ]
}
```

---

## 3. Recommended Features

### 3.1 Duplicate Application Guard
An employee must not be able to submit more than one application. Enforce a **unique index** on
`employeeId` in the database and return a clear error on duplicate submission attempts.

```js
// Mongoose example
employeeSchema.index({ employeeId: 1 }, { unique: true });
```

---

### 3.2 Configurable Release Date
The "date of release" is the anchor for all age and service calculations. It **must not be
hardcoded.** Store it as an admin-controlled config variable.

```js
// Example config document in MongoDB
{
  key: 'VRS_RELEASE_DATE',
  value: '2026-05-20',
  updatedBy: 'admin',
  updatedAt: ISODate(...)
}
```

This allows SAIL to run multiple VRS cohorts in future without code changes.

---

### 3.3 PDF Export
Employees and HR will need a printable record. Generate a PDF containing:

- Employee details and eligibility result
- ACP calculation breakdown (executives)
- Formula A and Formula B workings
- Final payout figure
- Application reference number and submission timestamp

Suggested library: **`pdfkit`** (Node.js) or **`react-pdf`** (frontend).

---

### 3.4 Admin Queue Dashboard
The scheme mandates first-come, first-served processing. The admin panel must:

- Display applications **sorted by `submissionTimestamp` ascending**.
- Show queue position prominently.
- Prevent HR from manually re-ordering the queue.
- Log every status change with the admin's identity and timestamp (see `statusHistory` in schema).

---

### 3.5 Audit Log
Every state transition (`Pending → Approved`, `Pending → Rejected`) must be recorded with:

- Who changed the status
- When it was changed
- An optional note/reason

This is already captured in the `statusHistory` array in the schema above.

---

### 3.6 Employee-Facing Application Tracker
After submission, employees should be able to:

- View their queue position.
- See current application status.
- Receive an email/SMS notification on status change.

---

## 4. Edge Cases to Handle

| # | Edge Case | Handling Recommendation |
|---|-----------|-------------------------|
| 4.1 | Employee is **exactly 50** on release date | Age check must be `age >= 50` (inclusive). Verify with `>=`, not `>`. |
| 4.2 | Employee is **exactly 57** on release date | Falls into "57 years or more" — any ACP accepted. Boundary must be `age >= 57`. |
| 4.3 | Employee turns 50 **after** release date | Ineligible. Age is calculated as of the release date, not application date. |
| 4.4 | Fewer than 4 years of appraisal data available | Define fallback: use available years, or flag as incomplete for manual HR review? |
| 4.5 | Most recent year's grade accidentally included in ACP | Enforce exclusion of the current appraisal year in the ACP query/calculation. |
| 4.6 | `Formula A === Formula B` | Document tie-break rule explicitly (see §1.4). |
| 4.7 | Service spans JV/subsidiary | Needs separate verification workflow (see §1.6). |
| 4.8 | Employee re-submits after rejection | Decide policy: allow re-submission? Block permanently? Require HR override? |

---

## 5. Non-Functional Considerations

### 5.1 Security
- All employee data is sensitive PII — enforce **role-based access control (RBAC)**.
- HR admin routes must be protected behind authentication middleware.
- Do not expose raw compensation figures in client-side JS bundles.

### 5.2 Data Integrity
- Store `calculatedCompensation` as a **snapshot at submission time** — do not recalculate
  dynamically after submission, as salary or DA may change.

### 5.3 Timezone
- All dates (DOB, DOJ, submission timestamps) should be stored in **UTC** and converted to IST
  for display. This matters for FCFS queue ordering.

### 5.4 Testing
Recommended test cases for the compensation engine:

```
- Non-executive, age 52, 18 years service → skip ACP, compute payout
- Executive, age 51, ACP = 43.0 → ineligible (exceeds 42.5 limit)
- Executive, age 55, ACP = 44.9 → eligible (within 45.0 limit)
- Executive, age 58, ACP = 99.0 → eligible (any ACP accepted)
- Formula A < Formula B → final = 75% of A
- Formula B < Formula A → final = 75% of B
- Formula A === Formula B → document and test tie-break
```

---

## 6. Open Questions Tracker

| # | Question | Raised By | Status |
|---|----------|-----------|--------|
| Q1 | What is the official grade-to-ACP-points mapping? | Dev | ⏳ Pending |
| Q2 | Daily salary divisor: 26 or 30? | Dev | ⏳ Pending |
| Q3 | Is "remaining years" in Formula A fractional or whole? | Dev | ⏳ Pending |
| Q4 | Will JV service be self-reported or system-verified? | Dev | ⏳ Pending |
| Q5 | Is TDS display/calculation in scope? | Dev | ⏳ Pending |
| Q6 | Policy for re-submission after rejection? | Dev | ⏳ Pending |
| Q7 | Which SAIL plants will use this system? | Dev | ⏳ Pending |

---

*Last updated: June 2026 · Maintainer: Update this file as questions are resolved.*
