# Personal Budget Tracker — Case Study

## A brutalist finance dashboard built with Laravel, Vue 3, and Kinetic Typography

---

## Overview

| | |
|---|---|
| **Project** | Personal Budget Tracker (MIK!) |
| **Role** | Full-Stack Developer & UI/UX Designer |
| **Stack** | Laravel · Vue 3 · Inertia.js · Tailwind CSS |
| **Timeline** | Single session (design + implementation) |
| **Status** | Live at [github.com/liamflores-09/personal_budget_tracker](https://github.com/liamflores-09/personal_budget_tracker) |

---

## Problem

Personal finance tracking tools are either bloated with features nobody uses, or so basic they're abandoned after a week. The core need is simple: **see your financial health at a glance, track spending patterns, and stay within budget** — without the cognitive overhead of enterprise accounting software.

The goal was to build a budget tracker that feels alive — something you *want* to open every day because the interface itself is engaging.

---

## Design Philosophy: Kinetic Typography

Instead of following the sea of dark-mode SaaS dashboards, I chose **Kinetic Typography** — a brutalist design system where typography *is* the interface.

### Core Principles

- **Typography as structure**: Headlines at 6-10rem, numbers at 8-12rem. Text fills the screen and becomes the primary visual element.
- **Constant motion**: Infinite marquees scroll financial stats. Nothing is ever still.
- **Hard color inversions**: Cards flood to acid yellow on hover, text inverts to black. No gentle fades — instant, dramatic shifts.
- **Brutalist geometry**: 0px border radius, 2px solid borders, completely flat design. No shadows, no gradients.

### Why This Approach

Generic dark mode with subtle gradients had become invisible — every finance app looks the same. Kinetic Typography creates an **instantly recognizable identity** through aggressive scale, relentless motion, and high-contrast color.

---

## Design System

### Color Architecture

```
Background:  #09090B  (Rich black — softer than pure black)
Foreground:  #FAFAFA  (Off-white — less harsh than pure white)
Muted:       #27272A  (Dark gray for secondary surfaces)
Muted FG:    #A1A1AA  (Zinc 400 for descriptions)
Accent:      #DFE104  (Acid yellow — high energy, high visibility)
Border:      #3F3F46  (Zinc 700 — structural lines)
```

The single accent color (acid yellow) is used sparingly but boldly — navigation highlights, hover states, the stats marquee, and the salary history cards.

### Typography Scale

| Element | Treatment |
|---------|-----------|
| Page headings | `clamp(2rem, 6vw, 5rem)` — viewport-responsive, massive |
| Hero numbers | `clamp(3rem, 12vw, 10rem)` — the budget amount fills the screen |
| Background numbers | `clamp(8rem, 20vw, 16rem)` — decorative, 4% opacity |
| Section titles | `text-3xl` uppercase, tight tracking |
| Body text | `text-lg` — larger than typical web |
| Labels | `text-xs` uppercase, `tracking-widest` — micro labels |
| All display text | **UPPERCASE** — poster-like, bold aesthetic |

Font: **Space Grotesk** — strong geometric shapes, excellent at large sizes.

### Shape Language

- **Border radius**: 0px everywhere (sharp corners are essential to brutalist aesthetic)
- **Borders**: 2px solid `#3F3F46` for structure
- **Shadows**: None — depth through color layering only
- **Grid dividers**: `gap-px` with border-colored backgrounds create connected card systems

---

## Key Features

### 1. Stats Marquee

A yellow banner that scrolls budget, spent, remaining, and percentage at fast speed. This is the first thing users see — a kinetic, always-moving financial summary.

```
BUDGET ₱45,000 ◆ SPENT ₱12,500 ◆ REMAINING ₱32,500 ◆ 28% USED ◆ ...
```

**Why**: Traditional stat cards are static and forgettable. A marquee creates urgency and energy — the data feels alive.

### 2. Massive Hero Number

The total budget is displayed at viewport-responsive scale (`clamp(3rem, 12vw, 10rem)`). On desktop, this number dominates the screen.

**Why**: In Kinetic Typography, scale = importance. The budget is the most important number — it should feel monumental.

### 3. Calendar with Heatmap

Days with expenses show intensity through background color (light → dark rose). The selected day inverts to the accent color with a dramatic scale transform.

**Why**: Visual intensity mapping makes spending patterns immediately visible without reading numbers.

### 4. Hard Color Inversion Cards

Every card in the salary history and category breakdown sections floods to acid yellow on hover. All text simultaneously inverts to black.

**Why**: This is the signature interaction of Kinetic Typography — instant, dramatic, memorable. It turns passive viewing into active engagement.

### 5. Connected Card Grids

Using `gap-px` with a border-colored parent container, cards appear as one connected system with hairline dividers — like a circuit board or newspaper layout.

**Why**: Creates visual density and structure without individual card borders. The grid feels architectural.

### 6. Oversized Form Inputs

All inputs use bottom-border only (no full borders), oversized text (`text-2xl font-bold`), and uppercase placeholder text.

**Why**: Forms become part of the design language — large, brutal, intentional. Not hidden away in modal dialogs.

---

## Technical Implementation

### Architecture

```
Laravel (Backend) → Inertia.js (Bridge) → Vue 3 (Frontend)
```

- **Laravel** handles authentication, routing, database, and business logic
- **Inertia.js** provides SPA-like navigation without API endpoints
- **Vue 3** (Composition API) manages component state and reactivity
- **Tailwind CSS** with custom design tokens for the entire visual system

### Design Token System

Centralized in `tailwind.config.js`:

```js
colors: {
    bg: '#09090B',
    fg: '#FAFAFA',
    muted: '#27272A',
    'muted-fg': '#A1A1AA',
    accent: '#DFE104',
    'accent-fg': '#000000',
    border: '#3F3F46',
}
```

Every component uses these tokens — no hardcoded colors. Changing the accent color globally requires a single token change.

### Component Architecture

| Component | Purpose |
|-----------|---------|
| `PrimaryButton` | Acid yellow, hard border, scale hover |
| `SecondaryButton` | Transparent, inverts to white on hover |
| `TextInput` | Bottom-border only, oversized, bold |
| `Dropdown` / `DropdownLink` | Flat, border-only, accent highlight |
| `Modal` | Flat dark overlay, 2px border, no blur |
| `Toast` | Inertia flash message display |
| `AuthenticatedLayout` | Brutalist nav with accent navigation |

### Motion System

| Animation | Speed | Purpose |
|-----------|-------|---------|
| Stats marquee | 12s linear | High-energy financial overview |
| Branding marquee | 35s linear | Slow, ambient branding |
| Page entrance | 500ms cubic-bezier | Smooth content reveal |
| Scale on hover | 200ms | Button tactile feedback |
| Color inversion | 300ms | Card hover transformation |

All animations respect `prefers-reduced-motion` — marquees pause, entrance animations skip.

### Accessibility

- **Contrast**: Off-white on rich black = ~15:1 ratio (WCAG AAA)
- **Focus indicators**: Acid yellow 2px outline on all interactive elements
- **Keyboard navigation**: All buttons, links, and calendar days are focusable
- **Touch targets**: Minimum 44px for all interactive elements
- **Screen reader**: ARIA labels on calendar days, form fields, and icon buttons

---

## Design Evolution

### v1 — Functional Foundation
Standard CRUD interface with basic styling. Worked, but visually invisible.

### v2 — Dark Mode Toggle
Added dark/light mode switching with cyan accent. More modern, but still generic.

### v3 — Dark-Only with Cyan
Removed the toggle, committed to dark mode. Cleaner, but the design still blended in with every other finance app.

### v4 — Kinetic Typography (Final)
Complete visual overhaul. Replaced every design decision with bold, intentional choices:
- Acid yellow instead of cyan (higher energy, more distinctive)
- Sharp corners instead of rounded (brutalist identity)
- Massive type instead of standard sizes (dramatic scale)
- Marquees instead of static cards (constant motion)
- Connected grids instead of individual cards (architectural density)

Each iteration was a deliberate rejection of what came before — pushing toward a more distinctive, memorable identity.

---

## Results

- **Full CRUD**: Expenses, salary entries, categories — all functional
- **Responsive**: Works from 320px mobile to 1440px+ desktop
- **Performant**: Lazy-loaded routes, animated counters, skeleton loaders
- **Accessible**: WCAG AA contrast, keyboard navigation, screen reader support
- **Memorable**: Instantly recognizable design that stands apart from generic dashboards

---

## Reflections

### What Worked
- **Kinetic Typography creates instant identity** — the design is unmistakably *this* project
- **Single accent color** forces disciplined use — every yellow element feels intentional
- **Connected grids** (gap-px) solve the "card soup" problem — the layout feels architectural

### What I'd Improve
- Add **real-time charts** (Chart.js or D3) for spending trends over time
- Implement **push notifications** for budget limit warnings
- Add **export to CSV/PDF** for tax reporting
- Build a **PWA** for mobile home screen install
- Support **multi-currency** for international users

### Key Takeaway
The most important design decision wasn't a color or a font — it was **choosing to be bold**. Generic designs are forgettable. A strong design system, applied consistently, creates something people remember and want to use.

---

## Links

- **GitHub**: [liamflores-09/personal_budget_tracker](https://github.com/liamflores-09/personal_budget_tracker)
- **Tech Stack**: Laravel · Vue 3 · Inertia.js · Tailwind CSS
- **Design System**: Kinetic Typography

---

*Built with intention. Designed to be remembered.*