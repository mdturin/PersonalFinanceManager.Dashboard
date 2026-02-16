# Personal Finance Manager Dashboard — Final Product Plan

## 1) Current product state (what exists today)

Based on the current Angular application, the dashboard is already organized around three primary areas:

- **Dashboard tab** with summary metrics, top expense categories, recent transactions, expense trend chart, and income-vs-expense chart.
- **Transactions tab** with filtering (type/account/category/date), list view, and add-transaction dialog flow.
- **Accounts tab** with account summary cards, account list, account mix, and add-account dialog flow.
- **Authentication** via login and route guards.

### Important implementation notes from the current codebase

- The app already expects a backend API at `https://localhost:5001` and consumes endpoints under `/api/*`.
- Some features are still placeholders or partially implemented:
  - Creating a transaction currently returns a local observable and does not call backend (`TODO` in `TransactionService.addTransaction`).
  - Categories are currently hardcoded in the frontend service rather than fetched from backend.
  - Several UI sections are intentionally hidden (`hide` class), indicating planned but unfinished features (budget usage, alerts, advanced actions).
  - Side navigation default config references additional sections (`Budgets`, `Goals`, `Spending trends`, `Cash flow`) that are not implemented as full routed features yet.

---

## 2) Product vision (next stage)

Build a **complete personal finance workspace** where a user can:

1. **Track all financial activity** (accounts + transactions) reliably.
2. **Plan ahead** (budgets + goals + bill reminders).
3. **Understand behavior** (insights, trends, anomalies, forecasting).
4. **Take action** (recommendations, alerts, automation, exports).

---

## 3) Priority roadmap (recommended)

## Phase 1 — Core completeness (highest priority, immediate)

Goal: finish must-have flows so the current product is functionally complete and trustworthy.

### Frontend features

- Complete **create transaction** workflow end-to-end with optimistic loading/error states.
- Add **edit/delete transaction** actions in transaction grid.
- Add **edit account / deactivate account** actions in account list.
- Add **global toast/error system** (instead of console logs).
- Improve **auth UX** with error feedback on failed login and loading states.

### Backend alignment needed (`mdturin/PersonalFinanceManager`)

- Confirm/implement endpoints:
  - `POST /api/transactions`
  - `PUT /api/transactions/{id}`
  - `DELETE /api/transactions/{id}`
  - `PUT /api/accounts/{id}`
- Replace mocked categories with backend:
  - `GET /api/categories`

### Definition of done

- Every CRUD action used in current UI is backed by real API.
- All failed requests show user-facing errors.
- No placeholder/mock data in production code paths.

---

## Phase 2 — Budgets & alerts (next major value release)

Goal: enable proactive money management, not just record keeping.

### New feature set

- New **Budgets** module:
  - Monthly budget per category.
  - Progress bars + threshold warnings (70%, 90%, 100%+).
  - Remaining budget and projected overspend.
- New **Alerts Center**:
  - Low balance alerts.
  - Unusual spending alerts.
  - Upcoming due-payment alerts.

### Backend alignment needed

- `GET/POST/PUT/DELETE /api/budgets`
- `GET /api/alerts`
- Optional: scheduled jobs for alert generation.

### Definition of done

- Budgets tab appears in nav and is fully usable.
- Alerts appear in dashboard and dedicated alerts list.
- Alerts are generated from real transaction/account data.

---

## Phase 3 — Goals, insights, and cashflow intelligence

Goal: help users make better financial decisions.

### New feature set

- **Goals** module:
  - Savings goals with target amount/date.
  - Goal progress from account balances and contributions.
- **Insights pages**:
  - Spending trends by category/merchant/time.
  - Cashflow view (income vs fixed/variable expenses).
  - Month-over-month and year-over-year comparisons.
- **Recurring transactions**:
  - Detect or configure recurring income/expense.
  - Forecast next 30/60/90 days balance.

### Backend alignment needed

- `GET/POST/PUT/DELETE /api/goals`
- `GET /api/insights/spending-trends`
- `GET /api/insights/cashflow`
- `GET /api/forecast`

### Definition of done

- Goals and insights are reachable via route and nav.
- Dashboard highlights key trend/forecast insights.
- Forecast values are generated server-side and reproducible.

---

## Phase 4 — Scale, integrations, and power-user capabilities

Goal: move from useful app to robust platform.

### New feature set

- **Bank sync integrations** (open banking or aggregator).
- **Import/export** (CSV, OFX) with mapping wizard.
- **Multi-currency** and exchange-rate normalization.
- **Household/shared spaces** (multi-user with role permissions).
- **Rules engine** for auto-categorization.

### Definition of done

- Users can onboard data automatically or via file import.
- Teams/households can collaborate safely.
- Categorization effort decreases over time.

---

## 4) Technical architecture plan (frontend + backend contract)

- Introduce a shared **API contract checklist** for frontend/backend:
  - Endpoint, method, request payload, response type, error shape.
- Keep frontend models aligned with backend DTOs:
  - Add explicit interfaces for API responses and validation errors.
- Add `environment.ts` support for API base URL by environment.
- Add centralized request/response error handling + user notifications.
- Add loading state conventions (table-level, page-level, action-level).

---

## 5) Quality plan

- Unit tests for:
  - services (request mapping and filters),
  - critical component logic (filters, dialog submit flow),
  - guards/auth state.
- Add integration/e2e tests for:
  - login,
  - add transaction,
  - apply filters,
  - add account.
- Add CI gates:
  - lint,
  - build,
  - tests.

---

## 6) Suggested timeline (12 weeks)

- **Weeks 1-3:** Phase 1 (core completeness).
- **Weeks 4-6:** Phase 2 (budgets + alerts).
- **Weeks 7-9:** Phase 3 (goals + insights + forecast).
- **Weeks 10-12:** Phase 4 foundations (import/sync + rules groundwork).

---

## 7) Final recommended next features (short answer)

If only a few features can be chosen next, implement these in order:

1. **Complete transaction/account CRUD with backend integration.**
2. **Budgets module with threshold alerts.**
3. **Goals module + recurring transaction forecasting.**
4. **Insights pages (cashflow + category trend drill-down).**
5. **Import/sync capabilities to reduce manual data entry.**

This sequence gives the highest user value earliest while leveraging the structure already present in the current dashboard code.
