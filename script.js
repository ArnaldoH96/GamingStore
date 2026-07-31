/* ==========================================================================
   CENTRALIZED PRODUCT DATA STORE (12 Required Items Across Categories)
   ========================================================================== */
const PRODUCTS = [
    {
        id: 1,
        name: "Alpha Pro Console X",
        price: 449.99,
        category: "consoles",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80",
        description: "Unprecedented 8K performance, ultra-fast 1TB NVMe Solid State Drive, and structural adaptive dynamic cooling."
    },
    {
        id: 2,
        name: "Fusion Pro Wireless Controller",
        price: 129.99,
        category: "controllers",
        image: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=400&q=80",
        description: "Interchangeable paddles, drift-resistant Hall Effect analog sticks, and customizable trigger locks."
    },
    {
        id: 3,
        name: "Apex ANC Surround Headset",
        price: 179.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
        description: "Active spatial surround, structural isolation microphone, and lightweight memory foam cushions."
    },
    {
        id: 4,
        name: "Nexus Mechanical Keyboard",
        price: 149.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80",
        description: "Linear optical switches, doubleshot PBT keycaps, and localized dynamic per-key RGB programming."
    },
    {
        id: 5,
        name: "Viper Pro Optical Mouse",
        price: 89.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80",
        description: "Ultra-lightweight 58g body, true 26,000 DPI sensor, and customizable optical mouse switch clicks."
    },
    {
        id: 6,
        name: "Alpha Portable Mini Console",
        price: 199.99,
        category: "consoles",
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=400&q=80",
        description: "Retro compilation hardware loaded with classics, 7-inch AMOLED high definition touch screen panel."
    },
    {
        id: 7,
        name: "Retro-Chic Wireless Pad",
        price: 49.99,
        category: "controllers",
        image: "https://images.unsplash.com/photo-1580234810907-b40315b76418?auto=format&fit=crop&w=400&q=80",
        description: "Sleek historic physical styling meet modern Bluetooth latency reduction technologies."
    },
    {
        id: 8,
        name: "Eclipse Multi-Platform Mic",
        price: 119.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
        description: "Studio-grade cardioid recording condenser microphone, dynamic internal pop filtering."
    },
    {
        id: 9,
        name: "Elite Heavy Duty Steering Wheel",
        price: 299.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
        description: "Dual-motor force feedback, realistic genuine steel gear shifts, and sequential premium pedals."
    },
    {
        id: 10,
        name: "Alpha Virtual Reality Headset",
        price: 399.99,
        category: "consoles",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
        description: "Wide-angle dual 4K lenses, independent sensor tracking, and ultra haptic controllers."
    },
    {
        id: 11,
        name: "RGB Elite Controller Base",
        price: 39.99,
        category: "controllers",
        image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=400&q=80",
        description: "Magnetic contact charging plate, safe surge protection, and ambient aesthetic floor lights."
    },
    {
        id: 12,
        name: "Sonic Streamer Soundbar",
        price: 159.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80",
        description: "Sub-woofer integration, spatial directional drivers, and low profile screen mount alignment."
    }
];

// Initialize Shopping Cart State
let cart = JSON.parse(localStorage.getItem('alpha_cart')) || [];

/* ==========================================================================
   DOCUMENT READY CONTROLLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateCartCount();

    // Context-Based Route Engine
    if (document.getElementById('featured-grid')) {
        renderFeatured();
    }
    if (document.getElementById('catalog-grid')) {
        renderCatalog('all');
        initFilters();
        // Apply filter from URL query param if present
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat) {
            renderCatalog(cat);
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === cat);
            });
        }
    }
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
        initCheckoutValidation();
    }
    if (document.getElementById('contact-form')) {
        initContactValidation();
    }

    // Modal Close Triggers
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToastNotification('Thanks for subscribing!');
            newsletterForm.reset();
        });
    }
});

/* ==========================================================================
   CORE UTILITY FUNCTIONS & RENDER ENGINES
   ========================================================================== */

// Responsive Navigation Toggle
function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('active');
        });
    }
}

// Update Cart Navigation Indicator
function updateCartCount() {
    const indicators = document.querySelectorAll('#cart-count');
    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    indicators.forEach(ind => ind.textContent = totalQty);
}

// Render Home Page Featured Items (First 3)
function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    grid.innerHTML = '';
    PRODUCTS.slice(0, 3).forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// Render Catalog Items with Category Support
function renderCatalog(filter) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

    filtered.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// Create Card Fragment
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" data-id="${product.id}">${product.name}</h3>
            <div class="product-price">&pound;${product.price.toFixed(2)}</div>
            <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;

    // Direct Event Handlers
    card.querySelector('.product-title').addEventListener('click', () => showProductModal(product.id));
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.id));
    return card;
}

