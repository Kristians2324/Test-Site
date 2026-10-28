/**
 * ============================================================================
 * AetherStudio Web App — Controller & Interactive Drawer Templates
 * ============================================================================
 */

(function () {
  const PRODUCTS = {
    'aether-one': {
      name: 'Aether One Studio',
      category: 'Open-Back Planar Magnetic Headphones',
      price: '$549',
      emoji: '🎧',
      gradient: 'gradient-indigo',
      summary:
        'Engineered with ultra-thin 2-micron nano-diaphragm drivers and CNC-milled magnesium earcups for zero-resonance reference monitoring.',
      specs: [
        { label: 'Driver Type', value: '98mm Planar Magnetic' },
        { label: 'Frequency Response', value: '5 Hz – 55,000 Hz' },
        { label: 'Impedance', value: '32 Ω (Mobile & Desktop)' },
        { label: 'Total Harmonic Distortion', value: '< 0.04% @ 1 kHz' },
        { label: 'Weight', value: '365g (Magnesium Alloy)' },
        { label: 'Connector', value: 'Dual 3.5mm + 4.4mm Balanced' },
      ],
      finishes: ['Obsidian Anodized', 'Titanium Raw', 'Cobalt Limited'],
    },
    'pulse-dac': {
      name: 'Pulse R2R Reference DAC',
      category: 'Discrete 24-Bit Resistor Ladder DAC & Amp',
      price: '$329',
      emoji: '🎛️',
      gradient: 'gradient-emerald',
      summary:
        'True balanced R2R resistor network with femtosecond crystal clock, zero-feedback Class-A headphone stage, and USB-C plug-and-play.',
      specs: [
        { label: 'Architecture', value: 'Fully Balanced 24-Bit R2R' },
        { label: 'Max Output Power', value: '2,400 mW @ 32 Ω' },
        { label: 'Dynamic Range', value: '127 dB SNR' },
        { label: 'Sample Rates', value: 'PCM 768kHz / DSD512' },
        { label: 'Inputs', value: 'USB-C, Optical, Coax' },
        { label: 'Chassis', value: 'Bead-Blasted Aluminum' },
      ],
      finishes: ['Stealth Matte Black', 'Silver Billet'],
    },
    'monolith-speaker': {
      name: 'Monolith Air Monitors',
      category: 'Active Cardioid Nearfield Studio Pair',
      price: '$899',
      emoji: '🔊',
      gradient: 'gradient-amber',
      summary:
        'Beryllium folded-ribbon tweeters paired with acoustic cardioid rear vents eliminate desk bounce and rear-wall bass buildup.',
      specs: [
        { label: 'Tweeter', value: 'Beryllium Folded Ribbon' },
        { label: 'Woofer', value: '6.5" Woven Carbon Cone' },
        { label: 'Amplification', value: 'Dual 180W Class-D Bi-Amp' },
        { label: 'Room Calibration', value: 'Built-in 32-bit DSP' },
        { label: 'Max SPL', value: '112 dB Peak (Pair)' },
        { label: 'Wireless / Wired', value: 'XLR, TRS, USB-C, Wi-Fi' },
      ],
      finishes: ['Studio Anthracite', 'Nordic Birch'],
    },
  };

  // DOM References for Telemetry Bar
  const modeBadge = document.getElementById('modeBadge');
  const modeLabel = document.getElementById('modeLabel');
  const metricViewport = document.getElementById('metricViewport');
  const metricDeltaY = document.getElementById('metricDeltaY');
  const metricVelocity = document.getElementById('metricVelocity');
  const forceMobileToggle = document.getElementById('forceMobileToggle');
  const forceMobileText = document.getElementById('forceMobileText');
  const showcaseActiveMode = document.getElementById('showcaseActiveMode');
  const miniDesktopCard = document.getElementById('miniDesktopCard');
  const miniMobileCard = document.getElementById('miniMobileCard');
  const toastContainer = document.getElementById('toastContainer');

  // Initialize the Cross-Platform Drawer
  const drawer = new window.CrossPlatformDrawer({
    dialogEl: document.getElementById('crossPlatformDrawer'),
    onTelemetry(data) {
      if (metricViewport) {
        metricViewport.textContent = `${data.viewportWidth} × ${data.viewportHeight}px`;
      }
      if (metricDeltaY) {
        metricDeltaY.textContent = `${data.deltaY}px`;
      }
      if (metricVelocity) {
        metricVelocity.textContent = `${data.velocity.toFixed(2)} px/ms`;
      }

      if (modeBadge && modeLabel) {
        modeBadge.classList.toggle('is-mobile', data.isMobile);
        if (data.isMobile) {
          modeLabel.textContent = data.forceMobile
            ? 'Mobile Bottom Sheet (Simulated <768px)'
            : 'Mobile Bottom Sheet (<768px)';
        } else {
          modeLabel.textContent = 'Desktop Modal Dialog (≥768px)';
        }
      }

      if (showcaseActiveMode) {
        showcaseActiveMode.textContent = data.isMobile
          ? 'Active: Bottom Sheet (<768px)'
          : 'Active: Centered Modal (≥768px)';
      }

      if (miniDesktopCard && miniMobileCard) {
        miniDesktopCard.classList.toggle('is-active-mode', !data.isMobile);
        miniMobileCard.classList.toggle('is-active-mode', data.isMobile);
      }
    },
  });

  // Expose instance for debugging in DevTools console
  window.aetherDrawer = drawer;

  // Handle "Simulate Mobile (<768px)" Toggle Button
  if (forceMobileToggle) {
    forceMobileToggle.addEventListener('click', () => {
      const active = drawer.setForceMobilePreview();
      forceMobileToggle.classList.toggle('is-active', active);
      forceMobileText.textContent = active
        ? 'Exit Mobile Simulation'
        : 'Simulate Mobile (<768px)';
      showToast(
        active
          ? '📱 Switched to Mobile Bottom Sheet mode (<768px behavior)'
          : '🖥️ Restored Automatic Breakpoint Detection (768px)'
      );
    });
  }

  // Toast helper
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2800);
  }

  // Build Drawer Templates
  function openProductDrawer(productId, triggerEl) {
    const product = PRODUCTS[productId] || PRODUCTS['aether-one'];
    const isMobile = drawer.isMobileMode();

    const bodyHTML = `
      <div class="gesture-hint-banner">
        <span>${isMobile ? '👆' : '🖱️'}</span>
        <span>
          ${
            isMobile
              ? '<strong>Mobile Sheet Active:</strong> Drag handle or pull down from top of scroll to dismiss. Flick up or tap ⤢ to expand!'
              : '<strong>Desktop Modal Active (≥768px):</strong> Click outside on the backdrop or press <code>Esc</code> to dismiss. Resize window &lt;768px to morph into a Bottom Sheet!'
          }
        </span>
      </div>

      <div class="drawer-hero-banner ${product.gradient}">
        <div class="drawer-hero-icon" aria-hidden="true">${product.emoji}</div>
        <div>
          <div style="font-size: 0.78rem; color: #cbd5e1; font-weight: 600;">${product.category}</div>
          <div style="font-size: 1.35rem; font-weight: 800; margin: 2px 0;">${product.name}</div>
          <div style="font-size: 1.05rem; color: #a5b4fc; font-weight: 700;">${product.price} USD • In Stock</div>
        </div>
      </div>

      <p style="color: var(--text-secondary); font-size: 0.92rem;">
        ${product.summary}
      </p>

      <h3 class="drawer-section-title">Select Finish</h3>
      <div class="option-pills" role="radiogroup" aria-label="Select Finish">
        ${product.finishes
          .map(
            (finish, i) => `
          <button type="button" class="option-pill ${i === 0 ? 'is-selected' : ''}" data-option-pill>
            ${finish}
          </button>
        `
          )
          .join('')}
      </div>

      <h3 class="drawer-section-title">Technical Specifications (Scrollable Content Test)</h3>
      <div class="spec-grid">
        ${product.specs
          .map(
            (s) => `
          <div class="spec-box">
            <span>${s.label}</span>
            <strong>${s.value}</strong>
          </div>
        `
          )
          .join('')}
      </div>

      <h3 class="drawer-section-title">Included in the Box</h3>
      <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 0.88rem; display: grid; gap: 6px;">
        <li>${product.name} Hardware Unit with serialized calibration certificate</li>
        <li>Braided OFC Silver-Plated Acoustic Cable (2.0m)</li>
        <li> Waterproof ballistic nylon travel case</li>
        <li>3-Year International Studio Hardware Warranty</li>
      </ul>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" data-drawer-close>Cancel</button>
      <button type="button" class="btn btn-primary btn-sm" data-drawer-action="reserve" data-product-name="${product.name}">
        <span>⚡</span> Add ${product.name} (${product.price})
      </button>
    `;

    drawer.open({
      title: product.name,
      subtitle: `${product.category} • ${product.price}`,
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openFeedbackFormDrawer(triggerEl) {
    const bodyHTML = `
      <div class="gesture-hint-banner">
        <span>⌨️</span>
        <span>
          <strong>Mobile Virtual Keyboard Optimization:</strong> Inputs use <code>16px</code> font size (preventing iOS Safari auto-zoom) and <code>window.visualViewport</code> listeners so the sheet adjusts above the on-screen keyboard.
        </span>
      </div>

      <form id="drawerDemoForm">
        <div class="form-group">
          <label class="form-label" for="studioNameInput">Your Name or Studio</label>
          <input class="form-input" id="studioNameInput" type="text" placeholder="e.g. SoundLab Mastering" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="hardwareModelSelect">Hardware Model of Interest</label>
          <select class="form-select" id="hardwareModelSelect">
            <option value="Aether One Studio ($549)">Aether One Studio ($549)</option>
            <option value="Pulse R2R Reference DAC ($329)">Pulse R2R Reference DAC ($329)</option>
            <option value="Monolith Air Monitors ($899)">Monolith Air Monitors ($899)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="acousticNotesInput">Acoustic Notes / Questions</label>
          <textarea class="form-textarea" id="acousticNotesInput" rows="3" placeholder="Test typing here on mobile or desktop..."></textarea>
        </div>
      </form>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" data-drawer-close>Close</button>
      <button type="submit" form="drawerDemoForm" class="btn btn-primary btn-sm">
        Submit Reservation Request
      </button>
    `;

    drawer.open({
      title: 'Studio Audition & Input Test',
      subtitle: 'Tests focus trapping, Esc key & mobile visualViewport keyboard',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openArchitectureDrawer(triggerEl) {
    const bodyHTML = `
      <div class="gesture-hint-banner">
        <span>📐</span>
        <span>
          <strong>Zero External Libraries:</strong> Built strictly with native HTML5, CSS3, and ES6 Web APIs.
        </span>
      </div>

      <h3 class="drawer-section-title" style="margin-top: 4px;">1. Adaptive Presentation (&ge;768px vs &lt;768px)</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem;">
        CSS <code>@media (min-width: 768px)</code> and JS <code>window.matchMedia('(min-width: 768px)')</code> coordinate presentation in real time:
      </p>
      <pre class="code-snippet">/* Mobile (<768px): Bottom Sheet */
.cp-drawer__positioner { align-items: flex-end; }
.cp-drawer__surface {
  border-radius: 24px 24px 0 0;
  transform: translate3d(0, var(--drawer-drag-y, 100%), 0);
}

/* Desktop (>=768px): Centered Modal Dialog */
@media (min-width: 768px) {
  .cp-drawer__positioner { align-items: center; padding: 24px; }
  .cp-drawer__surface {
    max-width: 560px;
    border-radius: 20px;
    transform: translate3d(0, var(--drawer-drag-y, 16px), 0)
               scale(var(--drawer-modal-scale, 0.96));
  }
}</pre>

      <h3 class="drawer-section-title">2. Pointer Events, Flick Velocity &amp; Rubber-Banding</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem;">
        On mobile (<code>&lt;768px</code>), <code>pointermove</code> tracks finger position 1:1 via <code>requestAnimationFrame</code>. A sliding 80ms sample window calculates flick velocity ($v = \\Delta y / \\Delta t$). Pulling upward past <code>0px</code> applies exponential rubber-band damping:
      </p>
      <pre class="code-snippet">// Upward overscroll rubber-band resistance
if (activeDeltaY &lt; 0) {
  const pull = Math.abs(activeDeltaY);
  visualDeltaY = -56 * (1 - Math.exp(-pull / 160));
}
// Flick or distance dismissal check on pointerup
if (velocity &gt; 0.45 || dragRatio &gt; 0.33) {
  this.close('swipe-dismiss');
}</pre>

      <h3 class="drawer-section-title">3. Nested Scroll-to-Drag Handoff</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem;">
        When swiping inside the scrollable drawer body, native scrolling proceeds normally while <code>body.scrollTop &gt; 0</code>. The instant <code>scrollTop &lt;= 0</code> and the user pulls downward, the gesture seamlessly hands off to dragging the bottom sheet down.
      </p>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-secondary btn-sm" id="drawerToggleModeInside">
        📱 Toggle Mobile/Desktop Preview
      </button>
      <button type="button" class="btn btn-primary btn-sm" data-drawer-close>Got It</button>
    `;

    drawer.open({
      title: 'Implementation & Architecture',
      subtitle: 'How the Cross-Platform Native Drawer works under the hood',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openQuickSettingsDrawer(triggerEl) {
    const isMobile = drawer.isMobileMode();
    const bodyHTML = `
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 14px;">
        Test the live adaptive state and snap points directly from inside the drawer:
      </p>

      <div class="spec-grid">
        <div class="spec-box">
          <span>Current Mode</span>
          <strong>${isMobile ? 'Mobile Sheet (<768px)' : 'Desktop Modal (≥768px)'}</strong>
        </div>
        <div class="spec-box">
          <span>Viewport Width</span>
          <strong>${window.innerWidth}px</strong>
        </div>
        <div class="spec-box">
          <span>Dismiss Velocity</span>
          <strong>0.45 px/ms</strong>
        </div>
        <div class="spec-box">
          <span>Dismiss Distance</span>
          <strong>33% of Sheet Height</strong>
        </div>
      </div>

      <div style="display: grid; gap: 10px; margin-top: 16px;">
        <button type="button" class="btn btn-secondary btn-block" id="drawerToggleModeInside">
          🔄 Switch Between Desktop Modal &amp; Mobile Sheet
        </button>
        ${
          isMobile
            ? `<button type="button" class="btn btn-ghost btn-block" id="drawerToggleSnapInside">
                 ⤢ Toggle Mobile Sheet Snap Height (Default / Full)
               </button>`
            : ''
        }
      </div>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-primary btn-sm" data-drawer-close>Done</button>
    `;

    drawer.open({
      title: 'Drawer Interactive Controls',
      subtitle: 'Inspect & toggle cross-platform behavior live',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  // Delegate clicks across the page and inside the drawer
  document.addEventListener('click', (e) => {
    // 1. Trigger buttons/cards that open the drawer
    const trigger = e.target.closest('[data-drawer-trigger]');
    if (trigger) {
      const type = trigger.getAttribute('data-drawer-trigger');
      const productId = trigger.getAttribute('data-product-id') || 'aether-one';

      if (type === 'product-detail' || type === 'Preorder') {
        openProductDrawer(productId, trigger);
      } else if (type === 'feedback-form') {
        openFeedbackFormDrawer(trigger);
      } else if (type === 'architecture') {
        openArchitectureDrawer(trigger);
      } else if (type === 'quick-settings') {
        openQuickSettingsDrawer(trigger);
      }
      return;
    }

    // 2. Option pills inside the drawer
    const pill = e.target.closest('[data-option-pill]');
    if (pill) {
      const group = pill.parentElement;
      if (group) {
        group.querySelectorAll('[data-option-pill]').forEach((el) => el.classList.remove('is-selected'));
      }
      pill.classList.add('is-selected');
      return;
    }

    // 3. Close button inside drawer footer
    if (e.target.closest('[data-drawer-close]')) {
      drawer.close('footer-close');
      return;
    }

    // 4. Reserve action inside drawer
    const reserveBtn = e.target.closest('[data-drawer-action="reserve"]');
    if (reserveBtn) {
      const name = reserveBtn.getAttribute('data-product-name') || 'Hardware Unit';
      drawer.close('action-complete');
      showToast(`✅ Reserved ${name}! Confirmation sent.`);
      return;
    }

    // 5. Toggle Mobile/Desktop mode from inside the drawer
    if (e.target.closest('#drawerToggleModeInside')) {
      if (forceMobileToggle) forceMobileToggle.click();
      return;
    }

    // 6. Toggle Snap point from inside the drawer
    if (e.target.closest('#drawerToggleSnapInside')) {
      drawer.toggleSnapPoint();
      return;
    }
  });

  // Support Enter / Space key activation on product cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.product-card[data-drawer-trigger]');
      if (card) {
        e.preventDefault();
        card.click();
      }
    }
  });

  // Handle form submission inside drawer
  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'drawerDemoForm') {
      e.preventDefault();
      const studioName = document.getElementById('studioNameInput')?.value || 'Studio';
      drawer.close('form-submit');
      showToast(`🎧 Audition request received for ${studioName}!`);
    }
  });
})();
