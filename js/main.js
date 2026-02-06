/**
 * Роза — Main JavaScript
 * Общая интерактивность сайта
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initMobileMenu();
  initSearch();
  initAccordion();
  initProductGallery();
  initQuantitySelector();
  initSizeSelector();
  initColorSelector();
  initNewsletterForm();
  initSmoothScroll();
  initHeaderScroll();
});

/**
 * Mobile Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  
  if (!menuBtn || !mobileNav) return;
  
  // Toggle menu
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close button
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Submenu toggle
  const mobileNavItems = mobileNav.querySelectorAll('.mobile-nav__item');
  mobileNavItems.forEach(item => {
    const link = item.querySelector('.mobile-nav__link');
    const submenu = item.querySelector('.mobile-nav__submenu');
    
    if (link && submenu) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        item.classList.toggle('active');
      });
    }
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Search Overlay
 */
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = searchOverlay?.querySelector('.search-overlay__input');
  
  if (!searchBtn || !searchOverlay) return;
  
  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 300);
  });
  
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close on backdrop click
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Accordion
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all others (optional - remove for multi-open)
      // item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
      //   i.classList.remove('active');
      // });
      
      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/**
 * Product Gallery (on product page)
 */
function initProductGallery() {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.product__gallery-thumb');
  
  if (!mainImage || thumbs.length === 0) return;
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      const newSrc = thumb.dataset.image;
      if (newSrc) {
        mainImage.src = newSrc;
      }
      
      // Update active state
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/**
 * Quantity Selector
 */
function initQuantitySelector() {
  const selectors = document.querySelectorAll('.quantity-selector');
  
  selectors.forEach(selector => {
    const input = selector.querySelector('input');
    const decreaseBtn = selector.querySelector('button:first-child');
    const increaseBtn = selector.querySelector('button:last-child');
    
    if (!input) return;
    
    const min = parseInt(input.min) || 1;
    const max = parseInt(input.max) || 99;
    
    decreaseBtn?.addEventListener('click', () => {
      let value = parseInt(input.value) || 1;
      if (value > min) {
        input.value = value - 1;
        input.dispatchEvent(new Event('change'));
      }
    });
    
    increaseBtn?.addEventListener('click', () => {
      let value = parseInt(input.value) || 1;
      if (value < max) {
        input.value = value + 1;
        input.dispatchEvent(new Event('change'));
      }
    });
    
    input.addEventListener('change', () => {
      let value = parseInt(input.value) || min;
      value = Math.max(min, Math.min(max, value));
      input.value = value;
    });
  });
}

/**
 * Size Selector (on product page)
 */
function initSizeSelector() {
  const sizes = document.querySelectorAll('.product__size:not(.disabled)');
  
  sizes.forEach(size => {
    size.addEventListener('click', () => {
      sizes.forEach(s => s.classList.remove('active'));
      size.classList.add('active');
    });
  });
}

/**
 * Color Selector (on product page)
 */
function initColorSelector() {
  const colors = document.querySelectorAll('.product__color');
  
  colors.forEach(color => {
    color.addEventListener('click', () => {
      colors.forEach(c => c.classList.remove('active'));
      color.classList.add('active');
    });
  });
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button[type="submit"]');
      
      if (!input || !input.value) return;
      
      // Simulate submission
      const originalText = button.textContent;
      button.textContent = 'Отправка...';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = 'Готово!';
        input.value = '';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }, 1000);
    });
  });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Header scroll behavior
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  const scrollThreshold = 100;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 10) {
      header.style.boxShadow = 'var(--shadow-sm)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    // Hide/show on scroll (optional - uncomment to enable)
    // if (currentScroll > scrollThreshold) {
    //   if (currentScroll > lastScroll) {
    //     header.style.transform = 'translateY(-100%)';
    //   } else {
    //     header.style.transform = 'translateY(0)';
    //   }
    // }
    
    lastScroll = currentScroll;
  });
}

/**
 * Add to cart notification (used by cart.js)
 */
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification__close" aria-label="Закрыть">×</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? 'var(--color-green)' : 'var(--color-terracotta)'};
    color: white;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  // Add animation keyframes if not exists
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Close button
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.style.cssText = 'background: none; border: none; color: white; font-size: 20px; cursor: pointer;';
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto-hide
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// Export for use in other modules
window.showNotification = showNotification;
