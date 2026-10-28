/**
 * ============================================================================
 * Kurobi Kitchen — Menu, Dish Customizer, Order Cart & Table Reservation
 * ============================================================================
 */

(function () {
  const DISHES = [
    {
      id: 'black-garlic-tonkotsu',
      category: 'ramen',
      categoryLabel: 'Signature Ramen',
      badge: 'Chef’s Favorite',
      name: 'Black Garlic Tonkotsu Deluxe',
      price: 18.5,
      calories: '740 kcal',
      protein: '42g Protein',
      prepTime: '12 mins',
      spice: 'Mild',
      artClass: 'art-ember',
      summary:
        '18-hour heritage pork bone broth layered with house-charred black garlic mayu, torch-seared pork belly chashu, 6-minute soy-marinated egg, wood ear mushrooms, and scallions.',
      optionLabel: 'Noodle Texture',
      options: ['Standard Firmness', 'Hard (Katame)', 'Soft', 'Gluten-Free Rice Noodles'],
      addons: [
        { name: 'Extra 6-Min Ajitama Egg', price: 2.5 },
        { name: 'Extra Seared Chashu (2 pcs)', price: 4.5 },
        { name: 'House Chili Crisp Bomb', price: 1.5 },
        { name: 'Roasted Nori Sheets (4 pcs)', price: 1.75 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <ellipse cx="140" cy="78" rx="64" ry="22" fill="#7c2d12" stroke="#f59e0b" stroke-width="2"/>
          <path d="M98 78 Q114 68 130 78 T162 78 T186 78" fill="none" stroke="#fcd34d" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="120" cy="72" rx="12" ry="8" fill="#fef3c7"/>
          <ellipse cx="120" cy="72" rx="6" ry="4" fill="#ea580c"/>
          <path d="M76 78 C80 122, 200 122, 204 78 Z" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
          <rect x="116" y="114" width="48" height="7" rx="3" fill="#27272a"/>
        </svg>
      `,
    },
    {
      id: 'spicy-sesame-tantanmen',
      category: 'ramen',
      categoryLabel: 'Signature Ramen',
      badge: 'Spicy',
      name: 'Sichuan Sesame Tantanmen',
      price: 17.75,
      calories: '710 kcal',
      protein: '38g Protein',
      prepTime: '12 mins',
      spice: 'Medium-Hot',
      artClass: 'art-crimson',
      summary:
        'Creamy roasted white-sesame and chicken broth infused with toasted Sichuan peppercorn chili oil, crispy spiced pork soboro, bok choy, and crushed peanuts.',
      optionLabel: 'Spice Level',
      options: ['Medium (House Standard)', 'Extra Spicy (2x Rayu)', 'Mild on the Side'],
      addons: [
        { name: 'Extra 6-Min Ajitama Egg', price: 2.5 },
        { name: 'Double Spiced Pork Soboro', price: 3.75 },
        { name: 'Steamed Baby Bok Choy', price: 2.25 },
        { name: 'Side of Crispy Garlic Chips', price: 1.5 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <ellipse cx="140" cy="78" rx="64" ry="22" fill="#991b1b" stroke="#f87171" stroke-width="2"/>
          <path d="M98 80 Q116 70 134 80 T170 80" fill="none" stroke="#fde68a" stroke-width="3" stroke-linecap="round"/>
          <circle cx="155" cy="74" r="10" fill="#166534"/>
          <circle cx="122" cy="75" r="8" fill="#7f1d1d"/>
          <path d="M76 78 C80 122, 200 122, 204 78 Z" fill="#18181b" stroke="#52525b" stroke-width="2"/>
          <rect x="116" y="114" width="48" height="7" rx="3" fill="#27272a"/>
        </svg>
      `,
    },
    {
      id: 'truffle-mushroom-ramen',
      category: 'ramen',
      categoryLabel: 'Plant-Based Ramen',
      badge: '100% Plant-Based',
      name: 'Creamy Wild Mushroom & Miso',
      price: 17.25,
      calories: '620 kcal',
      protein: '24g Protein',
      prepTime: '10 mins',
      spice: 'Non-Spicy',
      artClass: 'art-jade',
      summary:
        'Velvety kombu, roasted cashew, and aged red miso broth topped with charred king oyster mushrooms, crispy tofu skin, charred sweet corn, and truffle aroma oil.',
      optionLabel: 'Noodle Texture',
      options: ['Standard Firmness', 'Hard (Katame)', 'Gluten-Free Rice Noodles'],
      addons: [
        { name: 'Extra King Oyster Mushrooms', price: 3.5 },
        { name: 'Crispy Yuba Tofu Skin', price: 2.75 },
        { name: 'House Chili Crisp Bomb', price: 1.5 },
        { name: 'Roasted Nori Sheets (4 pcs)', price: 1.75 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <ellipse cx="140" cy="78" rx="64" ry="22" fill="#3f6212" stroke="#34d399" stroke-width="2"/>
          <path d="M100 78 Q120 68 140 78 T180 78" fill="none" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="132" cy="72" rx="14" ry="7" fill="#a16207"/>
          <path d="M76 78 C80 122, 200 122, 204 78 Z" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
          <rect x="116" y="114" width="48" height="7" rx="3" fill="#27272a"/>
        </svg>
      `,
    },
    {
      id: 'crispy-pork-bao',
      category: 'plates',
      categoryLabel: 'Steamed Bao Buns',
      badge: 'Most Ordered',
      name: 'Glazed Pork Belly Bao (2 pcs)',
      price: 11.5,
      calories: '480 kcal',
      protein: '22g Protein',
      prepTime: '8 mins',
      spice: 'Mild',
      artClass: 'art-gold',
      summary:
        'Fluffy house-steamed milk buns stuffed with slow-braised soy-caramel pork belly, pickled mustard greens, crushed roasted peanuts, cilantro, and yuzu mayo.',
      optionLabel: 'Sauce Style',
      options: ['Classic Yuzu Mayo', 'Spicy Sriracha Crema', 'Sauce on the Side'],
      addons: [
        { name: 'Add 3rd Bao Bun', price: 5.5 },
        { name: 'Side of House Kimchi', price: 3.5 },
        { name: 'Extra Pickled Cucumbers', price: 2.0 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <rect x="52" y="96" width="176" height="14" rx="5" fill="#27272a" stroke="#52525b" stroke-width="1.5"/>
          <path d="M76 96 C76 58, 134 58, 134 96 Z" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <rect x="86" y="78" width="38" height="12" rx="4" fill="#9a3412"/>
          <path d="M146 96 C146 58, 204 58, 204 96 Z" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <rect x="156" y="78" width="38" height="12" rx="4" fill="#9a3412"/>
        </svg>
      `,
    },
    {
      id: 'karaage-chicken',
      category: 'plates',
      categoryLabel: 'Izakaya Small Plate',
      badge: 'Crispy & Gluten-Free',
      name: 'Crispy Ginger Chicken Karaage',
      price: 12.75,
      calories: '540 kcal',
      protein: '34g Protein',
      prepTime: '9 mins',
      spice: 'Mild',
      artClass: 'art-ember',
      summary:
        'Free-range chicken thigh marinated in grated ginger, sake, and tamari, double-fried in potato starch for a shatteringly crisp crust. Served with charred lemon and nori kewpie.',
      optionLabel: 'Dipping Sauce',
      options: ['Roasted Garlic Kewpie', 'Sweet Chili Ponzu', 'Both Sauces (+$1)'],
      addons: [
        { name: 'Side of Steamed Koshihikari Rice', price: 3.25 },
        { name: 'Side of Smashed Cucumber Salad', price: 4.5 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <ellipse cx="140" cy="96" rx="74" ry="20" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
          <circle cx="115" cy="84" r="18" fill="#d97706"/>
          <circle cx="144" cy="80" r="20" fill="#b45309"/>
          <circle cx="168" cy="86" r="16" fill="#d97706"/>
          <path d="M82 90 A14 14 0 0 0 104 98 Z" fill="#fde047"/>
        </svg>
      `,
    },
    {
      id: 'yuzu-matcha-fizz',
      category: 'drinks',
      categoryLabel: 'House Craft Beverage',
      badge: 'Fresh Pressed',
      name: 'Uji Matcha & Yuzu Tonic',
      price: 6.5,
      calories: '110 kcal',
      protein: '2g Protein',
      prepTime: '3 mins',
      spice: 'Refreshing',
      artClass: 'art-jade',
      summary:
        'Ceremonial-grade first-harvest Uji matcha whisked to order and layered over sparkling Kochi yuzu juice and organic cane syrup.',
      optionLabel: 'Sweetness & Ice',
      options: ['Regular Ice · Standard Sweet', 'Less Ice · Half Sweet', 'Unsweetened'],
      addons: [
        { name: 'Add Black Sesame Mochi Ice Cream', price: 4.5 },
        { name: 'Add Hojicha Basque Cheesecake Slice', price: 7.5 },
      ],
      svg: `
        <svg class="dish-svg" viewBox="0 0 280 150" aria-hidden="true">
          <rect x="114" y="34" width="52" height="88" rx="8" fill="#fef08a" fill-opacity="0.2" stroke="#34d399" stroke-width="2"/>
          <rect x="116" y="38" width="48" height="36" rx="4" fill="#059669" fill-opacity="0.75"/>
          <rect x="116" y="74" width="48" height="46" rx="4" fill="#eab308" fill-opacity="0.45"/>
          <line x1="148" y1="18" x2="132" y2="112" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `,
    },
  ];

  let activeCategory = 'all';
  let currentDish = null;
  let currentQty = 1;

  const cart = [
    {
      name: 'Black Garlic Tonkotsu Deluxe',
      option: 'Standard Firmness',
      addons: ['Extra 6-Min Ajitama Egg'],
      qty: 1,
      unitPrice: 21.0,
    },
    {
      name: 'Glazed Pork Belly Bao (2 pcs)',
      option: 'Classic Yuzu Mayo',
      addons: [],
      qty: 1,
      unitPrice: 11.5,
    },
  ];

  const menuGrid = document.getElementById('menuGrid');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const toastContainer = document.getElementById('toastContainer');

  const drawer = new window.CrossPlatformDrawer({
    dialogEl: document.getElementById('crossPlatformDrawer'),
  });

  function formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountBadge) {
      cartCountBadge.textContent = String(count);
    }
  }

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

  function renderMenuGrid() {
    if (!menuGrid) return;
    const visibleDishes =
      activeCategory === 'all'
        ? DISHES
        : DISHES.filter((d) => d.category === activeCategory);

    menuGrid.innerHTML = visibleDishes
      .map(
        (dish) => `
        <article
          class="product-card"
          data-drawer-trigger="dish"
          data-dish-id="${dish.id}"
          tabindex="0"
          role="button"
          aria-label="Customize ${dish.name}, ${formatMoney(dish.price)}"
        >
          <div class="product-card__visual ${dish.artClass}">
            <span class="product-badge">${dish.badge}</span>
            ${dish.svg}
          </div>
          <div class="product-card__body">
            <div class="product-card__meta">
              <span>${dish.categoryLabel}</span>
              <span class="price">${formatMoney(dish.price)}</span>
            </div>
            <h3>${dish.name}</h3>
            <p>${dish.summary}</p>
            <div class="product-card__footer">
              <span>${dish.calories} · ${dish.prepTime}</span>
              <span class="link-cta">Customize &amp; Add →</span>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  function calculateModalUnitPrice() {
    if (!currentDish) return 0;
    let extra = 0;
    document.querySelectorAll('#drawerBody [data-addon-price].is-selected').forEach((el) => {
      extra += parseFloat(el.getAttribute('data-addon-price')) || 0;
    });
    return currentDish.price + extra;
  }

  function syncModalPriceButton() {
    const btn = document.getElementById('confirmAddDishBtn');
    const qtyEl = document.getElementById('modalDishQty');
    if (qtyEl) qtyEl.textContent = String(currentQty);
    if (btn && currentDish) {
      const total = calculateModalUnitPrice() * currentQty;
      btn.textContent = `Add to Order — ${formatMoney(total)}`;
    }
  }

  function openDishDrawer(dishId, triggerEl) {
    const dish = DISHES.find((d) => d.id === dishId) || DISHES[0];
    currentDish = dish;
    currentQty = 1;

    const bodyHTML = `
      <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55;">
        ${dish.summary}
      </p>

      <div class="spec-grid">
        <div class="spec-box">
          <span>Energy</span>
          <strong>${dish.calories}</strong>
        </div>
        <div class="spec-box">
          <span>Protein</span>
          <strong>${dish.protein}</strong>
        </div>
        <div class="spec-box">
          <span>Spice Profile</span>
          <strong>${dish.spice}</strong>
        </div>
      </div>

      <h3 class="drawer-section-title">${dish.optionLabel}</h3>
      <div class="option-pills" role="radiogroup" aria-label="${dish.optionLabel}">
        ${dish.options
          .map(
            (opt, idx) => `
            <button
              type="button"
              class="option-pill ${idx === 0 ? 'is-selected' : ''}"
              data-option-pill
            >
              ${opt}
            </button>
          `
          )
          .join('')}
      </div>

      <h3 class="drawer-section-title">Extra Toppings &amp; Sides (Optional)</h3>
      <div class="addon-grid">
        ${dish.addons
          .map(
            (addon) => `
            <button
              type="button"
              class="addon-item"
              data-addon-item
              data-addon-name="${addon.name}"
              data-addon-price="${addon.price}"
            >
              <span>${addon.name}</span>
              <span class="addon-price">+${formatMoney(addon.price)}</span>
            </button>
          `
          )
          .join('')}
      </div>

      <div class="form-group" style="margin-top: 18px; margin-bottom: 0;">
        <label class="form-label" for="kitchenNoteInput">Kitchen or Allergy Notes</label>
        <input
          type="text"
          id="kitchenNoteInput"
          class="form-input"
          placeholder="e.g., no scallions, sesame allergy, extra napkins"
        />
      </div>
    `;

    const footerHTML = `
      <div class="qty-stepper" aria-label="Quantity">
        <button type="button" class="qty-btn" data-qty-delta="-1" aria-label="Decrease quantity">−</button>
        <span class="qty-val" id="modalDishQty">1</span>
        <button type="button" class="qty-btn" data-qty-delta="1" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="confirmAddDishBtn" style="flex: 1; padding: 11px 16px;">
        Add to Order — ${formatMoney(dish.price)}
      </button>
    `;

    drawer.open({
      category: dish.categoryLabel,
      title: dish.name,
      subtitle: `${formatMoney(dish.price)} · Ready in ${dish.prepTime}`,
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openCartDrawer(triggerEl) {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

    const listHTML =
      cart.length === 0
        ? `<p style="color: var(--text-secondary); padding: 12px 0;">Your order bag is empty. Select any bowl or small plate from the menu to get started.</p>`
        : `
          <div class="cart-list">
            ${cart
              .map(
                (item, index) => `
                <div class="cart-row">
                  <div>
                    <strong>${item.qty} × ${item.name}</strong>
                    <div class="cart-row__meta">
                      ${item.option}${item.addons.length ? ` · +${item.addons.join(', ')}` : ''}${item.note ? ` · "${item.note}"` : ''}
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <strong>${formatMoney(item.unitPrice * item.qty)}</strong>
                    <button type="button" class="link-btn" data-remove-cart="${index}" style="font-size: 0.78rem;">Remove</button>
                  </div>
                </div>
              `
              )
              .join('')}
            <div class="cart-summary-row">
              <span>Order Subtotal</span>
              <span style="color: #fdba74;">${formatMoney(subtotal)}</span>
            </div>
          </div>
        `;

    const bodyHTML = `
      ${listHTML}

      <form id="orderCheckoutForm">
        <div class="form-group">
          <label class="form-label">Fulfillment Method</label>
          <div class="option-pills">
            <button type="button" class="option-pill is-selected" data-option-pill>Express Counter Pickup (15 mins)</button>
            <button type="button" class="option-pill" data-option-pill>Local Bike Courier (30 mins)</button>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="guestOrderName">Name for Order</label>
          <input
            type="text"
            id="guestOrderName"
            class="form-input"
            placeholder="Enter your name"
            required
          />
        </div>
      </form>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" data-drawer-close>Keep Browsing</button>
      <button type="submit" form="orderCheckoutForm" class="btn btn-primary btn-sm" ${cart.length === 0 ? 'disabled' : ''}>
        Send Order to Kitchen (${formatMoney(subtotal)})
      </button>
    `;

    drawer.open({
      category: 'Express Takeout & Delivery',
      title: 'Your Kitchen Order',
      subtitle: 'Broth and noodles packed separately for freshness',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openReservationDrawer(triggerEl) {
    const bodyHTML = `
      <form id="tableReservationForm">
        <div class="form-group">
          <label class="form-label">Seating Area</label>
          <div class="option-pills">
            <button type="button" class="option-pill is-selected" data-option-pill>Chef's Noodle Counter</button>
            <button type="button" class="option-pill" data-option-pill>Main Dining Room Booth</button>
            <button type="button" class="option-pill" data-option-pill>Heated Courtyard Patio</button>
          </div>
        </div>

        <div class="spec-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="resPartySize">Party Size</label>
            <select id="resPartySize" class="form-select">
              <option value="2 Guests">2 Guests</option>
              <option value="1 Guest">1 Guest</option>
              <option value="3 Guests">3 Guests</option>
              <option value="4 Guests">4 Guests</option>
              <option value="6 Guests">6 Guests</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="resTimeSlot">Evening Seating</label>
            <select id="resTimeSlot" class="form-select">
              <option value="6:30 PM">6:30 PM</option>
              <option value="7:15 PM">7:15 PM</option>
              <option value="8:00 PM">8:00 PM</option>
              <option value="8:45 PM">8:45 PM</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top: 14px; margin-bottom: 0;">
          <label class="form-label" for="resGuestName">Guest Name &amp; Phone</label>
          <input
            type="text"
            id="resGuestName"
            class="form-input"
            placeholder="e.g., Alex Rivera · (555) 234-5678"
            required
          />
        </div>
      </form>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" data-drawer-close>Cancel</button>
      <button type="submit" form="tableReservationForm" class="btn btn-primary btn-sm">
        Confirm Table Reservation
      </button>
    `;

    drawer.open({
      category: 'Dine-In Reservations',
      title: 'Book a Table at Kurobi',
      subtitle: '742 Mercer Ave · Walk-ins also welcome at the bar',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openHoursDrawer(triggerEl) {
    const bodyHTML = `
      <div class="spec-grid">
        <div class="spec-box">
          <span>Address</span>
          <strong>742 Mercer Ave</strong>
        </div>
        <div class="spec-box">
          <span>Pickup Counter</span>
          <strong>15–20 Mins</strong>
        </div>
        <div class="spec-box">
          <span>Parking</span>
          <strong>Rear Lot Free</strong>
        </div>
      </div>

      <h3 class="drawer-section-title">Weekly Kitchen Hours</h3>
      <div class="cart-list">
        <div class="cart-row">
          <span>Monday – Thursday</span>
          <strong>11:30 AM – 10:00 PM</strong>
        </div>
        <div class="cart-row">
          <span>Friday – Saturday</span>
          <strong>11:30 AM – 11:30 PM</strong>
        </div>
        <div class="cart-row">
          <span>Sunday</span>
          <strong>12:00 PM – 9:30 PM</strong>
        </div>
      </div>

      <h3 class="drawer-section-title">Takeout Packaging Guarantee</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem;">
        All ramen takeout orders are packed in two-tier thermal containers keeping the simmering broth separate from the fresh alkaline noodles and crispy toppings until the moment you pour at home.
      </p>
    `;

    const footerHTML = `
      <button type="button" class="btn btn-primary btn-sm" data-drawer-close>Close</button>
    `;

    drawer.open({
      category: 'Location & Hours',
      title: 'Kurobi Kitchen — Mercer Ave',
      subtitle: 'Lunch, Dinner & Late-Night Ramen Bar',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab-btn[data-category]');
    if (tabBtn) {
      activeCategory = tabBtn.getAttribute('data-category') || 'all';
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('is-active'));
      tabBtn.classList.add('is-active');
      renderMenuGrid();
      return;
    }

    const trigger = e.target.closest('[data-drawer-trigger]');
    if (trigger) {
      const type = trigger.getAttribute('data-drawer-trigger');
      if (type === 'dish') {
        openDishDrawer(trigger.getAttribute('data-dish-id'), trigger);
      } else if (type === 'cart') {
        openCartDrawer(trigger);
      } else if (type === 'reservation') {
        openReservationDrawer(trigger);
      } else if (type === 'hours') {
        openHoursDrawer(trigger);
      }
      return;
    }

    const pill = e.target.closest('[data-option-pill]');
    if (pill) {
      const parent = pill.parentElement;
      if (parent) {
        parent.querySelectorAll('[data-option-pill]').forEach((el) => el.classList.remove('is-selected'));
      }
      pill.classList.add('is-selected');
      return;
    }

    const addon = e.target.closest('[data-addon-item]');
    if (addon) {
      addon.classList.toggle('is-selected');
      syncModalPriceButton();
      return;
    }

    const qtyBtn = e.target.closest('[data-qty-delta]');
    if (qtyBtn && currentDish) {
      const delta = parseInt(qtyBtn.getAttribute('data-qty-delta'), 10) || 0;
      currentQty = Math.max(1, Math.min(10, currentQty + delta));
      syncModalPriceButton();
      return;
    }

    if (e.target.closest('#confirmAddDishBtn') && currentDish) {
      const selectedOption =
        document.querySelector('#drawerBody [data-option-pill].is-selected')?.textContent.trim() ||
        currentDish.options[0];
      const selectedAddons = Array.from(
        document.querySelectorAll('#drawerBody [data-addon-item].is-selected')
      ).map((el) => el.getAttribute('data-addon-name'));
      const note = document.getElementById('kitchenNoteInput')?.value.trim() || '';

      cart.push({
        name: currentDish.name,
        option: selectedOption,
        addons: selectedAddons,
        note,
        qty: currentQty,
        unitPrice: calculateModalUnitPrice(),
      });

      updateCartBadge();
      drawer.close('dish-added');
      showToast(`Added ${currentQty} × ${currentDish.name} to your order.`);
      return;
    }

    const removeBtn = e.target.closest('[data-remove-cart]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.getAttribute('data-remove-cart'), 10);
      if (!Number.isNaN(idx) && cart[idx]) {
        cart.splice(idx, 1);
        updateCartBadge();
        openCartDrawer(document.getElementById('openOrderBtn'));
      }
      return;
    }

    if (e.target.closest('[data-drawer-close]')) {
      drawer.close('button-close');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('[data-drawer-trigger="dish"]');
      if (card && !card.matches('button')) {
        e.preventDefault();
        card.click();
      }
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'orderCheckoutForm') {
      e.preventDefault();
      const guest = document.getElementById('guestOrderName')?.value.trim() || 'Guest';
      cart.length = 0;
      updateCartBadge();
      drawer.close('order-placed');
      showToast(`Order sent to the kitchen for ${guest}! Ready in ~15 mins.`);
    } else if (e.target && e.target.id === 'tableReservationForm') {
      e.preventDefault();
      const guest = document.getElementById('resGuestName')?.value.trim() || 'Guest';
      const time = document.getElementById('resTimeSlot')?.value || '7:15 PM';
      drawer.close('reservation-confirmed');
      showToast(`Table confirmed for ${guest} at ${time}.`);
    }
  });

  renderMenuGrid();
  updateCartBadge();
})();
