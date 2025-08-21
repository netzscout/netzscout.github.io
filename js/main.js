// ==========================================================================
// Moderne JavaScript ES6+ Implementation
// ==========================================================================

// Import-ähnliche Struktur für Modularität
class ModernWebsite {
  constructor() {
    this.init();
  }

  async init() {
    await this.waitForDOM();
    this.initComponents();
    this.bindEvents();
    this.initAnimations();
    this.initPortfolio();
    this.initPerformanceObserver();
  }

  // Utility: Warten auf DOM
  waitForDOM() {
    return new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  // Komponenten initialisieren
  initComponents() {
    this.header = new HeaderComponent();
    this.navigation = new NavigationComponent();
    this.animations = new AnimationController();
    this.portfolio = new PortfolioManager();
    this.stats = new StatsCounter();
  }

  // Event Listeners binden
  bindEvents() {
    // Smooth Scrolling mit moderner API
    this.initSmoothScrolling();
    
    // Resize Handler mit Debouncing
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard Navigation
    this.initKeyboardNavigation();
  }

  // Moderne Smooth Scrolling Implementation
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', async (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          await this.smoothScrollTo(target);
          // Focus für Accessibility
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Async Smooth Scroll mit Web API
  async smoothScrollTo(element) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;

    return new Promise(resolve => {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Callback nach Scroll-Ende
      setTimeout(resolve, 500);
    });
  }

  // Debounce Utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Resize Handler mit Mobile-First Optimierung
  handleResize() {
    this.navigation.handleResize();
    this.animations.recalculate();
    this.optimizeForViewport();
  }

  // Viewport-spezifische Optimierungen
  optimizeForViewport() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      // Mobile Optimierungen
      this.enableMobileOptimizations();
    } else if (isTablet) {
      // Tablet Optimierungen
      this.enableTabletOptimizations();
    } else {
      // Desktop Optimierungen
      this.enableDesktopOptimizations();
    }
  }

  enableMobileOptimizations() {
    // Reduzierte Animationen für bessere Performance
    document.body.classList.add('mobile-optimized');
    
    // Touch-Events optimieren
    this.optimizeTouchEvents();
  }

  enableTabletOptimizations() {
    document.body.classList.add('tablet-optimized');
  }

  enableDesktopOptimizations() {
    document.body.classList.add('desktop-optimized');
  }

  optimizeTouchEvents() {
    // Passive Event Listeners für bessere Scroll-Performance
    const touchElements = document.querySelectorAll('.skill-card, .portfolio-item, .cta-button');
    touchElements.forEach(element => {
      element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    });
  }

  handleTouchStart(e) {
    e.target.classList.add('touch-active');
  }

  handleTouchEnd(e) {
    setTimeout(() => {
      e.target.classList.remove('touch-active');
    }, 150);
  }

  // Keyboard Navigation
  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC schließt Mobile Menu
      if (e.key === 'Escape') {
        this.navigation.closeMobileMenu();
      }
      
      // Skip Link Funktionalität
      if (e.key === 'Tab' && !e.shiftKey) {
        this.handleTabNavigation(e);
      }
    });
  }

  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  }

  // Animations initialisieren
  initAnimations() {
    this.animations.initIntersectionObserver();
    this.animations.initParallaxEffects();
  }

  // Portfolio initialisieren
  initPortfolio() {
    this.portfolio.loadItems();
    this.portfolio.initFilters();
  }

  // Performance Observer
  initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
        }
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }
  }
}

// ==========================================================================
// Header Component
// ==========================================================================

class HeaderComponent {
  constructor() {
    this.header = document.querySelector('header');
    this.initScrollEffect();
  }

  initScrollEffect() {
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }
}

// ==========================================================================
// Navigation Component
// ==========================================================================

class NavigationComponent {
  constructor() {
    this.mobileButton = document.querySelector('.mobile-menu-button');
    this.navLinks = document.querySelector('.nav-links');
    this.isOpen = false;
    
    this.initMobileMenu();
  }

