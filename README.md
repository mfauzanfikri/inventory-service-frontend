# My-ERP Inventory Service UI

A feature-rich, high-performance inventory management admin dashboard built using **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4** (derived from TailAdmin). This frontend acts as the primary operator control panel for managing product registers, grouping categories, and adjusting transaction-safe stock ledger levels in the My-ERP ecosystem.

---

## 🎨 Design System & Core Features

* **Complete Operator Dashboard**: High-fidelity views for monitoring total SKU counts, low-stock alerts, out-of-stock red-flag indicators, and interactive stock adjustments.
* **Non-destructive Category & Product Lifecycle**: Completely designed around status deactivation (`active` vs. `inactive`), safeguarding transaction history by preventing hard deletes.
* **Theme Customization**: Responsive layouts with elegant glassmorphism effects and fully cohesive Dark Mode 🕶️.
* **Validation Guards**: Form schema validations using React Hook Form and Zod to guarantee clean inputs before making API requests.

---

## 📂 Architecture & Directory Structure

The codebase is built on **Domain-Driven Design (DDD)** and Clean Application Layering:

```text
src/
├── app/                    # Next.js App Router Pages (Dashboard, Products, Categories)
├── components/             # Reusable Visual Widgets, Modals, Forms & Alerts
├── domain/                 # Core Entities, Invariant Rules, and Repository Contracts
│   ├── category/           # Category Entities and Repository types
│   └── product/            # Product Entities and Repository types
├── services/               # Application Services orchestrating Domain & Repo Adapters
├── infrastructure/         # Concrete API and In-Memory Data Adapters
├── hooks/                  # Custom Client-side React Hooks
├── layout/                 # Sidebar, Header, and Global Layout Wrappers
├── types/                  # Global TypeScript Interfaces
└── lib/                    # Core Error Mappers and Result Wrapper Monads
```

---

## ⚙️ Installation & Configuration

### Prerequisites
* **Node.js**: `18.x` or later (Recommended: `20.x` or later)
* **Backend API**: An active instance of the **Inventory Service API** running on its standard port (`http://localhost:3001`).

### 1. Environment Configuration
Create a `.env.local` file in the root directory to define your backend address:

```env
# Backend API service base address (standard default is port 3001)
# You can define either BACKEND_API_URL or NEXT_PUBLIC_BACKEND_API_URL:
NEXT_PUBLIC_BACKEND_API_URL="http://localhost:3001"
```

### 2. Install Dependencies
```bash
# Install packages (use legacy-peer-deps if peer conflicts arise during React 19 resolution)
$ npm install
```

### 3. Start Development Server
```bash
# Starts the dev server on http://localhost:3000
$ npm run dev
```

### 4. Production Build & Execution
```bash
# Compiles Next.js optimized bundles
$ npm run build

# Runs the compiled production server
$ npm run start
```

---

## 🧪 Testing & Code Quality

### Running Unit Tests
Tests are implemented using **Jest** and **React Testing Library** to verify service logic and state transitions:
```bash
# Executes the test suite
$ npm run test

# Watches for changes
$ npm run test:watch
```

### Linting & Formatting Check
Ensure the code satisfies the strict project styles before committing:
```bash
# Run ESLint check
$ npm run lint
```

---

## ⚠️ Known Spec v1.2 Limitations & Constraints

* **Strict Non-Destructive Actions**: Raw resource deletion has been fully deprecated and blocked. In compliance with the My-ERP auditability standard, trying to delete a Category or Product triggers an HTTP `405 Method Not Allowed` error in the API. Operations must be carried out using the toggle switch to deactivate the resources instead.
* **Near Real-Time Freshness**: Stock ledger values are always fetched fresh on page loads, manual dashboard refreshes, or immediately following any successful stock increment/decrement transaction.
* **List Pagination**: Category and Product listings are currently retrieved as ordered, unbounded collections. Offset/Cursor pagination controls are planned for the upcoming v1.3 release.

---

## 📄 License
This application is proprietary and confidential.