// Initialize Catalog Filter Buttons
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCatalog(e.target.dataset.filter);
        });
    });
}

/* ==========================================================================
   CART OPERATIONS & LOCALSTORAGE WRAPPERS
   ========================================================================== */
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    syncCart();
    showToastNotification(`${product.name} added to cart!`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }

    syncCart();
    renderCartPage();
}

function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    syncCart();
    renderCartPage();
}

function syncCart() {
    localStorage.setItem('alpha_cart', JSON.stringify(cart));
    updateCartCount();
}

// Generate Simple Toast Feedback
function showToastNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--accent);
        color: #121214;
        padding: 12px 24px;
        border-radius: var(--radius);
        font-weight: 700;
        z-index: 3000;
        box-shadow: var(--shadow);
        font-family: var(--font);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

/* ==========================================================================
   SHOPPING CART VIEW RENDERER
   ========================================================================== */
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('cart-empty-message');
    const summaryCard = document.getElementById('cart-summary-card');

    if (!container) return;

    if (cart.length === 0) {
        container.style.display = 'none';
        summaryCard.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.style.display = 'block';
    summaryCard.style.display = 'block';
    container.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">&pound;${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="qty-control">
                    <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;

        row.querySelector('.dec-qty').addEventListener('click', () => updateQuantity(item.id, -1));
        row.querySelector('.inc-qty').addEventListener('click', () => updateQuantity(item.id, 1));
        row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));

        container.appendChild(row);
    });

    document.getElementById('cart-subtotal').textContent = `\u00a3${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `\u00a3${subtotal.toFixed(2)}`;
}

/* ==========================================================================
   SINGLE PRODUCT DETAIL (MODAL INJECTION VIEW)
   ========================================================================== */
function showProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    const body = modal.querySelector('.modal-body');

    body.innerHTML = `
        <div class="modal-grid">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h2 style="font-size:1.8rem; margin-bottom:10px;">${product.name}</h2>
                <span class="product-category" style="display:block; margin-bottom:15px;">${product.category}</span>
                <p style="color:var(--muted-text); margin-bottom:20px;">${product.description}</p>
                <div style="font-size:1.6rem; font-weight:800; color:var(--accent); margin-bottom:20px;">&pound;${product.price.toFixed(2)}</div>
                <button class="btn btn-primary modal-buy-btn" style="width:100%;">Add to Cart</button>
            </div>
        </div>
    `;

    body.querySelector('.modal-buy-btn').addEventListener('click', () => {
        addToCart(product.id);
        modal.classList.remove('active');
    });

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

/* ==========================================================================
   CLIENT FORM ACCESSIBLE VALIDATION ENGINES
   ========================================================================== */

function initCheckoutValidation() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('checkout-name');
        const email = document.getElementById('checkout-email');
        const address = document.getElementById('checkout-address');

        if (name.value.trim().length < 3) {
            showError('name-error', 'Name must contain at least 3 characters.');
            valid = false;
        } else {
            clearError('name-error');
        }

        if (!validateEmail(email.value)) {
            showError('email-error', 'Please submit a valid email address.');
            valid = false;
        } else {
            clearError('email-error');
        }

        if (address.value.trim().length < 5) {
            showError('address-error', 'Please specify a complete delivery address.');
            valid = false;
        } else {
            clearError('address-error');
        }

        if (valid) {
            alert('Your order was placed successfully! Thank you for shopping with Alpha Gear.');
            cart = [];
            syncCart();
            renderCartPage();
        }
    });
}

function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const subject = document.getElementById('contact-subject');
        const message = document.getElementById('contact-message');

        if (name.value.trim().length < 2) {
            showError('contact-name-error', 'Please enter your full name.');
            valid = false;
        } else {
            clearError('contact-name-error');
        }

        if (!validateEmail(email.value)) {
            showError('contact-email-error', 'Please enter a valid email.');
            valid = false;
        } else {
            clearError('contact-email-error');
        }

        if (subject.value.trim().length < 3) {
            showError('contact-subject-error', 'Please provide a descriptive subject.');
            valid = false;
        } else {
            clearError('contact-subject-error');
        }

        if (message.value.trim().length < 10) {
            showError('contact-message-error', 'Your message must be at least 10 characters long.');
            valid = false;
        } else {
            clearError('contact-message-error');
        }

        if (valid) {
            form.style.display = 'none';
            document.getElementById('contact-success').style.display = 'block';
        }
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, message) {
    const element = document.getElementById(id);
    if (element) element.textContent = message;
}

function clearError(id) {
    const element = document.getElementById(id);
    if (element) element.textContent = '';
}
