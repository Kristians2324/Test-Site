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
 * ============================================================================
 */

class CrossPlatformDrawer {
  constructor({ dialogEl }) {
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
    this.categoryTag = dialogEl.querySelector('#drawerCategoryTag');
    this.titleEl = dialogEl.querySelector('#drawerTitle');
    this.subtitleEl = dialogEl.querySelector('#drawerSubtitle');

    this.desktopMediaQuery = window.matchMedia('(min-width: 768px)');

    this.isOpen = false;
    this.isClosing = false;
    this.isExpandedSnap = false;
    this.lastTriggerEl = null;
    this.closeTimer = null;

    this.dragState = {
      pointerId: null,
      startY: 0,
      startX: 0,
      currentDeltaY: 0,
      isDragging: false,
      startedInBody: false,
      gestureLockedOut: false,
      sheetHeight: 400,
      samples: [],
      rafId: null,
    };

    this.DISMISS_VELOCITY_THRESHOLD = 0.45;
    this.EXPAND_VELOCITY_THRESHOLD = -0.45;
    this.DISMISS_RATIO_THRESHOLD = 0.33;
    this.RUBBER_BAND_MAX_PX = 56;
    this.DRAG_SLOP_PX = 6;

    this._bindEvents();
    this._syncViewportMetrics();
    this._syncAdaptiveMode();
  }

  isMobileMode() {
    return !this.desktopMediaQuery.matches;
  }

