# SyntheticAI Design System

## Typography Scale

### Headings
- H1: 56px / 1.1 line-height / 700 weight (hero, page titles)
- H2: 42px / 1.15 line-height / 700 weight (section titles)
- H3: 32px / 1.2 line-height / 600 weight (subsection titles)
- H4: 24px / 1.25 line-height / 600 weight (card headers)
- H5: 20px / 1.3 line-height / 600 weight (small headers)
- H6: 16px / 1.4 line-height / 500 weight (labels)

### Body
- Body Large: 18px / 1.6 line-height / 400 weight (primary body text)
- Body Regular: 16px / 1.6 line-height / 400 weight (standard body)
- Body Small: 14px / 1.5 line-height / 400 weight (secondary text)
- Body Tiny: 12px / 1.4 line-height / 400 weight (captions, labels)

### Font Family
- Primary: Inter (system default sans-serif)
- Fallback: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI

## Color Palette

### Primary Colors
- Cyber Purple: #7C3AED (primary accent, CTAs, highlights)
- Glow Purple: #8B5CF6 (hover states, secondary accents)
- Flux Cyan: #22D3EE (accent, data visualization)

### Neutral Colors
- Midnight: #020617 (primary background)
- Obsidian: #05070F (secondary background)
- Deep Slate: #0F172A (tertiary background)
- Slate 950: #030712 (card backgrounds)
- Slate 900: #111827 (elevated card backgrounds)
- Slate 800: #1E293B (hover states)
- Slate 400: #78716C (secondary text)
- Slate 300: #CBD5E1 (primary text)
- White: #FFFFFF (emphasis text)

### Status Colors
- Success: #10B981 (achievement, positive metrics)
- Warning: #F59E0B (caution, warnings)
- Danger: #EF4444 (errors, critical alerts)

## Spacing Scale

```
2px   4px   8px   12px  16px  24px  32px  48px  64px  96px
px-1  px-1  px-2  px-3  px-4  px-6  px-8  px-12 px-16 px-24
```

- Minimal: 4px
- Extra Small: 8px
- Small: 12px
- Base: 16px
- Medium: 24px
- Large: 32px
- Extra Large: 48px
- Huge: 64px

## Shadows & Depth

### Elevation 1 (cards, small elements)
```
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
```

### Elevation 2 (active cards, hover states)
```
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
```

### Elevation 3 (modals, important elements)
```
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
```

### Elevation 4 (premium depth)
```
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.05);
```

### Plasma Glow (cyber accent)
```
box-shadow: 0 25px 80px rgba(124, 60, 237, 0.18);
```

## Border Radius

- None: 0px
- Small: 8px
- Base: 12px
- Medium: 16px
- Large: 24px
- Extra Large: 32px
- Full: 9999px

Use 24px as default for cards and 32px for large containers.

## Grid System

- Base: 12-column grid
- Desktop: full-width to max-width 1440px
- Tablet: max-width 768px
- Mobile: full-width with side padding

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1440px
- Ultra-wide: > 1440px

## Animation & Motion

### Transitions
- Fast: 150ms (micro-interactions)
- Standard: 300ms (standard animations)
- Slow: 500ms (cinematic transitions)
- Extra-slow: 800ms (immersive reveals)

### Easing
- In: cubic-bezier(0.4, 0, 1, 1)
- Out: cubic-bezier(0, 0, 0.2, 1)
- In-Out: cubic-bezier(0.4, 0, 0.2, 1)
- Smooth: cubic-bezier(0.33, 0.66, 0.66, 1)

### Spring Motion
- Default: spring({ damping: 15, stiffness: 100, mass: 1 })
- Bouncy: spring({ damping: 10, stiffness: 150, mass: 1 })
- Smooth: spring({ damping: 25, stiffness: 100, mass: 1 })

## Component Variants

### Buttons
- Primary (Cyber): bg-cyber text-white
- Secondary: bg-slate-900 border-white/10 text-white
- Ghost: bg-transparent border-white/20 text-white

### Cards
- Elevated: border-white/10 bg-slate-950/80 backdrop-blur-xl rounded-3xl p-6
- Premium: border-white/10 bg-[#06090f]/90 backdrop-blur-xl rounded-[36px] p-8
- Minimal: border-transparent bg-white/5 rounded-3xl p-6

### Input Fields
- Base: rounded-3xl border-white/10 bg-slate-900/80 px-5 py-4 text-white

### Badge
- Primary: rounded-full bg-cyber/10 px-3 py-1 text-cyber
- Secondary: rounded-full bg-white/5 px-3 py-1 text-white/70

## Visual Hierarchy

1. **Hero Sections**: Max contrast, large typography, full-width cinematic visuals
2. **Primary Sections**: 24-32px headings, grid layouts, balanced spacing
3. **Cards**: 18-20px headers, 14px body, clear visual separation
4. **UI Elements**: 14-16px labels, 12px helper text, subtle hierarchy

## Consistency Rules

1. All cards use rounded-[24px] or rounded-[32px]
2. All CTAs use cyber purple (#7C3AED)
3. All backgrounds use midnight (#020617)
4. All text colors match slate palette
5. All shadows use elevation scale
6. All spacing follows base 8px grid
7. All animations use standard easing
8. All fonts use Inter family

## Premium Quality Checklist

- [ ] Spacing is consistent (8px grid)
- [ ] Typography hierarchy is clear
- [ ] Colors maintain contrast ratios
- [ ] Shadows create proper depth
- [ ] Animations are smooth (60fps)
- [ ] All elements align to grid
- [ ] Border radius is consistent
- [ ] Responsive breakpoints work
- [ ] Dark mode feels cinematic
- [ ] Light mode feels premium
