---
name: Elite Grooming Aesthetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#4de082'
  on-secondary: '#003919'
  secondary-container: '#00b55d'
  on-secondary-container: '#003e1c'
  tertiary: '#cecece'
  on-tertiary: '#2f3131'
  tertiary-container: '#b2b3b3'
  on-tertiary-container: '#434546'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#6dfe9c'
  secondary-fixed-dim: '#4de082'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality of this design system is defined by "Exclusive Accessibility." It targets the modern Kenyan professional who values time, craftsmanship, and a premium grooming experience. The UI evokes a sense of quiet luxury—expensive but functional.

The design style leans heavily into **Minimalism** with subtle **Glassmorphism** accents. By utilizing deep blacks and high-contrast gold accents, the interface feels like a VIP concierge service. The "Instagram-style" visual showcase is achieved through expansive image containers and high-quality photography, while the functional "Uber-like" logic ensures the booking flow is frictionless and utility-driven.

## Colors

The palette is anchored in a "Deep Onyx" environment to allow the gold accents and high-fidelity photography to pop. 

- **Primary Gold (#D4AF37):** Used strictly for high-importance interactions, branding, and premium status indicators.
- **Secondary Soft Green (#4ADE80):** Reserved for success states, confirmed appointments, and positive action feedback.
- **Neutrals:** A tiered system of blacks and greys. The true black (#0A0A0A) is used for the base canvas, while lighter greys define surface containers to create a sense of depth without relying on heavy borders.

## Typography

This design system utilizes a dual-font approach to balance authority with readability. 

**Inter** is the choice for headlines, providing a bold, systematic, and confident structure. Tight letter-spacing on larger sizes mimics high-end editorial layouts. 

**Manrope** serves as the body and label typeface. Its refined, modern proportions ensure maximum legibility for service menus, price lists (KES), and location details, even on smaller mobile screens. All labels use an uppercase treatment with slight tracking to enhance the premium feel.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model optimized for mobile-first consumption. It uses a 12-column grid for desktop/web and a single-column stack for mobile with generous 24px side margins to prevent content from feeling cramped.

Rhythm is maintained through an 8px base unit. Component internal padding should be generous—favoring white space over information density to maintain the "Uber-like" simplicity. Elements are grouped using tiered stacks (8px for related items, 16px for component groups, 32px for section breaks).

## Elevation & Depth

In a dark mode environment, depth is communicated through **Tonal Layers** and **Ambient Shadows**. 

1. **Base:** Pure Black (#0A0A0A) for the background.
2. **Surface:** Dark Charcoal (#1A1A1A) for cards and secondary containers.
3. **Elevated:** Mid-Grey (#262626) for modals and floating elements.

Shadows must be subtle and "soft." Instead of pure black shadows, use a slightly tinted shadow (e.g., #000000 at 40% opacity) with a large blur radius (20px-30px) to create a soft glow effect rather than a harsh drop-shadow. Gold-themed CTAs may use a very faint gold outer glow (5% opacity) to simulate luminescence.

## Shapes

The shape language is defined by modern, organic curves. A base roundedness of 16px (`rounded-lg`) is the standard for service cards and image containers, creating an approachable and high-end feel. 

Interactive elements like buttons use the `rounded-xl` or pill-shape to distinguish them from content containers. High-quality image containers must always share the same radius as their parent card to maintain visual continuity.

## Components

### Buttons
Primary CTA buttons feature a linear gradient (Gold to a slightly darker Bronze) or a solid Gold fill with black text. Secondary buttons should be "Ghost" style with a 1px Gold or White border.

### Cards
Cards are the primary vehicle for the "Instagram" feel. They must feature a 1:1 or 4:5 aspect ratio image container at the top, with service details (Price in KES, Barber name, Location) in the bottom section. Use subtle overlays on images to ensure white text remains legible.

### Inputs & Search
Input fields should be dark-themed with a subtle 1px border (#333). On focus, the border transitions to Gold. Search bars in the "Nairobi Locations" context should include a leading icon (map pin) and a trailing filter icon.

### Chips/Status
Status indicators for bookings (e.g., "Confirmed") use the Soft Green accent with 10% opacity background and 100% opacity text.

### Image Containers
Every barber profile and gallery item must use high-quality, high-contrast imagery. Use a "skeleton screen" loading state that matches the surface color (#1A1A1A) during image fetches.