  initMobileMenu() {
    if (this.mobileButton) {
      this.mobileButton.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Klick außerhalb schließt Menu
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('nav')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
    this.updateMobileMenu();
  }

  closeMobileMenu() {
    if (this.isOpen) {
      this.isOpen = false;
      this.updateMobileMenu();
    }
  }

  updateMobileMenu() {
    this.mobileButton.setAttribute('aria-expanded', this.isOpen.toString());
    this.navLinks.classList.toggle('open', this.isOpen);
    
    // Body scroll lock mit Touch-Optimierung
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      this.scrollPosition = window.pageYOffset;
      document.body.style.top = `-${this.scrollPosition}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, this.scrollPosition || 0);
    }
  }

  handleResize() {
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMobileMenu();
    }
  }
}

// ==========================================================================
// Animation Controller
// ==========================================================================

class AnimationController {
  constructor() {
    this.observedElements = new Set();
    this.initIntersectionObserver();
  }

  initIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observeElements();
  }

  observeElements() {
    const elements = document.querySelectorAll(
      '.skill-card, .section-card, .portfolio-item, .hero-title, .hero-subtitle'
    );

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    // Staggered Animation für Grid-Elemente
    if (element.parentElement.classList.contains('skills-grid') || 
        element.parentElement.classList.contains('portfolio-grid')) {
      const index = Array.from(element.parentElement.children).indexOf(element);
      const delay = index * 100;
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
    } else {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  }

  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-elements');
    
    if (parallaxElements.length > 0) {
      let ticking = false;
      
      const updateParallax = () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
          const speed = 0.5;
          const yPos = -(scrollY * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  }

  recalculate() {
    // Neuberechnung bei Resize
    this.observeElements();
  }
}

// ==========================================================================
// Portfolio Manager
// ==========================================================================

class PortfolioManager {
  constructor() {
    this.currentFilter = 'all';
    this.portfolioData = [];
    this.init();
  }

  async init() {
    await this.loadPortfolioData();
    this.renderPortfolio();
    this.initFilters();
  }

  async loadPortfolioData() {
    // Simulierte Daten - in Realität von API oder JSON laden
    this.portfolioData = [
      {
        id: 1,
        title: "Frühlings-Deko Set",
        description: "Wunderschöne Frühlingsdekorationen für Ihr Zuhause mit detaillierten Anleitungen.",
        category: "seasonal",
        tags: ["Frühling", "Deko", "DIY"],
        image: "🌸"
      },
      {
        id: 2,
        title: "Vintage Bilderrahmen",
        description: "Einzigartige Vintage-Bilderrahmen im Shabby-Chic-Stil zum Selbermachen.",
        category: "diy",
        tags: ["Vintage", "Rahmen", "Shabby"],
        image: "🖼️"
      },
      {
        id: 3,
        title: "Kalender-Vorlage 2025",
        description: "Liebevoll gestaltete Kalendervorlage zum Ausdrucken und Personalisieren.",
        category: "templates",
        tags: ["Kalender", "Planer", "2025"],
        image: "📅"
      },
      {
        id: 4,
        title: "Weihnachts-Anhänger",
        description: "Festliche Weihnachtsanhänger aus verschiedenen Materialien basteln.",
        category: "seasonal",
        tags: ["Weihnachten", "Anhänger", "Festlich"],
        image: "🎄"
      },
      {
        id: 5,
        title: "Etiketten-Set",
        description: "Vielseitige Etiketten für Geschenke, Gläser und Organisation.",
        category: "templates",
        tags: ["Etiketten", "Organisation", "Geschenke"],
        image: "🏷️"
      },
      {
        id: 6,
        title: "Makramee Wandbehang",
        description: "Trendiger Makramee Wandbehang mit Schritt-für-Schritt Anleitung.",
        category: "diy",
        tags: ["Makramee", "Wanddeko", "Boho"],
        image: "🪢"
      }
    ];
  }

  renderPortfolio() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filteredItems = this.currentFilter === 'all' 
      ? this.portfolioData 
      : this.portfolioData.filter(item => item.category === this.currentFilter);

    filteredItems.forEach((item, index) => {
      const portfolioItem = this.createPortfolioItem(item, index);
      grid.appendChild(portfolioItem);
    });

    // Trigger Animations
    this.triggerItemAnimations();
  }

  createPortfolioItem(item, index) {
    const article = document.createElement('article');
    article.className = 'portfolio-item';
    article.style.animationDelay = `${index * 0.1}s`;
    
    article.innerHTML = `
      <div class="portfolio-image" role="img" aria-label="${item.title}">
        ${item.image}
      </div>
      <div class="portfolio-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="portfolio-tags">
          ${item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;

    // Click Handler für Portfolio-Item
    article.addEventListener('click', () => {
      this.openPortfolioModal(item);
    });

    return article;
  }

  openPortfolioModal(item) {
    // Modal-Funktionalität - vereinfacht
    console.log('Öffne Portfolio Item:', item.title);
    // Hier würde normalerweise ein Modal geöffnet
  }

  initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const filter = button.getAttribute('data-filter');
        await this.setFilter(filter);
        this.updateFilterUI(button);
      });
    });
  }

  async setFilter(filter) {
    this.currentFilter = filter;
    
    // Fade out animation
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });

    // Warten auf Animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.renderPortfolio();
  }

  updateFilterUI(activeButton) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
  }

  triggerItemAnimations() {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// ==========================================================================
// Stats Counter
// ==========================================================================

class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.hasAnimated = false;
    this.initCounters();
  }

  initCounters() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateCounters();
          this.hasAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  async animateCounters() {
    const promises = Array.from(this.counters).map(counter => {
      return this.animateCounter(counter);
    });

    await Promise.all(promises);
  }

  animateCounter(element) {
    return new Promise(resolve => {
      const target = parseInt(element.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
          resolve();
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    });
  }
}