  _bindEvents() {
    this.desktopMediaQuery.addEventListener('change', () => {
      this._syncAdaptiveMode();
    });

    window.addEventListener('resize', () => {
      this._syncViewportMetrics();
      this._syncAdaptiveMode();
    }, { passive: true });

    if (window.visualViewport) {
      const handleVisualViewport = () => this._syncViewportMetrics();
      window.visualViewport.addEventListener('resize', handleVisualViewport, { passive: true });
      window.visualViewport.addEventListener('scroll', handleVisualViewport, { passive: true });
    }

    // Outside backdrop click to dismiss (works on Desktop Modal & Mobile Sheet)
    this.dialog.addEventListener('click', (e) => {
      if (this.isClosing) return;
      if (e.target === this.dialog || e.target === this.backdrop || e.target === this.positioner) {
        this.close('backdrop');
      }
    });

    this.closeBtn.addEventListener('click', () => this.close('close-button'));
    if (this.snapBtn) {
      this.snapBtn.addEventListener('click', () => this.toggleSnapPoint());
    }
    this.handleBar.addEventListener('dblclick', () => {
      if (this.isMobileMode()) this.toggleSnapPoint();
    });

    // Native <dialog> cancel event (Escape key)
    this.dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      this.close('escape-key');
    });

    // Pointer Events for Mobile Bottom Sheet Gestures
    this.surface.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    window.addEventListener('pointermove', (e) => this._onPointerMove(e), { passive: false });
    window.addEventListener('pointerup', (e) => this._onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this._onPointerUp(e));
  }

  _syncViewportMetrics() {
    const vv = window.visualViewport;
    const height = vv ? vv.height : window.innerHeight;
    const keyboardInset = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;

    document.documentElement.style.setProperty('--vvh', `${height}px`);
    document.documentElement.style.setProperty('--keyboard-inset', `${keyboardInset}px`);
  }

  _syncAdaptiveMode() {
    const mobile = this.isMobileMode();
    document.body.classList.toggle('is-mobile-mode', mobile);

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
  }

  open({ category, title, subtitle, bodyHTML, footerHTML, triggerEl = null }) {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.isClosing = false;
    this.lastTriggerEl = triggerEl || document.activeElement;

    if (category && this.categoryTag) this.categoryTag.textContent = category;
    if (title) this.titleEl.textContent = title;
    if (subtitle) this.subtitleEl.textContent = subtitle;
    if (typeof bodyHTML === 'string') this.body.innerHTML = bodyHTML;
    if (typeof footerHTML === 'string') this.footer.innerHTML = footerHTML;

    this.setSnapPoint(false);
    this._syncViewportMetrics();
    this._syncAdaptiveMode();

    const mobile = this.isMobileMode();

    this.dialog.classList.remove('is-dragging');
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', '0');

    if (mobile) {
      this.surface.style.setProperty('--drawer-drag-y', '100%');
    } else {
      this.surface.style.setProperty('--drawer-drag-y', '18px');
      this.surface.style.setProperty('--drawer-modal-opacity', '0');
      this.surface.style.setProperty('--drawer-modal-scale', '0.95');
    }

    if (!this.dialog.open) {
      this.dialog.showModal();
    }

    this.isOpen = true;
    document.body.classList.add('drawer-open');
    document.body.classList.toggle('is-mobile-mode', mobile);
    this.body.scrollTop = 0;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.backdrop.style.setProperty('--drawer-backdrop-opacity', '1');
        this.surface.style.setProperty('--drawer-drag-y', '0px');
        this.surface.style.setProperty('--drawer-modal-opacity', '1');
        this.surface.style.setProperty('--drawer-modal-scale', '1');
      });
    });
  }

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

      if (this.lastTriggerEl && typeof this.lastTriggerEl.focus === 'function') {
        try {
          this.lastTriggerEl.focus({ preventScroll: true });
        } catch (_) {}
      }
    }, 320);
  }

  setSnapPoint(expand) {
    this.isExpandedSnap = Boolean(expand);
    this.dialog.classList.toggle('is-expanded-snap', this.isExpandedSnap);
    if (this.snapIcon) {
      this.snapIcon.textContent = this.isExpandedSnap ? '⤡' : '⤢';
    }
  }

  toggleSnapPoint() {
    this.setSnapPoint(!this.isExpandedSnap);
    if (navigator.vibrate) {
      try { navigator.vibrate(8); } catch (_) {}
    }
  }

  _onPointerDown(e) {
    if (!this.isMobileMode() || !this.isOpen || this.isClosing) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

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

    if (!this.dragState.isDragging) {
      if (Math.abs(rawDeltaY) < this.DRAG_SLOP_PX && Math.abs(rawDeltaX) < this.DRAG_SLOP_PX) {
        return;
      }

      if (Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.2) {
        this.dragState.gestureLockedOut = true;
        return;
      }

      if (this.dragState.startedInBody) {
        const atTopOfScroll = this.body.scrollTop <= 0;
        const pullingDown = rawDeltaY > 0;
        if (!atTopOfScroll || !pullingDown) {
          this.dragState.gestureLockedOut = true;
          return;
        }
      }

      this.dragState.isDragging = true;
      this.dragState.startY = e.clientY;
      this.dialog.classList.add('is-dragging');
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    const activeDeltaY = e.clientY - this.dragState.startY;
    const now = performance.now();

    this.dragState.samples.push({ y: e.clientY, time: now });
    while (this.dragState.samples.length > 2 && now - this.dragState.samples[0].time > 80) {
      this.dragState.samples.shift();
    }

    let visualDeltaY = activeDeltaY;
    if (activeDeltaY < 0) {
      const pullDistance = Math.abs(activeDeltaY);
      visualDeltaY = -this.RUBBER_BAND_MAX_PX * (1 - Math.exp(-pullDistance / 160));
    }

    this.dragState.currentDeltaY = visualDeltaY;

    if (!this.dragState.rafId) {
      this.dragState.rafId = requestAnimationFrame(() => {
        this.dragState.rafId = null;
        this._applyDragTransform(this.dragState.currentDeltaY);
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

    if (velocity > this.DISMISS_VELOCITY_THRESHOLD || dragRatio > this.DISMISS_RATIO_THRESHOLD) {
      if (this.isExpandedSnap && velocity < 1.1 && dragRatio < 0.55) {
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

    if (velocity < this.EXPAND_VELOCITY_THRESHOLD || deltaY < -28) {
      this.setSnapPoint(true);
      this._springToRest();
      return;
    }

    this._springToRest();
  }

  _applyDragTransform(deltaY) {
    this.surface.style.setProperty('--drawer-drag-y', `${deltaY.toFixed(1)}px`);
    const progress = Math.max(0, Math.min(1, deltaY / (this.dragState.sheetHeight || 400)));
    const backdropOpacity = Math.max(0.1, 1 - progress * 0.85);
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', backdropOpacity.toFixed(3));
  }

  _springToRest() {
    this.surface.style.setProperty('--drawer-drag-y', '0px');
    this.backdrop.style.setProperty('--drawer-backdrop-opacity', '1');
  }

  _computeVelocity() {
    const samples = this.dragState.samples;
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = last.time - first.time;
    if (dt <= 0) return 0;
    return (last.y - first.y) / dt;
  }
}

window.CrossPlatformDrawer = CrossPlatformDrawer;
