/**
 * Роза — Cart JavaScript
 * Логика корзины (localStorage)
 */

// Cart state
let cart = [];

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartUI();
  initCartButtons();
  initAddToCartButtons();
});

/**
 * Load cart from localStorage
 */
function loadCart() {
  try {
    const saved = localStorage.getItem('rosa_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    cart = [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
  try {
    localStorage.setItem('rosa_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Could not save cart to localStorage');
  }
}

/**
 * Add item to cart
 */
function addToCart(item) {
  // Check if item already exists
  const existingIndex = cart.findIndex(i => 
    i.id === item.id && 
    i.size === item.size && 
    i.color === item.color
  );
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity || 1;
  } else {
    cart.push({
      ...item,
      quantity: item.quantity || 1
    });
  }
  
  saveCart();
  updateCartUI();
  
  // Show notification
  if (window.showNotification) {
    window.showNotification('Товар добавлен в корзину');
  }
}

/**
 * Remove item from cart
 */
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  renderCartItems();
}

/**
 * Update item quantity
 */
function updateQuantity(index, quantity) {
  if (quantity < 1) {
    removeFromCart(index);
    return;
  }
  
  cart[index].quantity = quantity;
  saveCart();
  updateCartUI();
  updateCartSummary();
}

/**
 * Clear cart
 */
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
}

/**
 * Get cart total
 */
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Get cart count
 */
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Update cart UI elements (header count, etc.)
 */
function updateCartUI() {
  // Update header cart count
  const cartCountElements = document.querySelectorAll('.header__cart-count, #cartCount');
  const count = getCartCount();
  
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/**
 * Update cart summary on cart page
 */
function updateCartSummary() {
  const count = getCartCount();
  const total = getCartTotal();
  const freeShippingThreshold = 15000;
  
  // Update items count
  const countEl = document.querySelector('.cart__summary-row span:first-child');
  if (countEl && countEl.textContent.includes('Товары')) {
    countEl.textContent = `Товары (${count})`;
  }
  
  // Update total
  const totalEl = document.querySelector('.cart__summary-row--total span:last-child');
  if (totalEl) {
    totalEl.textContent = formatPrice(total);
  }
  
  // Update subtotal
  const subtotalEl = document.querySelector('.cart__summary-row:first-of-type span:last-child');
  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(total);
  }
  
  // Update shipping
  const shippingEl = document.querySelector('.cart__summary-row:nth-of-type(2) span:last-child');
  if (shippingEl) {
    if (total >= freeShippingThreshold) {
      shippingEl.textContent = 'Бесплатно';
      shippingEl.style.color = 'var(--color-green)';
    } else {
      shippingEl.textContent = '500 ₽';
      shippingEl.style.color = '';
    }
  }
}

/**
 * Render cart items on cart page
 */
function renderCartItems() {
  const cartWithItems = document.getElementById('cartWithItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsContainer = document.querySelector('.cart__items');
  
  if (!cartWithItems || !cartEmpty) return;
  
  if (cart.length === 0) {
    cartWithItems.style.display = 'none';
    cartEmpty.style.display = 'block';
    return;
  }
  
  cartWithItems.style.display = 'grid';
  cartEmpty.style.display = 'none';
  
  // For demo purposes, we're keeping the static HTML
  // In a real app, you would render cart items dynamically here
}

/**
 * Initialize cart page buttons
 */
function initCartButtons() {
  // Remove buttons
  const removeButtons = document.querySelectorAll('.cart-item__remove');
  removeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // For demo, just animate removal
      const cartItem = btn.closest('.cart-item');
      if (cartItem) {
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';
        cartItem.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          cartItem.remove();
          // Check if cart is empty
          const remaining = document.querySelectorAll('.cart-item');
          if (remaining.length === 0) {
            document.getElementById('cartWithItems').style.display = 'none';
            document.getElementById('cartEmpty').style.display = 'block';
          }
          updateCartSummary();
        }, 300);
      }
    });
  });
  
  // Quantity selectors in cart
  const cartQuantitySelectors = document.querySelectorAll('.cart-item .quantity-selector');
  cartQuantitySelectors.forEach(selector => {
    const input = selector.querySelector('input');
    if (!input) return;
    
    input.addEventListener('change', () => {
      updateCartSummary();
    });
  });
}

/**
 * Initialize "Add to Cart" buttons on product pages
 */
function initAddToCartButtons() {
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      // Get product info from page
      const title = document.querySelector('.product__title')?.textContent || 'Товар';
      const priceText = document.querySelector('.product__price')?.textContent || '0';
      const price = parseInt(priceText.replace(/\D/g, '')) || 0;
      const size = document.querySelector('.product__size.active')?.textContent || 'M';
      const color = document.querySelector('.product__color.active')?.title || 'Натуральный';
      const image = document.getElementById('mainImage')?.src || '';
      const quantity = parseInt(document.querySelector('.quantity-selector input')?.value) || 1;
      
      // Add to cart
      addToCart({
        id: Date.now(), // Simple ID for demo
        title,
        price,
        size,
        color,
        image,
        quantity
      });
      
      // Button feedback
      const originalText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Добавлено!
      `;
      addToCartBtn.style.backgroundColor = 'var(--color-green)';
      addToCartBtn.style.borderColor = 'var(--color-green)';
      
      setTimeout(() => {
        addToCartBtn.innerHTML = originalText;
        addToCartBtn.style.backgroundColor = '';
        addToCartBtn.style.borderColor = '';
      }, 2000);
    });
  }
}

/**
 * Format price in rubles
 */
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Export functions for external use
window.cart = {
  add: addToCart,
  remove: removeFromCart,
  updateQuantity,
  clear: clearCart,
  getTotal: getCartTotal,
  getCount: getCartCount,
  getItems: () => [...cart]
};