// ==========================================================================
// Service Worker Registration (PWA Support)
// ==========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registriert:', registration);
    } catch (error) {
      console.log('Service Worker Registrierung fehlgeschlagen:', error);
    }
  });
}

// ==========================================================================
// Web Vitals Monitoring (optional)
// ==========================================================================

// Vereinfachte Web Vitals Messung
const measureWebVitals = () => {
  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  });
  
  fidObserver.observe({ entryTypes: ['first-input'] });
};

// ==========================================================================
// App Initialisierung
// ==========================================================================

// Hauptanwendung starten
const app = new ModernWebsite();

// Web Vitals messen
measureWebVitals();

// Export für mögliche externe Nutzung
window.BastelGlueckApp = app;
```

Und hier ist eine einfache Manifest-Datei für PWA-Support:

```json:manifest.json
{
  "name": "Bastelglück by Reni",
  "short_name": "Bastelglück",
  "description": "Kreative DIY-Projekte und digitale Bastelvorlagen",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#40e0d0",
  "theme_color": "#ff69b4",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Was wurde modernisiert:

### ✅ **HTML5 & Semantisches Markup:**
- Vollständige semantische HTML-Struktur (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Strukturierte Daten (JSON-LD) für SEO
- ARIA-Labels und Accessibility-Features
- Skip Navigation für Screenreader

### ✅ **Modernes CSS:**
- CSS Custom Properties (Variablen) für konsistente Gestaltung  
- CSS Grid und Flexbox für responsive Layouts
- Moderne Animationen und Micro-Interactions
- Container Queries für moderne Browser
- Verbesserte Scrollbar-Gestaltung

### ✅ **JavaScript ES6+:**
- Klassen-basierte Architektur
- Async/Await für bessere Performance
- Module-ähnliche Struktur
- Modern Web APIs (Intersection Observer, Performance Observer)
- Event Delegation und optimierte Event Handler

### ✅ **Interaktive Portfolio-Elemente:**
- Dynamisches Portfolio mit Filterung
- Animierte Statistik-Counter
- Verbesserte Hover-Effekte
- Keyboard Navigation Support

### ✅ **Performance & PWA:**
- Service Worker Support
- Web Vitals Monitoring
- Lazy Loading Vorbereitung
- Resource Preloading

Die Website ist jetzt eine vollständig moderne, zugängliche und performante Lösung! 🚀
