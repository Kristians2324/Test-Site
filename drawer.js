/**
 * ============================================================================
 * CrossPlatformDrawer — Pure Native Web API Implementation
 * ============================================================================
 * Adaptive Presentation:
 *  - Desktop (>= 768px): Centered Modal Dialog with outside backdrop click &
 *    Escape key dismissal.
 *  - Mobile (< 768px): Interactive Bottom Sheet sliding up from the bottom
 *    with 1:1 pointer tracking, velocity flick dismissal, snap points,
 *    rubber-band overscroll resistance, and scroll-to-drag handoff.
 *
 * Native Web APIs Used:
 *  - HTMLDialogElement (showModal, close, cancel event)
 *  - Window.matchMedia('(min-width: 768px)')
 *  - Pointer Events API (pointerdown, pointermove, pointerup, pointercancel)
 *  - Window.visualViewport (virtual keyboard & mobile browser bar adaptation)
 *  - requestAnimationFrame (60/120fps GPU-composited transform updates)
 * ============================================================================
 */

class CrossPlatformDrawer {
  /**
   * @param {Object} options
   * @param {HTMLDialogElement} options.dialogEl
   * @param {Function} [options.onTelemetry] - Callback for live gesture/mode telemetry
   */
  constructor({ dialogEl, onTelemetry }) {
    this.dialog = dialogEl;
    this.backdrop = dialogEl.querySelector('#drawerBackdrop');
    this.positioner = dialogEl.querySelector('#drawerPositioner');
    this.surface = dialogEl.querySelector('#drawerSurface');
    this.handleBar = dialogEl.querySelector('#drawerHandleBar');
    this.header = dialogEl.querySelector('#drawerHeader');
    this.body = dialogEl.querySelector('#drawerBody');
    this.footer = dialogEl.querySelector('#drawerFooter');
    this.closeBtn = dialogEl.querySelector('#drawerCloseBtn');
    this.snapBtn = dialogEl.querySelector('#drawerSnapBtn');
    this.snapIcon = dialogEl.querySelector('#drawerSnapIcon');
    this.modeTag = dialogEl.querySelector('#drawerModeTag');
    this.titleEl = dialogEl.querySelector('#drawerTitle');
    this.subtitleEl = dialogEl.querySelector('#drawerSubtitle');

    this.onTelemetry = typeof onTelemetry === 'function' ? onTelemetry : () => {};

    // Breakpoint matcher: >= 768px is Desktop, < 768px is Mobile
    this.desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    this.forceMobilePreview = false;

    // Lifecycle & state
    this.isOpen = false;
    this.isClosing = false;
    this.isExpandedSnap = false;
    this.lastTriggerEl = null;
    this.closeTimer = null;

    // Gesture physics state (Mobile < 768px)
    this.dragState = {
      pointerId: null,
      startY: 0,
      startX: 0,
      currentDeltaY: 0,
      isDragging: false,
      startedInBody: false,
      gestureLockedOut: false,
      sheetHeight: 400,
      samples: [], // Ring buffer of { y, time } over last 80ms for flick velocity
      lastVelocity: 0,
      rafId: null,
    };

    // Physics tuning constants
    this.DISMISS_VELOCITY_THRESHOLD = 0.45; // px/ms downward flick
    this.EXPAND_VELOCITY_THRESHOLD = -0.45; // px/ms upward flick
    this.DISMISS_RATIO_THRESHOLD = 0.33;    // 33% of sheet height
    this.RUBBER_BAND_MAX_PX = 56;           // Max upward overscroll pull in px
    this.DRAG_SLOP_PX = 6;                  // Minimum px before locking drag

    this._bindEvents();
    this._syncViewportMetrics();
    this._syncAdaptiveMode();
  }

  /**
   * Returns true if currently presenting as Mobile Bottom Sheet (< 768px)
   */
  isMobileMode() {
    if (this.forceMobilePreview) return true;
    return !this.desktopMediaQuery.matches;
  }

