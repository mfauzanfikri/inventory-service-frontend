# Service Changelog - Inventory Service Frontend Codebase

All notable technical changes, optimizations, and bug fixes implemented in the **Inventory Service Frontend** codebase are recorded here.

This repository tracks codebase changes via **Service Versions (`MAJOR.MINOR.PATCH`)**.

---

## [1.3.2] - 2026-06-19
This release removes the redundant status selector from the Category and Product edit modals, streamlining form edits.

### Removed
* **Edit Modals Status Selection**: Removed the `status` select controls from `edit-category-modal.tsx` and `edit-product-modal.tsx` as status activation/deactivation is already managed via standalone action buttons on the tables.

### Changed
* **Unit Tests**: Updated `edit-category-modal.test.tsx` to remove the defunct status combobox rendering assertion.
* **Version Bump**: Bumped root package version in `package.json` to `1.3.2`.

---

## [1.3.1] - 2026-06-19
This release simplifies the frontend system design by removing the redundant Domain-Driven Design (DDD) approach.

### Removed
* **Domain Layer**: Deleted the `src/domain/` directory completely, including Domain Value Objects (`CategoryName`, `CategoryDescription`, `ProductName`, `ProductSKU`), Domain Entity models (`CategoryEntity`, `ProductEntity`), Domain Repository interfaces (`CategoryDomainRepository`, `ProductDomainRepository`), and their associated unit tests.

### Changed
* **Infrastructure Layer Simplification**: Simplified `category.api.repository.ts` and `product.api.repository.ts` by removing factory wrapper functions and dependency injection, exporting direct repository objects instead.
* **Service Layer Simplification**: Refactored `category.service.ts` and `product.service.ts` to directly consume API repository objects, inline simple attribute validations, and export service objects directly.
* **Service Unit Tests**: Rewrote service tests to mock repository modules directly using module mocks instead of manual factory mocking.
* **Version Bump**: Bumped root package version in `package.json` to `1.3.1`.

---

## [1.3.0] - 2026-06-19
This release aligns the frontend interfaces with the Project Version 1.3 System Metadata Foundation specifications, upgrades the TypeScript category and product models, and resolves legacy import compilation errors.

### Added
* **Metadata & Version Fields**:
  * <a id="FE-US-SYS-01-001"></a>Added `version`, `createdBy`, and `updatedBy` properties to the `Category` and `Product` TypeScript interfaces, and `version` and `updatedBy` to the `Stock` TypeScript interface (`FE-US-SYS-01-001`).

### Changed
* **User Profile Components Standardized**:
  * Corrected broken legacy imports of `Button` and `Label` in profile card components (`UserAddressCard.tsx`, `UserInfoCard.tsx`, `UserMetaCard.tsx`) to reference the unified `shadcn/ui` components (`@/components/ui/button` and `@/components/ui/label`).
* **Version Bump**: Bumped root package version in `package.json` to `1.3.0`.
* **Documentation Update**:
  * Completed `FE-US-SYS-01-001` task in `ROADMAP.md`.
  * Updated `README.md` metadata block to reflect version `1.3.0` and blueprint version `3`.

---

## [1.2.1] - 2026-06-02
This release cleans up duplicate UI systems, standardizes visual components on `shadcn/ui`, removes obsolete demo folders, extracts a shared API error normalizer, and aligns architectural documentation.

### Added
* **Shared API Error Mapper**: Extracted reusable `mapApiError` utility inside `src/lib/errors/api-error-mapper.ts` to normalize HTTP status codes and validation messages into standard `AppError` values.
* **Local Validation Error Handling**: Upgraded the shared error mapper to cleanly format plain `Error` exceptions thrown by local domain value objects (like `ProductName` or `ProductSKU`) into user-friendly `"VALIDATION_ERROR"` values containing the exact target field (e.g. `"name"`, `"sku"`).

