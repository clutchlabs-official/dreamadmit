# Design Brief

## Direction

DreamAdmit — Premium AI-powered college admissions platform with emoji-guided navigation (🎯 Admissions, ✍️ Essays, 💰 Finance, 📊 TestPrep, 👥 Community, 📱 Tracking, 🌍 International). Refined modern design combining deep indigo professionalism with vibrant accent colors, elevated by intentional motion choreography and category-specific emoji accents that maintain visual clarity without visual noise.

## Tone

Refined modern professionalism with motivational warmth and distinctive emoji-based visual language. Deep indigo primary with vibrant green accents signal trustworthiness and opportunity, elevated by premium shadows, geometric Space Grotesk headlines, and medium-intensity animations that guide user focus through bounce reveals and staggered entrance patterns.

## Differentiation

Comprehensive 13+ integrated tools unified by category-specific emoji accents (7 distinct colors per section), medium-intensity motion choreography (bounce-reveal cards, staggered list animations, smooth page transitions), and "coming soon" badge styling that communicates feature roadmap without visual clutter. Animations serve clarity and focus guidance—never decorative.

## Color Palette

| Token            | OKLCH           | Role                                     |
| :--------------- | :-------------- | :--------------------------------------- |
| background       | 0.98 0.01 260   | Soft neutral base, warm white            |
| foreground       | 0.12 0.02 260   | Rich charcoal text for premium contrast  |
| card             | 1.0 0.0 0       | Pure white elevated surfaces             |
| primary          | 0.48 0.22 264   | Deep indigo for buttons, badges, accents |
| accent           | 0.62 0.19 145   | Vibrant green for CTAs, highlights       |
| muted            | 0.93 0.01 260   | Subtle disabled states, secondary UI     |
| destructive      | 0.58 0.24 25    | Coral-red for warnings, destructive acts |
| success          | 0.64 0.19 146   | Green-tinted success states              |

## Emoji Section Accents

| Section       | Emoji | OKLCH (Light)      | OKLCH (Dark)      | Usage                               |
| :------------ | :---- | :----------------- | :---------------- | :---------------------------------- |
| Admissions    | 🎯    | 0.48 0.22 194 (T)  | 0.72 0.22 194     | Match scores, reach/safety sorting |
| Essays        | ✍️    | 0.62 0.18 280 (P)  | 0.70 0.18 280     | Essay review, idea generator       |
| Finance       | 💰    | 0.71 0.18 82 (G)   | 0.75 0.20 82      | Scholarships, loan calculator      |
| TestPrep      | 📊    | 0.62 0.18 250 (B)  | 0.70 0.20 250     | Score predictor, mock tests        |
| Community     | 👥    | 0.68 0.20 10 (R)   | 0.72 0.22 10      | Alumni chat, forums, mentoring     |
| Tracking      | 📱    | 0.62 0.22 48 (Or)  | 0.70 0.22 48      | Deadlines, document vault          |
| International | 🌍    | 0.67 0.19 220 (C)  | 0.72 0.20 220     | Visa guidance, study abroad        |

## Typography

- Display: Space Grotesk — bold geometric headlines, match scores, achievement badges
- Body: Plus Jakarta Sans — friendly, approachable labels, form fields, descriptions
- Scale: hero text-4xl font-display font-bold, h2 text-2xl font-display, labels text-sm font-body, body text-base font-body

## Elevation & Depth

Multi-tier shadow hierarchy: shadow-soft for cards and form inputs (subtle depth), shadow-elevated for modals and popovers (prominent lift), white card backgrounds on soft-shadow bases distinguish content zones without visual clutter.

## Structural Zones

| Zone    | Background              | Border           | Notes                                              |
| :------ | :---------------------- | :--------------- | :------------------------------------------------- |
| Header  | bg-primary text-white   | —                | Sticky navigation, logo, user profile button      |
| Content | bg-background           | —                | Multi-column grid: hero, card sections, modals    |
| Sidebar | bg-card border-r-1      | border-muted     | Admission officer portal nav, course finder tree  |
| Footer  | bg-muted/15 border-t-1  | border-muted     | Copyright, links, support channels                |

## Animation & Motion

**Keyframes & Utilities:**
- `bounce-reveal` (0.6s): Card entrance with scale 0.85→1 and bounce peak at 70% — applied via `.bounce-reveal` class
- `slide-up-fade` (0.5s): Fade + 16px translate-y transition — used for page transitions
- `stagger-children`: Auto-stagger up to 5+ child elements with 0.08s delay per item using CSS custom properties

**Animation Application:**
- Hero/card sections: `.bounce-reveal` on page load
- List views (colleges, scholarships, essays): `.stagger-children` wrapper on parent, auto-delays children
- Page transitions: `.slide-up-fade` on content sections
- Hover states: shadow elevation + color shift (no scale/bounce)

**Motion Choreography:** 0.3s cubic-bezier(0.4, 0, 0.2, 1) default transition for all interactive elements. No distracting decorative animations.

## Badges & Status

- Match Score: Green accent bg (0.62 0.19 145), pill-shaped, large font-weight-600
- Achievement: Indigo bg (0.48 0.22 264), uppercase small text, rounded-md
- Coming Soon: Muted purple (0.50 0.12 270 light / 0.70 0.12 270 dark), light background, pill-shaped, 0.75rem font-size
- Status: Muted bg with semantic foreground color (success=green, warning=amber, destructive=red)

## Component Patterns

- Buttons: Primary (indigo bg, white text, rounded-lg, shadow-soft hover), Secondary (muted bg, foreground text), Accent (green bg, white text) — all with 0.3s smooth transition
- Cards: 12px rounded, white bg, subtle 1px border, shadow-soft base, shadow-elevated on hover, emoji accent top-left (bg-emoji-* color)
- Form inputs: 1px border-input, 8px rounded, shadow-subtle focus ring
- Badges: Match score (green, pill), Achievement (indigo, uppercase), Coming Soon (muted purple, pill), Status (semantic colors)

## Constraints

- No gradients on card backgrounds — maintain clarity for content-rich layouts
- Never use default Tailwind shadows; only shadow-soft and shadow-elevated for surface definition
- Button text always white (primary/accent) or dark foreground (secondary) — never low-contrast text
- Accent green reserved for: match score badges, key CTAs (Generate, Upload, Send), achievement markers — use sparingly for impact
- Emoji colors accessible and distinct — never two adjacent section emojis within 30° hue
- Motion: no decorative animations, only clarity-serving entrance/transition patterns
- Coming soon badges must use muted purple to signal "unavailable" without red/destructive connotation
- Stagger delays auto-calculate: .stagger-children > :nth-child(n) { animation-delay: calc(n * var(--animation-stagger)) }

## Signature Detail

Emoji-guided section navigation paired with medium-intensity entrance animations creates instant visual clarity without cognitive load: students immediately recognize which app section they're viewing (Admissions=teal, Essays=purple, Finance=gold) while bounce-reveal cards and staggered list animations deliver information in a choreographed, focused rhythm. The combination of bold Space Grotesk headlines, vibrant green match score badges, and refined premium shadows signals institutional trustworthiness and ambitious opportunity simultaneously.
