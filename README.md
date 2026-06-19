# Inventory Service UI

## 1. Service Metadata
| Field | Value |
| :--- | :--- |
| Service / Package Name | `inventory-service-frontend` |
| Execution Boundary | `Frontend UI` |
| Service Version | `1.3.2` |
| Compatible Project Version | `1.3` |
| Blueprint Version | `3` |
| Release Status | `Active` |
| Owner / Maintainer | `@mfauzanfikri` |

## 2. Overview & Purpose
The **Inventory Service UI** is a feature-rich, responsive operator control panel built to manage the product catalog, categorize catalog registers, and perform transaction-safe manual stock adjustments in the My-ERP system. It acts as the primary visual client for inventory managers, providing a live dashboard for low-stock monitoring, product registration forms, and category management lists.

---

## 3. Technology Stack Mapping
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js (v15+) | Enterprise App Router engine, server components, and routing |
| **Library** | React (v19) | Modern component framework and virtual DOM rendering |
| **Language** | TypeScript (v5) | Strict type definitions and safe data adapters |
| **Styling** | Tailwind CSS / Shadcn/ui | Beautiful, harmonized CSS tokens and modern accessible widgets |
| **Form Management** | React Hook Form + Zod | Schema-based client-side form validations |
| **Testing** | Jest + React Testing Library | Comprehensive unit and component validation tests |

---

## 4. Setup & Development Instructions

### Prerequisites
* **Node.js**: `18.x` or later (Recommended: `20.x` or later)
* **Backend API**: An active instance of the **Inventory Service Backend API** running on port `3001` (`http://localhost:3001`).

### Quickstart Commands

#### 1. Setup Environment
Create a `.env.local` file in the root frontend directory to link your backend API:
```env
NEXT_PUBLIC_BACKEND_API_URL="http://localhost:3001"
```

#### 2. Install Dependencies
```bash
# Installs package dependencies
npm install
```

#### 3. Start Local Development Server
```bash
# Starts Next.js server on http://localhost:3000
npm run dev
```

#### 4. Compile & Run in Production
```bash
# Build optimized Next.js static bundles
npm run build

# Start compiled production client
npm run start
```

---

## 5. Testing & Code Quality
Verify client component behaviors and custom data service rules:

```bash
# Run Jest component and unit tests
npm run test

# Run tests in hot-reload watch mode
npm run test:watch

# Execute code formatting and linting validators
npm run lint
```

---

## 6. UI/UX & Specifications Compliance
* **Non-destructive Toggles**: Direct resource deletes are blocked. Toggling categories or products to `inactive` retires them from operation while preserving historic data records.
* **Real-time Synchronization**: Stock counts are fetched fresh on page loading or directly following adjustments.
* **Low Stock / Zero Stock Highlights**: The dashboard automatically flags out-of-stock items in bright red (`quantity == 0`) and low-stock items in amber/orange (`0 < quantity < 5`).
* **Zod Schema Form Guards**: Forms are strictly guarded. Products cannot be registered with invalid or blank SKU formats. SKU input fields are disabled during edits to preserve identity.

---

## 7. Documentation References
* **Documentation Blueprint**: [00_Documentation_Blueprint.md](../inventory-service-docs/00_Documentation_Blueprint.md)
* **Product Requirements (PRD)**: [02_PRD.md](../inventory-service-docs/02_PRD.md)
* **Technical Architecture**: [04_Architecture.md](../inventory-service-docs/04_Architecture.md)
* **Traceability Matrix**: [05_Requirement_Mapping.md](../inventory-service-docs/05_Requirement_Mapping.md)