### Changed
* **UI Standardization**:
  * Migrated `SignInForm.tsx` and `SignUpForm.tsx` to use standardized `shadcn/ui` components (`Label` and `Button`) instead of legacy TailAdmin elements.
  * Simplified `product.service.ts` creation validation: Validate inputs directly via domain value objects instead of assembling a massive mock full `Product` dummy object.
* **Version Bump**: Bumped package version cleanly to `1.2.1`.
* **Documentation Alignment**: Re-described the system structure in `README.md` to accurately denote a clean layered architecture style rather than overstating DDD/Clean Architecture.

### Removed
* **Unused Demo Folders**: Purged layout folders and heavy third-party assets not imported by active routes (`calendar`, `charts`, `ecommerce`, `example`, `videos`).
* **Obsolete TailAdmin Custom Components**: Deleted `src/components/ui/button/Button.tsx` and `src/components/form/Label.tsx` as all active pages are standardized on shadcn.

---

## [1.0.0] - 2026-05-28
Initial release of the **Inventory Service UI**, establishing the baseline frontend operator control panel with standard category registers, product onboarding forms, and manual stock ledger adjustments.

### Added
* **Category UI Modules**:
  * <a id="FE-US-CAT-01-001"></a>Defined TypeScript interfaces for category data models and API response envelopes (`FE-US-CAT-01-001`).
  * <a id="FE-US-CAT-01-002"></a>Built `add-category-modal` with schema validation enforcing non-empty names (`FE-US-CAT-01-002`).
  * <a id="FE-US-CAT-02-001"></a>Developed `edit-category-modal` allowing admin category modifications (`FE-US-CAT-02-001`).
  * <a id="FE-US-CAT-03-001"></a>Implemented active/inactive status toggle switches inside the edit category forms (`FE-US-CAT-03-001`).
  * <a id="FE-US-CAT-04-001"></a>Built category data tables showing name, description, and status badges (`FE-US-CAT-04-001`).
  * <a id="FE-US-CAT-04-002"></a>Designed badge styling representing active (green/purple) vs. inactive (orange/gray) states (`FE-US-CAT-04-002`).
* **Product Catalog UI Modules**:
  * <a id="FE-US-PROD-01-001"></a>Developed product registration modal with custom selection dropdown listing active categories (`FE-US-PROD-01-001`).
  * <a id="FE-US-PROD-01-002"></a>Integrated form validations checking SKU formats, required names, and category selection (`FE-US-PROD-01-002`).
  * <a id="FE-US-PROD-02-001"></a>Built `edit-product-modal` to update name, unit, category, and active status while disabling SKU edits (`FE-US-PROD-02-001`).
  * <a id="FE-US-PROD-03-001"></a>Implemented soft-deactivation toggle badges to visually retire inactive products (`FE-US-PROD-03-001`).
  * <a id="FE-US-PROD-04-001"></a>Developed products list table displaying name, SKU, category, status, and unit of measure (`FE-US-PROD-04-001`).
* **Stock Ledger UI Modules**:
  * <a id="FE-US-STOCK-01-001"></a>Added optional starting stock quantity input to the product onboarding flow (`FE-US-STOCK-01-001`).
  * <a id="FE-US-STOCK-02-001"></a>Created stock adjustment action triggers in product lists to launch adjustment modals (`FE-US-STOCK-02-001`).
  * <a id="FE-US-STOCK-03-001"></a>Handled transactional stock increase and decrease requests inside the adjust modal (`FE-US-STOCK-03-001`).
  * <a id="FE-US-STOCK-03-002"></a>Implemented client error handler capturing and displaying insufficient stock API messages (`FE-US-STOCK-03-002`).
* **Inventory Dashboard Modules**:
  * <a id="FE-US-MON-01-001"></a>Built an interactive operator dashboard showing aggregate product and stock counts (`FE-US-MON-01-001`).
  * <a id="FE-US-MON-01-002"></a>Highlighted out-of-stock items in bright red and low-stock items in amber/orange alert states (`FE-US-MON-01-002`).
