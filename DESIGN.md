# UI/UX Design System & Guidelines (v1.2.0)

This document defines the core **design principles, styling architecture, component patterns, and interaction guidelines** for the **My-ERP Inventory Service UI**. Following these standards ensures visual harmony, consistent operator workflows, and premium aesthetics across all pages.

---

## 🎨 1. Aesthetic Philosophy

The interface is designed to look **premium, modern, and highly responsive**:
* **High-Fidelity Aesthetics**: Glassmorphism accents, vibrantTailwind v4 gradients, smooth micro-animations, and harmonized color palettes.
* **Intelligent Dark Mode 🕶️**: Elegant, high-contrast dark palette tailored to reduce eye strain for operators during long sessions.
* **Status Visibility**: Instant visual indicators (badges, stock alerts, deactivated states) that allow administrators to inspect status at a single glance.

---

## 💎 2. Styling Tokens

Styling is built around a combined **Tailwind CSS v4** utility baseline and **Vanilla CSS** overrides.

### Color Palette (HSL Tailored)
| Type | Token / Class | Light Hex | Dark Hex | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `brand-500` / `brand-600` | `#465FFF` | `#3A4ED9` | Action items, primary navigation, focus states |
| **Danger** | `red-500` / `red-600` | `#EF4444` | `#DC2626` | Destructive statuses, low stock red-flags |
| **Success** | `green-600` / `green-700` | `#16A34A` | `#15803D` | Active statuses, standard stock levels |
| **Warning** | `amber-500` / `amber-600` | `#F59E0B` | `#D97706` | Pending, medium-low stock warnings |
| **Neutral Background** | `bg-white` / `bg-gray-900` | `#FFFFFF` | `#111827` | Application frame background |
| **Surface Card** | `bg-white` / `bg-white/[0.03]` | `#FFFFFF` | `rgba(255,255,255,0.03)` | Inner surface card elements, tables |

---

## 📐 3. Layout Grid & Structure

The interface uses a consistent, responsive Clean Layout wrapper:
1. **Sidebar Frame (`AppSidebar`)**: 
   * Dynamic width transition (`w-[90px]` collapsed, `w-[290px]` expanded).
   * Features a smooth micro-animation transition on hover (`ease-in-out duration-300`).
   * Guards state updates against synchronous effect cascades during route shifts.
2. **Dashboard Header (`Header`)**: Contains operator profile access, search bars, and theme-toggle triggers.
3. **Master Container Grid**: Flexible flex grids (`gap-5 md:gap-7`) that rearrange gracefully on small mobile viewports.

---

## 🏗️ 4. Component Patterns

### A. Data Tables (`src/components/ui/data-table.tsx`)
* Pre-built TanStack Table grids.
* Columns use ghost headers containing sort indicators (`ArrowUpDown` from Lucide).
* Unbounded listings are sorted chronologically or alphabetically.

### B. Unified Action Buttons
To maintain design consistency and unified aesthetics, **all row-level table actions must use icon buttons** instead of generic text buttons:
* **Dimensions**: Strict `h-8 w-8` sizing with a centered `h-4 w-4` icon inside.
* **Variant**: Outline (`variant="outline"`) with HSL-specific hover colors.
* **Icons (Lucide-React)**:
  * **Edit Actions**: Use `<Edit />` in Amber (`text-amber-600 hover:text-amber-700`).
  * **Stock Adjustments**: Use `<Sliders />` in Blue (`text-blue-600 hover:text-blue-700`).
  * **Deactivate Actions**: Use `<Ban />` in Red (`text-red-600 hover:text-red-700`).
  * **Activate Actions**: Use `<Check />` in Green (`text-green-600 hover:text-green-700`).
  * **Loading / Async**: Use `<Spinner />` centered within a disabled icon button.

*Example Component (`category-actions.tsx`):*
```tsx
<Button
  variant="outline"
  size="icon"
  className="h-8 w-8 text-amber-600 hover:text-amber-700"
  onClick={() => onEdit(category)}
  title="Edit Category"
>
  <Edit className="h-4 w-4" />
</Button>
```

### C. Modals & Forms
* Form layouts must use standard **React Hook Form** + **Zod** schema guards to capture input errors before dispatching API commands.
* Text inputs: Standard border colors (`border-gray-300` / `dark:border-gray-700`) that glow with `focus:ring-brand-500/10` upon focus.
* Deactivation Modals: Must clearly summarize the impact of deactivating the resource before execution.

---

## ⚡ 5. Interaction & Usability Rules

1. **State Invariance**: Deleting resources is fully disabled at the API level (returning `405 Method Not Allowed`). The UI enforces status deactivation instead. No delete links or delete buttons may be presented.
2. **Fresh Data Short-polling / Fetching**: The stock ledger must reload its data:
   * Instantly upon initial component mount.
   * Following any successful stock adjustment (increase/decrease).
   * Upon manual dashboard refresh triggers.
3. **No-Cascade Effect Loading**: When setting states inside `useEffect` on client-side Next.js components, wrap updates in `setTimeout(fn, 0)` or guard them with distinct state checks to guarantee clean hydration and bypass React Compiler purity errors.
