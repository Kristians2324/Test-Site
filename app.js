(function () {
  const MENU_ITEMS = [
    {
      id: 'country-loaf',
      category: 'bread',
      categoryLabel: 'Naturally Leavened Loaf',
      name: 'Country Sourdough',
      price: 9.5,
      weight: '850g loaf',
      availability: 'Baked at 7:30 AM',
      description:
        'Our daily hearth loaf made with organic Washington bread flour, stone-ground Red Fife whole wheat, water, and sea salt. Dark caramelized crust with an open, custard-like crumb.',
      ingredients: 'Unbleached wheat flour, whole Red Fife wheat, water, sea salt.',
      optionTitle: 'Preparation',
      options: ['Whole Loaf (Unsliced)', 'Machine Sliced — Standard', 'Cut in Half'],
    },
    {
      id: 'seeded-rye',
      category: 'bread',
      categoryLabel: 'Naturally Leavened Loaf',
      name: 'Toasted Sesame & Spelt',
      price: 11.0,
      weight: '850g loaf',
      availability: 'Baked at 8:00 AM',
      description:
        'A hearty, aromatic porridge loaf folded with toasted white and black sesame seeds, flax, sunflower kernels, and 30% whole grain spelt flour.',
      ingredients: 'Wheat flour, whole spelt, toasted sesame, sunflower seeds, golden flax, water, sea salt.',
      optionTitle: 'Preparation',
      options: ['Whole Loaf (Unsliced)', 'Machine Sliced — Standard'],
    },
    {
      id: 'baguette',
      category: 'bread',
      categoryLabel: 'Hearth Bread',
      name: 'Tradition Baguette',
      price: 5.25,
      weight: '320g',
      availability: 'Baked at 7:00 AM & 11:30 AM',
      description:
        'Long-fermented French-style baguette mixed with a poolish pre-ferment and baked directly on stone for a crisp, shattered crust.',
      ingredients: 'Organic bread flour, water, sea salt, sourdough culture, yeast.',
      optionTitle: 'Warming Note',
      options: ['Room Temperature', 'Paper Bag Only (Crisp Crust)'],
    },
    {
      id: 'cardamom-bun',
      category: 'pastry',
      categoryLabel: 'Morning Viennoiserie',
      name: 'Cardamom Knot',
      price: 5.5,
      weight: 'Single pastry',
      availability: 'Morning bake',
      description:
        'Brioche dough laminated with cultured butter and freshly mortar-crushed green cardamom pods, twisted by hand and finished with pearl sugar and citrus syrup.',
      ingredients: 'Wheat flour, cultured butter, milk, eggs, cane sugar, green cardamom, sea salt.',
      optionTitle: 'Serving',
      options: ['As Is', 'Warmed at Pickup'],
    },
    {
      id: 'kouign-amann',
      category: 'pastry',
      categoryLabel: 'Morning Viennoiserie',
      name: 'Salted Kouign-Amann',
      price: 5.75,
      weight: 'Single pastry',
      availability: 'Morning bake',
      description:
        'Crisp, caramelized Breton pastry folded with flaky sea salt and organic cane sugar. Crisp brittle exterior with tender, buttery layers inside.',
      ingredients: 'Wheat flour, cultured butter, cane sugar, water, sea salt, yeast.',
      optionTitle: 'Serving',
      options: ['Room Temperature', 'Warmed at Pickup'],
    },
    {
      id: 'almond-croissant',
      category: 'pastry',
      categoryLabel: 'Morning Viennoiserie',
      name: 'Twice-Baked Almond Croissant',
      price: 6.25,
      weight: 'Single pastry',
      availability: 'Limited daily batch',
      description:
        'Croissant soaked in orange-blossom rum syrup, filled and topped with house-ground California almond frangipane and toasted sliced almonds.',
      ingredients: 'Wheat flour, butter, almonds, eggs, sugar, milk, dark rum, orange blossom water.',
      optionTitle: 'Serving',
      options: ['Room Temperature', 'Warmed at Pickup'],
    },
    {
      id: 'pour-over',
      category: 'coffee',
      categoryLabel: 'Filter Coffee',
      name: 'Single Origin Pour Over',
      price: 5.0,
      weight: '12 oz cup',
      availability: 'Brewed to order',
      description:
        'Currently pouring Worka Sakaro from Gedeb, Ethiopia. Washed process with clean notes of bergamot, white peach, and black tea.',
      ingredients: 'Roasted Arabica coffee, filtered water.',
      optionTitle: 'Temperature',
      options: ['Hot (12 oz)', 'Flash Chilled over Ice'],
    },
    {
      id: 'cortado',
      category: 'coffee',
      categoryLabel: 'Espresso Bar',
      name: 'Gibraltar / Cortado',
      price: 4.5,
      weight: '4.5 oz',
      availability: 'Made to order',
      description:
        'Equal parts double-shot seasonal espresso and lightly textured steamed milk.',
      ingredients: 'Espresso, choice of milk.',
      optionTitle: 'Milk Choice',
      options: ['Whole Jersey Milk', 'Oat Milk', 'Almond Milk'],
    },
    {
      id: 'whole-bean',
      category: 'coffee',
      categoryLabel: 'Whole Bean Retail Bag',
      name: 'Morrow House Blend (12 oz)',
      price: 18.5,
      weight: '340g bag',
      availability: 'Roasted Tuesdays',
      description:
        'A balanced, sweet daily coffee combining washed Colombian Huila and natural Brazilian lots. Milk chocolate, roasted hazelnut, and red apple.',
      ingredients: '100% specialty Arabica coffee.',
      optionTitle: 'Grind Setting',
      options: ['Whole Bean', 'Ground for Drip / Filter', 'Ground for French Press', 'Ground for Espresso'],
    },
  ];

  let currentCategory = 'all';
  let activeModalQuantity = 1;
  let activeModalItem = null;

  const orderBag = [
    {
      name: 'Country Sourdough',
      option: 'Whole Loaf (Unsliced)',
      qty: 1,
      price: 9.5,
    },
    {
      name: 'Cardamom Knot',
      option: 'As Is',
      qty: 1,
      price: 5.5,
    },
  ];

  const menuGrid = document.getElementById('menuGrid');
  const bagCountEl = document.getElementById('bagCount');
  const toastContainer = document.getElementById('toastContainer');

  const drawer = new window.CrossPlatformDrawer({
    dialogEl: document.getElementById('crossPlatformDrawer'),
  });

  function formatPrice(num) {
    return `$${num.toFixed(2)}`;
  }

  function updateBagBadge() {
    const totalCount = orderBag.reduce((sum, item) => sum + item.qty, 0);
    if (bagCountEl) {
      bagCountEl.textContent = String(totalCount);
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
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  function renderMenu() {
    if (!menuGrid) return;
    const items =
      currentCategory === 'all'
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.category === currentCategory);

    menuGrid.innerHTML = items
      .map(
        (item) => `
        <article
          class="menu-item"
          data-item-id="${item.id}"
          tabindex="0"
          role="button"
          aria-label="${item.name}, ${formatPrice(item.price)}"
        >
          <div>
            <div class="menu-item__top">
              <h2 class="menu-item__title">${item.name}</h2>
              <span class="menu-item__price">${formatPrice(item.price)}</span>
            </div>
            <p class="menu-item__desc">${item.description}</p>
          </div>
          <div class="menu-item__footer">
            <span>${item.weight} · ${item.availability}</span>
            <span class="menu-item__action">Select</span>
          </div>
        </article>
      `
      )
      .join('');
  }

  function openItemDrawer(itemId, triggerEl) {
    const item = MENU_ITEMS.find((entry) => entry.id === itemId);
    if (!item) return;

    activeModalItem = item;
    activeModalQuantity = 1;

    const bodyHTML = `
      <p class="drawer-desc">${item.description}</p>

      <div class="drawer-meta-row">
        <span>Weight: ${item.weight}</span>
        <span>Schedule: ${item.availability}</span>
      </div>

      <div class="field-group">
        <label class="field-label">${item.optionTitle}</label>
        <div class="choice-list" role="radiogroup" aria-label="${item.optionTitle}">
          ${item.options
            .map(
              (opt, idx) => `
              <button
                type="button"
                class="choice-btn ${idx === 0 ? 'is-selected' : ''}"
                data-choice-btn
                value="${opt}"
              >
                ${opt}
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="itemNoteInput">Special Instructions (Optional)</label>
        <input
          type="text"
          id="itemNoteInput"
          class="text-input"
          placeholder="e.g., extra paper bag, pickup after 1:00 PM"
        />
      </div>

      <p style="font-size: 0.78rem; color: var(--text-light); margin-top: 12px;">
        Ingredients: ${item.ingredients}
      </p>
    `;

    const footerHTML = `
      <div class="qty-control" aria-label="Quantity">
        <button type="button" class="qty-btn" data-qty-change="-1" aria-label="Decrease quantity">−</button>
        <span class="qty-value" id="modalQtyValue">1</span>
        <button type="button" class="qty-btn" data-qty-change="1" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="primary-action-btn" id="confirmAddItemBtn">
        Add to Order — ${formatPrice(item.price)}
      </button>
    `;

    drawer.open({
      title: item.name,
      subtitle: `${item.categoryLabel} · ${formatPrice(item.price)}`,
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openBagDrawer(triggerEl) {
    const subtotal = orderBag.reduce((sum, item) => sum + item.price * item.qty, 0);

    const itemsMarkup =
      orderBag.length === 0
        ? `<p class="drawer-desc">Your pickup order is currently empty.</p>`
        : `
          <div class="bag-list">
            ${orderBag
              .map(
                (item, index) => `
                <div class="bag-row">
                  <div>
                    <div><strong>${item.qty} × ${item.name}</strong></div>
                    <div class="bag-row__meta">${item.option}${item.note ? ` · "${item.note}"` : ''}</div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span>${formatPrice(item.price * item.qty)}</span>
                    <button type="button" class="text-btn" data-remove-bag-index="${index}" style="font-size: 0.78rem;">Remove</button>
                  </div>
                </div>
              `
              )
              .join('')}
            <div class="bag-total">
              <span>Total due at counter</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
          </div>
        `;

    const bodyHTML = `
      ${itemsMarkup}

      <form id="checkoutForm">
        <div class="field-group">
          <label class="field-label" for="pickupNameInput">Name for Pickup</label>
          <input
            type="text"
            id="pickupNameInput"
            class="text-input"
            placeholder="First and last name"
            required
          />
        </div>

        <div class="field-group">
          <label class="field-label" for="pickupWindowInput">Pickup Window</label>
          <div class="choice-list">
            <button type="button" class="choice-btn is-selected" data-choice-btn>8:30 AM – 10:30 AM</button>
            <button type="button" class="choice-btn" data-choice-btn>10:30 AM – 1:00 PM</button>
            <button type="button" class="choice-btn" data-choice-btn>1:00 PM – 3:30 PM</button>
          </div>
        </div>
      </form>
    `;

    const footerHTML = `
      <button type="button" class="secondary-btn" data-drawer-close>Continue Browsing</button>
      <button type="submit" form="checkoutForm" class="primary-action-btn" ${orderBag.length === 0 ? 'disabled' : ''}>
        Reserve for Counter Pickup
      </button>
    `;

    drawer.open({
      title: 'Your Pickup Order',
      subtitle: '412 Morrow Street · Pay at Counter',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  function openLocationDrawer(triggerEl) {
    const bodyHTML = `
      <p class="drawer-desc">
        We are located on the corner of Morrow Street and SE 5th Avenue, half a block north of the hardware annex.
      </p>

      <table class="info-table">
        <tbody>
          <tr>
            <td>Wednesday – Friday</td>
            <td>7:00 AM – 4:00 PM</td>
          </tr>
          <tr>
            <td>Saturday – Sunday</td>
            <td>7:30 AM – 3:00 PM</td>
          </tr>
          <tr>
            <td>Monday – Tuesday</td>
            <td>Closed (Grain Milling)</td>
          </tr>
        </tbody>
      </table>

      <div class="field-group">
        <span class="field-label">Oven Schedule</span>
        <p style="font-size: 0.87rem; color: var(--text-muted);">
          Morning pastries and baguettes are on the counter at 7:00 AM. Country and seeded sourdough loaves come out of the deck oven at 7:30 AM and 8:00 AM.
        </p>
      </div>

      <div class="field-group" style="margin-bottom: 0;">
        <span class="field-label">Parking &amp; Pickup</span>
        <p style="font-size: 0.87rem; color: var(--text-muted);">
          15-minute loading zones are available directly in front of the bakery entrance on Morrow Street. Pre-orders may be collected at the side window without waiting in the espresso line.
        </p>
      </div>
    `;

    const footerHTML = `
      <button type="button" class="primary-action-btn" data-drawer-close>Close</button>
    `;

    drawer.open({
      title: 'Hours & Pickup Information',
      subtitle: '412 Morrow Street, Portland',
      bodyHTML,
      footerHTML,
      triggerEl,
    });
  }

  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab-btn[data-category]');
    if (tabBtn) {
      currentCategory = tabBtn.getAttribute('data-category') || 'all';
      document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('is-active'));
      tabBtn.classList.add('is-active');
      renderMenu();
      return;
    }

    const menuCard = e.target.closest('.menu-item[data-item-id]');
    if (menuCard) {
      openItemDrawer(menuCard.getAttribute('data-item-id'), menuCard);
      return;
    }

    const trigger = e.target.closest('[data-drawer-trigger]');
    if (trigger) {
      const target = trigger.getAttribute('data-drawer-trigger');
      if (target === 'bag') {
        openBagDrawer(trigger);
      } else if (target === 'location') {
        openLocationDrawer(trigger);
      }
      return;
    }

    const choiceBtn = e.target.closest('[data-choice-btn]');
    if (choiceBtn) {
      const list = choiceBtn.parentElement;
      if (list) {
        list.querySelectorAll('[data-choice-btn]').forEach((el) => el.classList.remove('is-selected'));
      }
      choiceBtn.classList.add('is-selected');
      return;
    }

    const qtyBtn = e.target.closest('[data-qty-change]');
    if (qtyBtn && activeModalItem) {
      const delta = parseInt(qtyBtn.getAttribute('data-qty-change'), 10) || 0;
      activeModalQuantity = Math.max(1, Math.min(12, activeModalQuantity + delta));
      const qtyEl = document.getElementById('modalQtyValue');
      const addBtn = document.getElementById('confirmAddItemBtn');
      if (qtyEl) qtyEl.textContent = String(activeModalQuantity);
      if (addBtn) {
        addBtn.textContent = `Add to Order — ${formatPrice(activeModalItem.price * activeModalQuantity)}`;
      }
      return;
    }

    if (e.target.closest('#confirmAddItemBtn') && activeModalItem) {
      const selectedChoice =
        document.querySelector('#drawerBody .choice-btn.is-selected')?.textContent.trim() ||
        activeModalItem.options[0];
      const note = document.getElementById('itemNoteInput')?.value.trim() || '';

      orderBag.push({
        name: activeModalItem.name,
        option: selectedChoice,
        note,
        qty: activeModalQuantity,
        price: activeModalItem.price,
      });

      updateBagBadge();
      drawer.close('item-added');
      showToast(`Added ${activeModalQuantity} × ${activeModalItem.name} to your order.`);
      return;
    }

    const removeBtn = e.target.closest('[data-remove-bag-index]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.getAttribute('data-remove-bag-index'), 10);
      if (!Number.isNaN(idx) && orderBag[idx]) {
        orderBag.splice(idx, 1);
        updateBagBadge();
        openBagDrawer(document.getElementById('openBagBtn'));
      }
      return;
    }

    if (e.target.closest('[data-drawer-close]')) {
      drawer.close('button-close');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.menu-item[data-item-id]');
      if (card) {
        e.preventDefault();
        card.click();
      }
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'checkoutForm') {
      e.preventDefault();
      const name = document.getElementById('pickupNameInput')?.value.trim() || 'Guest';
      orderBag.length = 0;
      updateBagBadge();
      drawer.close('order-submitted');
      showToast(`Order reserved under ${name}. See you at the counter.`);
    }
  });

  renderMenu();
  updateBagBadge();
})();
