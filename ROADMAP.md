# Frontend Implementation Roadmap
**Service:** Inventory Service User Interface (Next.js + TailwindCSS + Shadcn/ui)

| User Story ID | Frontend Verification Criteria / Technical Requirement | Status |
| :--- | :--- | :--- |
| **US-CAT-01** | Define TypeScript interfaces for category models and responses | [x] |
| **US-CAT-01** | Build `add-category-modal` with inline validation checking for non-empty names | [x] |
| **US-CAT-02** | Build `edit-category-modal` for category updates | [x] |
| **US-CAT-03** | Build active/inactive status toggle switch inside the edit form | [x] |
| **US-CAT-04** | Build data table displaying category name and status badge | [x] |
| **US-CAT-04** | Style active (green/purple) vs. inactive (orange/gray) badge states | [x] |
| **US-PROD-01** | Build product creation modal with custom selection dropdown for active categories | [ ] |
| **US-PROD-01** | Implement validations checking for unique SKU formats, required names, and category selection | [ ] |
| **US-PROD-02** | Build `edit-product-modal` to update name, unit, category, and status | [ ] |
| **US-PROD-03** | Implement soft-deactivation toggle badge for inactive product states | [ ] |
| **US-PROD-04** | Build products list table displaying columns: name, SKU, category, status, and unit | [ ] |
| **US-STOCK-01** | Add an optional initial stock quantity input field to the product creation flow | [ ] |
| **US-STOCK-02** | Add stock increment action inputs (`+` triggers) next to stock counts | [ ] |
| **US-STOCK-03** | Add stock decrement action inputs (`-` triggers) next to stock counts | [ ] |
| **US-STOCK-03** | Implement client-side error handling displaying insufficient stock alerts from backend API | [ ] |
| **US-MON-01** | Build an interactive inventory dashboard | [ ] |
| **US-MON-01** | Highlight out-of-stock items in bright red, and low-stock items in amber/orange alert states | [ ] |
