# Morrow St. Bakery & Coffee

A neighborhood bakery and coffee shop pre-order web app featuring a responsive cross-platform drawer built with native Web APIs (`<dialog>`, `PointerEvent`, `matchMedia`, and `visualViewport`).

## Adaptive Presentation

- **Desktop (`>= 768px`)**: Selecting a menu item, viewing store hours, or opening the pickup order bag presents a centered modal dialog with outside backdrop click and `Escape` key dismissal.
- **Mobile (`< 768px`)**: Slides up from the bottom as an interactive bottom sheet with 1:1 pointer tracking, velocity-based flick dismissal, upward overscroll damping, and nested scroll-to-drag handoff.
