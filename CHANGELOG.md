# Changelog

All notable changes to the My-ERP Inventory Service UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-06-02

This release cleans up duplicate UI systems, standardizes visual components on `shadcn/ui`, removes obsolete demo folders, extracts a shared API error normalizer, and aligns architectural documentation.

### Added
- **Shared API Error Mapper:** Extracted reusable `mapApiError` utility inside `src/lib/errors/api-error-mapper.ts` to normalize HTTP status codes and validation messages into standard `AppError` values.
- **Local Validation Error Handling:** Upgraded the shared error mapper to cleanly format plain `Error` exceptions thrown by local domain value objects (like `ProductName` or `ProductSKU`) into user-friendly `"VALIDATION_ERROR"` values containing the exact target field (e.g. `"name"`, `"sku"`).

### Changed
- **UI Standardization:**
  - Migrated `SignInForm.tsx` and `SignUpForm.tsx` to use standardized `shadcn/ui` components (`Label` and `Button`) instead of legacy TailAdmin elements.
  - Simplified `product.service.ts` creation validation: Validate inputs directly via domain value objects instead of assembling a massive mock full `Product` dummy object.
- **Version Bump:** Bumped package version cleanly to `1.2.1`.
- **Documentation Alignment:** Re-described the system structure in `README.md` to accurately denote a clean layered architecture style rather than overstating DDD/Clean Architecture.

### Removed
- **Unused Demo Folders:** Purged layout folders and heavy third-party assets not imported by active routes (`calendar`, `charts`, `ecommerce`, `example`, `videos`).
- **Obsolete TailAdmin Custom Components:** Deleted `src/components/ui/button/Button.tsx` and `src/components/form/Label.tsx` as all active pages are standardized on shadcn.
