# Frontend Design System (v1.2.0)

Design standards and component conventions for the **My-ERP Inventory Service UI**. Follow these when building or modifying any frontend feature.

---

## Tech Stack

| Layer | Library | Version | Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.x` | App Router, RSC enabled |
| **Language** | TypeScript | `^5.9` | Strict mode |
| **Styling** | Tailwind CSS | `^4.x` | via `@import 'tailwindcss'` |
| **Component Library** | shadcn/ui | `new-york` style | CSS variables, slate base |
| **Icons** | Lucide React | `^0.575` | Only icon library in use |
| **Forms** | React Hook Form + Zod | `^7.75` / `^4.x` | All forms validated with schema |
| **Tables** | TanStack Table | `^8.21` | `@tanstack/react-table` |
| **Animations** | tw-animate-css | `^1.4` | via `@import "tw-animate-css"` |
| **Toasts** | Sonner | `^2.x` | `<Toaster />` in root layout |

---

## Fonts & Typography

**Font**: [`Outfit`](https://fonts.google.com/specimen/Outfit) — applied globally via `--font-outfit` CSS variable.

```css
/* globals.css @theme */
--font-outfit: Outfit, sans-serif;
body { @apply font-outfit; }
```

**Custom text scale** (defined in `@theme`, use as Tailwind classes):

| Class | Size |
| :--- | :--- |
| `text-title-2xl` | 72px |
| `text-title-xl` | 60px |
| `text-theme-xl` | 20px |
| `text-theme-sm` | 14px |
| `text-theme-xs` | 12px |

---

## Color Tokens

All colors are defined in `src/app/globals.css` under `@theme`. Use the Tailwind class equivalents — never raw hex values in components.

### Brand (Primary Actions)
| Token | Hex | Class |
| :--- | :--- | :--- |
| Brand 500 | `#465FFF` | `brand-500` |
| Brand 600 | `#3641F5` | `brand-600` |

### Semantic Colors (Status)
| Semantic | Token | Class |
| :--- | :--- | :--- |
| Success | `#12B76A` | `success-500` |
| Error / Danger | `#F04438` | `error-500` |
| Warning | `#F79009` | `warning-500` |

### Gray Scale
`gray-50` → `gray-950`. Default surface: `bg-gray-50`. Dark surface: `bg-gray-900` / `bg-white/[0.03]`.

### shadcn Semantic Variables (for shadcn components)
These are mapped from the Tailwind theme in `@theme inline`:
`--background`, `--foreground`, `--primary`, `--destructive`, `--muted`, `--border`, `--ring`, etc.

---

## shadcn/ui Components

Configured via `components.json` — style: **new-york**, CSS variables: **enabled**.

Available installed components (under `src/components/ui/`):

| Component | File | Usage |
| :--- | :--- | :--- |
| Button | `button.tsx` | All interactive actions |
| Badge | `badge.tsx` | Status chips (`active`, `inactive`) |
| Input | `input.tsx` | Form text inputs |
| Textarea | `textarea.tsx` | Multi-line form fields |
| Label | `label.tsx` | Form labels |
| Select | `select.tsx` | Dropdown selects |
| Dialog | `dialog.tsx` | Modal dialogs |
| Table | `table.tsx` | Base table primitives |
| Card | `card.tsx` | Metric cards, info panels |
| Alert | `alert.tsx` | Feedback banners |
| Badge | `badge.tsx` | Inline status labels |
| Separator | `separator.tsx` | Visual dividers |
| Sonner | `sonner.tsx` | Toast notifications |
| Spinner | `spinner.tsx` | Loading states |
| DataTable | `data-table.tsx` | TanStack Table wrapper |

> **Rule:** Never use raw `<button>` elements. Always use `<Button>` from shadcn.

---

## Action Buttons in Tables

All row-level actions **must** use icon-only buttons. No text-label buttons in table rows.

```tsx
// Correct — icon button pattern
<Button
  variant="outline"
  size="icon"
  className="h-8 w-8 text-amber-600 hover:text-amber-700"
  onClick={() => onEdit(item)}
  title="Edit"          // required for accessibility
>
  <Edit className="h-4 w-4" />
</Button>
```

### Icon & Color Conventions

| Action | Icon | Color Class |
| :--- | :--- | :--- |
| Edit | `<Edit />` | `text-amber-600 hover:text-amber-700` |
| Stock Adjust | `<Sliders />` | `text-blue-600 hover:text-blue-700` |
| Deactivate | `<Ban />` | `text-red-600 hover:text-red-700` |
| Activate | `<Check />` | `text-green-600 hover:text-green-700` |
| Loading | `<Spinner />` | — (disabled button) |

Sizing is fixed: `h-8 w-8` button, `h-4 w-4` icon. Gap between buttons: `gap-2`.

---

## Dark Mode

Dark mode is class-based (`class="dark"`) managed by `ThemeContext`. Toggle is available in the header.

```css
/* Custom variant defined in globals.css */
@custom-variant dark (&:is(.dark *));
```

Always pair light and dark classes:

```tsx
className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90"
```

---

## Forms

All forms use **React Hook Form** + **Zod** schemas. No uncontrolled inputs in modals.

```tsx
const schema = z.object({ name: z.string().min(1, "Required") });
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
```

Input focus style (already set in base CSS):
```
focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10
```

---

## Domain Rules Reflected in UI

- **No delete actions** — deletion is disabled at the API level (`405`). The UI only surfaces deactivation (`<Ban />`).
- **Stock freshness** — data is re-fetched on mount and after any successful stock adjustment.
- **Inactive category guard** — products cannot be assigned to inactive categories (enforced server-side; surface validation errors from API).
