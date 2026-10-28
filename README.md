# AetherStudio — Cross-Platform Adaptive Drawer (Native Web APIs)

A responsive web application featuring a **Cross-Platform Drawer** optimized for both **Mobile Phones (`< 768px`)** and **Desktop (`>= 768px`)**, built from scratch using **100% Native Web APIs** (Zero React, Vue, jQuery, Tailwind, or gesture libraries).

## Adaptive Presentation

- **Desktop (`>= 768px`)**: Displays as a **centered modal dialog** (`max-width: 560px`) with smooth scale/fade entrance, `Escape` key dismissal, and **outside backdrop click to dismiss**.
- **Mobile (`< 768px`)**: Slides up from the bottom as an **interactive bottom sheet** with:
  - **1:1 Finger Tracking** via `PointerEvent` (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) and `requestAnimationFrame`.
  - **Velocity Flick Dismissal**: Sliding 80ms pointer sample window computes flick speed (`px/ms`). Flicking downward (`> 0.45 px/ms`) or dragging past `33%` of the sheet height dismisses the drawer.
  - **Snap Points & Rubber-Band Resistance**: Flicking upward (`< -0.45 px/ms`) or tapping `⤢` expands to full-screen height; pulling past the top applies hyperbolic rubber-band damping.
  - **Nested Scroll-to-Drag Handoff**: Scrolling inside `.cp-drawer__body` scrolls content normally while `scrollTop > 0`, and seamlessly hands off to dragging the bottom sheet when pulling down at `scrollTop <= 0`.
  - **Mobile Viewport & Virtual Keyboard Support**: Uses `100dvh`, `env(safe-area-inset-bottom)` for iPhone home indicators, and `window.visualViewport` listeners so focused form inputs remain visible above on-screen mobile keyboards.

## Project Structure

- `index.html` — Web app markup, live telemetry status bar, product cards, and native `<dialog>` drawer element.
- `styles.css` — Mobile-first bottom sheet styles + `@media (min-width: 768px)` desktop modal styles.
- `drawer.js` — `CrossPlatformDrawer` engine using `HTMLDialogElement`, `matchMedia`, `PointerEvent`, and `visualViewport`.
- `app.js` — Interactive product templates, form/keyboard test drawer, and live telemetry updates.
