// ========================================
// GLOBAL STATE & CONFIGURATION
// ========================================
const APP_STATE = {
    currentUser: null,
    cart: [],
    wishlist: [],
    products: [],
    categories: [],
    orders: []
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Generate unique ID
    generateId: () => 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),

    // Format price
    formatPrice: (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Generate stars rating HTML
    generateStars: (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '⭐';
        if (halfStar) stars += '⭐';
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        
        return stars;
    },

    // Show alert
    showAlert: (message, type = 'info') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} fade-in`;
        alertDiv.innerHTML = `
            <span>${type === 'success' ? '✓' : type === 'danger' ? '✗' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    },

    // Local Storage helpers
    saveToStorage: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    loadFromStorage: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Hash password (simple - in production use proper hashing)
    hashPassword: (password) => {
        return btoa(password); // Base64 encoding (NOT secure for production!)
    }
};

// ========================================
// API SERVICE
// ========================================
const API = {
    // Get all products with optional filters
    getProducts: async (filters = {}) => {
        try {
            let url = 'tables/products?limit=100';
            if (filters.category) {
                url += `&search=${filters.category}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // Get single product
    getProduct: async (id) => {
        try {
            const response = await fetch(`tables/products/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await fetch('tables/categories?limit=100');
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Create product
    createProduct: async (productData) => {
        try {
            const response = await fetch('tables/products', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(productData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating product:', error);
            return null;
        }
    },

    // Update product
    updateProduct: async (id, productData) => {
        try {
            const response = await fetch(`tables/products/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(productData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            return null;
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            await fetch(`tables/products/${id}`, {
                method: 'DELETE'
            });
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },

    // Create order
    createOrder: async (orderData) => {
        try {
            const response = await fetch('tables/orders', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(orderData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },

    // Get user orders
    getUserOrders: async (userId) => {
        try {
            const response = await fetch(`tables/orders?search=${userId}&limit=100`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    // Create user
    createUser: async (userData) => {
        try {
            const response = await fetch('tables/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    },

    // Get all users (for login check)
    getUsers: async () => {
        try {
            const response = await fetch('tables/users?limit=100');
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
};

// ========================================
// AUTHENTICATION
// ========================================
const Auth = {
    // Initialize auth
    init: () => {
        const user = Utils.loadFromStorage('currentUser');
        if (user) {
            APP_STATE.currentUser = user;
            Auth.updateUI();
        }
    },

    // Login
    login: async (email, password) => {
        const users = await API.getUsers();
        const user = users.find(u => u.email === email && u.password === Utils.hashPassword(password));
        
        if (user) {
            APP_STATE.currentUser = user;
            Utils.saveToStorage('currentUser', user);
            Auth.updateUI();
            return true;
        }
        return false;
    },

    // Register
    register: async (userData) => {
        const users = await API.getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }

        const newUser = await API.createUser({
            ...userData,
            password: Utils.hashPassword(userData.password),
            is_admin: false
        });

        if (newUser) {
            APP_STATE.currentUser = newUser;
            Utils.saveToStorage('currentUser', newUser);
            Auth.updateUI();
            return { success: true };
        }

        return { success: false, message: 'Erreur lors de la création du compte' };
    },

    // Logout
    logout: () => {
        APP_STATE.currentUser = null;
        localStorage.removeItem('currentUser');
        Auth.updateUI();
        window.location.href = 'index.html';
    },

    // Update UI based on auth state
    updateUI: () => {
        const authLinks = document.querySelectorAll('.auth-link');
        const userLinks = document.querySelectorAll('.user-link');
        const adminLinks = document.querySelectorAll('.admin-link');

        if (APP_STATE.currentUser) {
            authLinks.forEach(link => link.style.display = 'none');
            userLinks.forEach(link => link.style.display = 'block');
            
            if (APP_STATE.currentUser.is_admin) {
                adminLinks.forEach(link => link.style.display = 'block');
            } else {
                adminLinks.forEach(link => link.style.display = 'none');
            }
        } else {
            authLinks.forEach(link => link.style.display = 'block');
            userLinks.forEach(link => link.style.display = 'none');
            adminLinks.forEach(link => link.style.display = 'none');
        }
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return APP_STATE.currentUser !== null;
    },

    // Check if user is admin
    isAdmin: () => {
        return APP_STATE.currentUser && APP_STATE.currentUser.is_admin;
    }
};

// ========================================
// CART MANAGEMENT
// ========================================
const Cart = {
    // Initialize cart
    init: () => {
        const cart = Utils.loadFromStorage('cart');
        if (cart) {
            APP_STATE.cart = cart;
        }
        Cart.updateBadge();
    },

    // Add to cart
    add: (product, quantity = 1) => {
        const existingItem = APP_STATE.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            APP_STATE.cart.push({
                ...product,
                quantity
            });
        }
        
        Cart.save();
        Cart.updateBadge();
        Utils.showAlert('Produit ajouté au panier', 'success');
    },

    // Remove from cart
    remove: (productId) => {
        APP_STATE.cart = APP_STATE.cart.filter(item => item.id !== productId);
        Cart.save();
        Cart.updateBadge();
    },

    // Update quantity
    updateQuantity: (productId, quantity) => {
        const item = APP_STATE.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                Cart.remove(productId);
            } else {
                Cart.save();
            }
        }
    },

    // Get cart total
    getTotal: () => {
        return APP_STATE.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    // Get cart count
    getCount: () => {
        return APP_STATE.cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Clear cart
    clear: () => {
        APP_STATE.cart = [];
        Cart.save();
        Cart.updateBadge();
    },

    // Save to storage
    save: () => {
        Utils.saveToStorage('cart', APP_STATE.cart);
    },

    // Update badge
    updateBadge: () => {
        const badge = document.querySelector('#cart-badge');
        if (badge) {
            const count = Cart.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }
};

// ========================================
// WISHLIST MANAGEMENT
// ========================================
const Wishlist = {
    // Initialize wishlist
    init: () => {
        const wishlist = Utils.loadFromStorage('wishlist');
        if (wishlist) {
            APP_STATE.wishlist = wishlist;
        }
        Wishlist.updateBadge();
    },

    // Toggle wishlist
    toggle: (product) => {
        const index = APP_STATE.wishlist.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            APP_STATE.wishlist.splice(index, 1);
            Utils.showAlert('Retiré des favoris', 'info');
        } else {
            APP_STATE.wishlist.push(product);
            Utils.showAlert('Ajouté aux favoris', 'success');
        }
        
        Wishlist.save();
        Wishlist.updateBadge();
        return index === -1; // Return true if added
    },

    // Check if in wishlist
    isInWishlist: (productId) => {
        return APP_STATE.wishlist.some(item => item.id === productId);
    },

    // Save to storage
    save: () => {
        Utils.saveToStorage('wishlist', APP_STATE.wishlist);
    },

    // Update badge
    updateBadge: () => {
        const badge = document.querySelector('#wishlist-badge');
        if (badge) {
            const count = APP_STATE.wishlist.length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }
};

// ========================================
// UI COMPONENTS
// ========================================
const UI = {
    // Create product card
    createProductCard: (product) => {
        const isWishlisted = Wishlist.isInWishlist(product.id);
        
        return `
            <div class="product-card fade-in">
                ${product.featured ? '<div class="product-badge">Vedette</div>' : ''}
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="Wishlist.toggle(${JSON.stringify(product).replace(/"/g, '&quot;')}); location.reload();">
                    ♥
                </button>
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Non+Disponible'">
                </a>
                <div class="product-card-content">
                    <div class="product-category">${product.category}</div>
                    <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-rating">
                        <span class="stars">${Utils.generateStars(product.rating || 0)}</span>
                        <span class="rating-count">(${product.reviews_count || 0})</span>
                    </div>
                    <div class="product-price">${Utils.formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')}); Cart.updateBadge();">
                            🛒 Ajouter
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-outline">Détails</a>
                    </div>
                </div>
            </div>
        `;
    },

    // Create category card
    createCategoryCard: (category) => {
        return `
            <a href="products.html?category=${category.id}" class="category-card">
                <img src="${category.image}" alt="${category.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${category.name}'">
                <div class="category-card-content">
                    <div class="icon">${category.icon}</div>
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
            </a>
        `;
    },

    // Create cart item
    createCartItem: (item) => {
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1}); location.reload();">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1}); location.reload();">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">${Utils.formatPrice(item.price * item.quantity)}</div>
                    <button class="btn btn-danger" onclick="Cart.remove('${item.id}'); location.reload();">Retirer</button>
                </div>
            </div>
        `;
    }
};

// ========================================
// SLIDER
// ========================================
const Slider = {
    currentSlide: 0,
    slides: [],
    interval: null,

    init: (slides) => {
        Slider.slides = slides;
        if (Slider.slides.length > 0) {
            Slider.show(0);
            Slider.autoPlay();
        }
    },

    show: (index) => {
        const slideElements = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');

        slideElements.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (slideElements[index]) {
            slideElements[index].classList.add('active');
            dots[index].classList.add('active');
        }

        Slider.currentSlide = index;
    },

    next: () => {
        const nextIndex = (Slider.currentSlide + 1) % Slider.slides.length;
        Slider.show(nextIndex);
    },

    prev: () => {
        const prevIndex = (Slider.currentSlide - 1 + Slider.slides.length) % Slider.slides.length;
        Slider.show(prevIndex);
    },

    goTo: (index) => {
        Slider.show(index);
        Slider.resetAutoPlay();
    },

    autoPlay: () => {
        Slider.interval = setInterval(Slider.next, 5000);
    },

    resetAutoPlay: () => {
        clearInterval(Slider.interval);
        Slider.autoPlay();
    }
};

// ========================================
// MOBILE MENU
// ========================================
const MobileMenu = {
    toggle: () => {
        const nav = document.querySelector('.nav-main');
        if (nav) {
            nav.classList.toggle('mobile-active');
        }
    }
};

// ========================================
// INITIALIZE APP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth, cart, and wishlist
    Auth.init();
    Cart.init();
    Wishlist.init();

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', MobileMenu.toggle);
    }

    // Logout button
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
});

// ========================================
// EXPORT FOR USE IN HTML
// ========================================
window.APP_STATE = APP_STATE;
window.Utils = Utils;
window.API = API;
window.Auth = Auth;
window.Cart = Cart;
window.Wishlist = Wishlist;
window.UI = UI;
window.Slider = Slider;
window.MobileMenu = MobileMenu;