  /**
   * Toggle "Simulate Mobile (<768px)" mode for convenient testing on wide screens
   * @param {boolean} [force]
   */
  setForceMobilePreview(force) {
    this.forceMobilePreview = typeof force === 'boolean' ? force : !this.forceMobilePreview;
    if (this.forceMobilePreview) {
      this.dialog.setAttribute('data-force-mobile', 'true');
    } else {
      this.dialog.removeAttribute('data-force-mobile');
    }
    this._syncAdaptiveMode();
    return this.forceMobilePreview;
  }

  /**
   * Wire up all native DOM, Pointer, MediaQuery, and VisualViewport events
   */
  _bindEvents() {
    // 1. Adaptive Breakpoint listener (>= 768px vs < 768px)
    this.desktopMediaQuery.addEventListener('change', () => {
      this._syncAdaptiveMode();
    });

    window.addEventListener('resize', () => {
      this._syncViewportMetrics();
      this._syncAdaptiveMode();
    }, { passive: true });

    // 2. Native visualViewport API for mobile virtual keyboard & dynamic browser bars
    if (window.visualViewport) {
      const handleVisualViewport = () => this._syncViewportMetrics();
      window.visualViewport.addEventListener('resize', handleVisualViewport, { passive: true });
      window.visualViewport.addEventListener('scroll', handleVisualViewport, { passive: true });
    }

    // 3. Outside Backdrop Click to Dismiss (Works on Desktop Modal AND Mobile Sheet)
    this.dialog.addEventListener('click', (e) => {
      if (this.isClosing) return;
      // Clicking on the backdrop or empty positioner area outside .cp-drawer__surface
      if (e.target === this.dialog || e.target === this.backdrop || e.target === this.positioner) {
        this.close('backdrop');
      }
    });

    // 4. Close Button & Snap Toggle Button
    this.closeBtn.addEventListener('click', () => this.close('close-button'));
    this.snapBtn.addEventListener('click', () => this.toggleSnapPoint());
    this.handleBar.addEventListener('dblclick', () => {
      if (this.isMobileMode()) this.toggleSnapPoint();
    });

    // 5. Native <dialog> 'cancel' event (Triggered by Escape key)
    // Intercept so we play smooth exit transition before calling dialog.close()
    this.dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      this.close('escape-key');
    });

    // 6. Native Pointer Events for Mobile Bottom Sheet Gestures
    this.surface.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    window.addEventListener('pointermove', (e) => this._onPointerMove(e), { passive: false });
    window.addEventListener('pointerup', (e) => this._onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this._onPointerUp(e));
  }

  /**
   * Synchronize CSS custom properties with visualViewport (handles iOS/Android
   * software keyboards so inputs inside the sheet stay above the keyboard).
   */
  _syncViewportMetrics() {
    const vv = window.visualViewport;
    const height = vv ? vv.height : window.innerHeight;
    const keyboardInset = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;

    document.documentElement.style.setProperty('--vvh', `${height}px`);
    document.documentElement.style.setProperty('--keyboard-inset', `${keyboardInset}px`);
  }

  /**
   * Synchronize UI state when crossing the 768px breakpoint
   */
  _syncAdaptiveMode() {
    const mobile = this.isMobileMode();
    document.body.classList.toggle('is-mobile-mode', mobile);

    if (this.modeTag) {
      this.modeTag.textContent = mobile
        ? 'Mobile Bottom Sheet (<768px)'
        : 'Desktop Modal Dialog (≥768px)';
    }

    // If open and viewport transitions across 768px, reset inline drag offsets cleanly
    if (this.isOpen && !this.isClosing) {
      this.dialog.classList.remove('is-dragging');
      this.surface.style.setProperty('--drawer-drag-y', '0px');
      this.surface.style.setProperty('--drawer-modal-opacity', '1');
      this.surface.style.setProperty('--drawer-modal-scale', '1');
      this.backdrop.style.setProperty('--drawer-backdrop-opacity', '1');
      if (!mobile) {
        this.setSnapPoint(false);
      }
    }

    this._emitTelemetry(0, 0);
  }

  /**
   * Open the Cross-Platform Drawer with custom content
   * @param {Object} config
   * @param {string} config.title
   * @param {string} config.subtitle
   * @param {string} config.bodyHTML
   * @param {string} config.footerHTML
   * @param {HTMLElement} [config.triggerEl]
   */
  open({ title, subtitle, bodyHTML, footerHTML, triggerEl = null }) {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.isClosing = false;
    this.lastTriggerEl = triggerEl || document.activeElement;

    if (title) this.titleEl.textContent = title;
    if (subtitle) this.subtitleEl.textContent = subtitle;
    if (typeof bodyHTML === 'string') this.body.innerHTML = bodyHTML;
    if (typeof footerHTML === 'string') this.footer.innerHTML = footerHTML;

    this.setSnapPoint(false);
    this._syncViewportMetrics();
    this._syncAdaptiveMode();

    const mobile = this.isMobileMode();

    // Set initial pre-animation state
    this.dialog.classList.remove('is-dragging');
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', '0');

    if (mobile) {
      this.surface.style.setProperty('--drawer-drag-y', '100%');
    } else {
      this.surface.style.setProperty('--drawer-drag-y', '18px');
      this.surface.style.setProperty('--drawer-modal-opacity', '0');
      this.surface.style.setProperty('--drawer-modal-scale', '0.95');
    }

    // Invoke native HTMLDialogElement top-layer modal presentation
    if (!this.dialog.open) {
      this.dialog.showModal();
    }

    this.isOpen = true;
    document.body.classList.add('drawer-open');
    document.body.classList.toggle('is-mobile-mode', mobile);
    this.body.scrollTop = 0;

    // Trigger entrance transition on next animation frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.backdrop.style.setProperty('--drawer-backdrop-opacity', '1');
        this.surface.style.setProperty('--drawer-drag-y', '0px');
        this.surface.style.setProperty('--drawer-modal-opacity', '1');
        this.surface.style.setProperty('--drawer-modal-scale', '1');
        this._emitTelemetry(0, 0);
      });
    });
  }

  /**
   * Smoothly animate and close the Drawer
   * @param {string} [reason]
   */
  close(reason = 'programmatic') {
    if (!this.isOpen || this.isClosing) return;
    this.isClosing = true;
    this.dialog.classList.remove('is-dragging');

    const mobile = this.isMobileMode();
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', '0');

    if (mobile) {
      const sheetHeight = this.surface.getBoundingClientRect().height || 420;
      this.surface.style.setProperty('--drawer-drag-y', `${sheetHeight + 40}px`);
    } else {
      this.surface.style.setProperty('--drawer-drag-y', '14px');
      this.surface.style.setProperty('--drawer-modal-opacity', '0');
      this.surface.style.setProperty('--drawer-modal-scale', '0.96');
    }

    document.body.classList.remove('drawer-open');

    this.closeTimer = setTimeout(() => {
      if (this.dialog.open) {
        this.dialog.close(reason);
      }
      this.isOpen = false;
      this.isClosing = false;
      this.setSnapPoint(false);
      this._emitTelemetry(0, 0);

      // Restore keyboard focus to the trigger element for accessibility
      if (this.lastTriggerEl && typeof this.lastTriggerEl.focus === 'function') {
        try {
          this.lastTriggerEl.focus({ preventScroll: true });
        } catch (_) {}
      }
    }, 320);
  }

  /**
   * Toggle between Default and Expanded Full-Height snap points on Mobile (<768px)
   * @param {boolean} [expand]
   */
  setSnapPoint(expand) {
    this.isExpandedSnap = Boolean(expand);
    this.dialog.classList.toggle('is-expanded-snap', this.isExpandedSnap);
    if (this.snapIcon) {
      this.snapIcon.textContent = this.isExpandedSnap ? '⤡' : '⤢';
    }
    if (this.snapBtn) {
      this.snapBtn.setAttribute(
        'aria-label',
        this.isExpandedSnap ? 'Restore default sheet height' : 'Expand sheet to full height'
      );
    }
  }

  toggleSnapPoint() {
    this.setSnapPoint(!this.isExpandedSnap);
    // Subtle haptic feedback on supported mobile devices
    if (navigator.vibrate) {
      try { navigator.vibrate(8); } catch (_) {}
    }
  }

  /* ==========================================================================
     MOBILE BOTTOM SHEET GESTURE ENGINE (Pointer Events + Physics)
     ========================================================================== */

  _onPointerDown(e) {
    // Only enable touch/drag gestures in Mobile Bottom Sheet mode (< 768px)
    if (!this.isMobileMode() || !this.isOpen || this.isClosing) return;

    // Ignore right-clicks or secondary mouse buttons
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Do not hijack interactions starting directly on buttons or form controls
    const interactiveTarget = e.target.closest('button, a, input, textarea, select, label');
    const inHandleOrHeader = Boolean(
      e.target.closest('#drawerHandleBar') || e.target.closest('#drawerHeader')
    );
    const inBody = Boolean(e.target.closest('#drawerBody'));

    if (interactiveTarget && !e.target.closest('#drawerHandleBar')) {
      return;
    }

    if (!inHandleOrHeader && !inBody) {
      return;
    }

    const now = performance.now();
    this.dragState.pointerId = e.pointerId;
    this.dragState.startY = e.clientY;
    this.dragState.startX = e.clientX;
    this.dragState.currentDeltaY = 0;
    this.dragState.isDragging = false;
    this.dragState.startedInBody = inBody && !inHandleOrHeader;
    this.dragState.gestureLockedOut = false;
    this.dragState.sheetHeight = this.surface.getBoundingClientRect().height || 400;
    this.dragState.samples = [{ y: e.clientY, time: now }];
    this.dragState.lastVelocity = 0;

    // If user grabbed the handle bar directly, capture pointer immediately
    if (inHandleOrHeader) {
      try {
        this.surface.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
  }

  _onPointerMove(e) {
    if (this.dragState.pointerId === null || e.pointerId !== this.dragState.pointerId) return;
    if (this.dragState.gestureLockedOut) return;

    const rawDeltaY = e.clientY - this.dragState.startY;
    const rawDeltaX = e.clientX - this.dragState.startX;

    // Before locking into sheet drag, evaluate slop & nested scroll handoff
    if (!this.dragState.isDragging) {
      if (Math.abs(rawDeltaY) < this.DRAG_SLOP_PX && Math.abs(rawDeltaX) < this.DRAG_SLOP_PX) {
        return;
      }

      // If user is swiping horizontally more than vertically, cancel sheet drag
      if (Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.2) {
        this.dragState.gestureLockedOut = true;
        return;
      }

      // Nested Scroll-to-Drag Handoff:
      // If pointer started inside the scrollable .cp-drawer__body:
      // - Allow native scrolling if body.scrollTop > 0
      // - Or if scrolling down into content (rawDeltaY < 0) when already scrollable
      if (this.dragState.startedInBody) {
        const atTopOfScroll = this.body.scrollTop <= 0;
        const pullingDown = rawDeltaY > 0;

        if (!atTopOfScroll || !pullingDown) {
          this.dragState.gestureLockedOut = true;
          return;
        }
      }

      // Engage active sheet dragging!
      this.dragState.isDragging = true;
      this.dragState.startY = e.clientY; // Reset origin to prevent jump after slop
      this.dialog.classList.add('is-dragging');
    }

    // Prevent browser pull-to-refresh or native scroll while dragging sheet
    if (e.cancelable) {
      e.preventDefault();
    }

    const activeDeltaY = e.clientY - this.dragState.startY;
    const now = performance.now();

    // Maintain sliding 80ms sample window for velocity calculation
    this.dragState.samples.push({ y: e.clientY, time: now });
    while (this.dragState.samples.length > 2 && now - this.dragState.samples[0].time > 80) {
      this.dragState.samples.shift();
    }

    // Calculate damped Y offset:
    // - Pulling downward (activeDeltaY >= 0): 1:1 tracking with finger
    // - Pulling upward (activeDeltaY < 0): hyperbolic rubber-band damping
    let visualDeltaY = activeDeltaY;
    if (activeDeltaY < 0) {
      const pullDistance = Math.abs(activeDeltaY);
      visualDeltaY = -this.RUBBER_BAND_MAX_PX * (1 - Math.exp(-pullDistance / 160));
    }

    this.dragState.currentDeltaY = visualDeltaY;
    const velocity = this._computeVelocity();
    this.dragState.lastVelocity = velocity;

    // Schedule GPU-composited transform & backdrop scrub update
    if (!this.dragState.rafId) {
      this.dragState.rafId = requestAnimationFrame(() => {
        this.dragState.rafId = null;
        this._applyDragTransform(this.dragState.currentDeltaY, this.dragState.lastVelocity);
      });
    }
  }

  _onPointerUp(e) {
    if (this.dragState.pointerId === null || e.pointerId !== this.dragState.pointerId) return;

    if (this.dragState.rafId) {
      cancelAnimationFrame(this.dragState.rafId);
      this.dragState.rafId = null;
    }

    const wasDragging = this.dragState.isDragging;
    const deltaY = this.dragState.currentDeltaY;
    const velocity = this._computeVelocity();
    const sheetHeight = this.dragState.sheetHeight || 400;

    this.dragState.pointerId = null;
    this.dragState.isDragging = false;
    this.dragState.gestureLockedOut = false;
    this.dialog.classList.remove('is-dragging');

    if (!wasDragging) return;

    const dragRatio = deltaY / sheetHeight;

    // Decision Matrix on Release:
    // 1. Fast downward flick OR dragged past 33% of height -> Dismiss (or collapse from expanded snap)
    if (velocity > this.DISMISS_VELOCITY_THRESHOLD || dragRatio > this.DISMISS_RATIO_THRESHOLD) {
      if (this.isExpandedSnap && velocity < 1.1 && dragRatio < 0.55) {
        // Collapse from full-screen snap back to standard snap first
        this.setSnapPoint(false);
        this._springToRest();
      } else {
        if (navigator.vibrate) {
          try { navigator.vibrate(10); } catch (_) {}
        }
        this.close('swipe-dismiss');
      }
      return;
    }

    // 2. Fast upward flick OR strong upward pull -> Expand to full-height snap point
    if (velocity < this.EXPAND_VELOCITY_THRESHOLD || deltaY < -28) {
      this.setSnapPoint(true);
      this._springToRest();
      return;
    }

    // 3. Otherwise -> Spring back smoothly to resting position (0px)
    this._springToRest();
  }

  /**
   * Apply real-time transform and backdrop opacity during active pointer drag
   */
  _applyDragTransform(deltaY, velocity) {
    this.surface.style.setProperty('--drawer-drag-y', `${deltaY.toFixed(1)}px`);

    // Scrub backdrop opacity proportionally as user drags sheet down
    const progress = Math.max(0, Math.min(1, deltaY / (this.dragState.sheetHeight || 400)));
    const backdropOpacity = Math.max(0.1, 1 - progress * 0.85);
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', backdropOpacity.toFixed(3));

    this._emitTelemetry(deltaY, velocity);
  }

  /**
   * Spring back to 0px resting offset
   */
  _springToRest() {
    this.surface.style.setProperty('--drawer-drag-y', '0px');
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', '1');
    this._emitTelemetry(0, 0);
  }

  /**
   * Compute flick velocity in px/ms from the sliding 80ms pointer sample window
   */
  _computeVelocity() {
    const samples = this.dragState.samples;
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = last.time - first.time;
    if (dt <= 0) return 0;
    return (last.y - first.y) / dt;
  }

  /**
   * Emit live telemetry to the page's status bar
   */
  _emitTelemetry(deltaY, velocity) {
    this.onTelemetry({
      isMobile: this.isMobileMode(),
      forceMobile: this.forceMobilePreview,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      deltaY: Math.round(deltaY),
      velocity: Number(velocity.toFixed(2)),
      isOpen: this.isOpen,
      isExpandedSnap: this.isExpandedSnap,
    });
  }
}

window.CrossPlatformDrawer = CrossPlatformDrawer;
