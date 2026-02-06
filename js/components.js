/**
 * Роза — Components JavaScript
 * Дополнительные интерактивные компоненты
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFilterColors();
  initFilterToggle();
  initContactForm();
  initLazyLoading();
});

/**
 * Tabs Component
 */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs');
  
  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-button');
    const panels = container.parentElement.querySelectorAll('.tab-panel');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.tab;
        
        // Update buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update panels
        panels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id === targetId) {
            panel.classList.add('active');
          }
        });
      });
    });
  });
}

/**
 * Filter Color Swatches
 */
function initFilterColors() {
  const filterColors = document.querySelectorAll('.filter-color');
  
  filterColors.forEach(color => {
    color.addEventListener('click', () => {
      color.classList.toggle('active');
    });
  });
}

/**
 * Mobile Filter Toggle
 */
function initFilterToggle() {
  const filterToggle = document.querySelector('.catalog__filter-toggle');
  const sidebar = document.querySelector('.catalog__sidebar');
  
  if (!filterToggle || !sidebar) return;
  
  // Create mobile filter overlay
  const mobileFilter = document.createElement('div');
  mobileFilter.className = 'mobile-filter';
  mobileFilter.innerHTML = `
    <div class="mobile-filter__backdrop"></div>
    <div class="mobile-filter__content">
      <div class="mobile-filter__header">
        <h3>Фильтры</h3>
        <button class="mobile-filter__close" aria-label="Закрыть">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="mobile-filter__body"></div>
      <div class="mobile-filter__footer">
        <button class="btn btn-secondary mobile-filter__reset">Сбросить</button>
        <button class="btn btn-primary mobile-filter__apply">Применить</button>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .mobile-filter {
      position: fixed;
      inset: 0;
      z-index: 1000;
      visibility: hidden;
    }
    .mobile-filter.active {
      visibility: visible;
    }
    .mobile-filter__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .mobile-filter.active .mobile-filter__backdrop {
      opacity: 1;
    }
    .mobile-filter__content {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 400px;
      background: white;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .mobile-filter.active .mobile-filter__content {
      transform: translateX(0);
    }
    .mobile-filter__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-5) var(--space-6);
      border-bottom: 1px solid var(--color-border);
    }
    .mobile-filter__header h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
    }
    .mobile-filter__close {
      background: none;
      border: none;
      cursor: pointer;
    }
    .mobile-filter__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6);
    }
    .mobile-filter__footer {
      padding: var(--space-5) var(--space-6);
      border-top: 1px solid var(--color-border);
      display: flex;
      gap: var(--space-3);
    }
    .mobile-filter__footer .btn {
      flex: 1;
    }
    @media (min-width: 1024px) {
      .mobile-filter {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(mobileFilter);
  
  // Clone sidebar content to mobile filter
  const mobileFilterBody = mobileFilter.querySelector('.mobile-filter__body');
  mobileFilterBody.innerHTML = sidebar.innerHTML;
  
  // Event listeners
  filterToggle.addEventListener('click', () => {
    mobileFilter.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  const closeFilter = () => {
    mobileFilter.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  mobileFilter.querySelector('.mobile-filter__close').addEventListener('click', closeFilter);
  mobileFilter.querySelector('.mobile-filter__backdrop').addEventListener('click', closeFilter);
  mobileFilter.querySelector('.mobile-filter__apply').addEventListener('click', closeFilter);
  mobileFilter.querySelector('.mobile-filter__reset').addEventListener('click', () => {
    // Reset all checkboxes
    mobileFilterBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    // Reset color selections
    mobileFilterBody.querySelectorAll('.filter-color').forEach(color => {
      color.classList.remove('active');
    });
  });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'var(--color-error)';
      } else {
        field.style.borderColor = '';
      }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = 'var(--color-error)';
      }
    }
    
    if (!isValid) {
      if (window.showNotification) {
        window.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
      }
      return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Success
      if (window.showNotification) {
        window.showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      }
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
  
  // Clear error state on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
  // Check for native lazy loading support
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
    return;
  }
  
  // Fallback for browsers without native support
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

/**
 * Product Card Wishlist Toggle
 */
document.addEventListener('click', (e) => {
  const wishlistBtn = e.target.closest('.product-card__wishlist');
  if (!wishlistBtn) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const svg = wishlistBtn.querySelector('svg');
  const isActive = wishlistBtn.classList.toggle('active');
  
  if (isActive) {
    svg.setAttribute('fill', 'var(--color-terracotta)');
    svg.setAttribute('stroke', 'var(--color-terracotta)');
    if (window.showNotification) {
      window.showNotification('Добавлено в избранное');
    }
  } else {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
  }
});

/**
 * Animate elements on scroll
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    animatedElements.forEach(el => observer.observe(el));
  }
}
