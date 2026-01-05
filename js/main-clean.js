/**
 * Moderne Website für Bastelglück by Reni
 * Hauptdatei mit allen Komponenten und Funktionalitäten
 */

// Performance Tracking für Web Vitals
function measureWebVitals() {
  if ('web-vital' in window) {
    // Falls Web Vitals Library geladen ist
    webVitals.getCLS(console.log);
    webVitals.getFID(console.log);
    webVitals.getFCP(console.log);
    webVitals.getLCP(console.log);
    webVitals.getTTFB(console.log);
  }
}

// Main Website Class
class ModernWebsite {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Warten bis DOM bereit ist
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
      } else {
        this.initializeComponents();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Fehler bei der Website-Initialisierung:', error);
    }
  }

  initializeComponents() {
    // Header initialisieren
    this.components.header = new HeaderComponent();
    
    // Navigation initialisieren
    this.components.navigation = new NavigationComponent();
    
    // Animationen initialisieren
    this.components.animations = new AnimationController();
    
    // Portfolio initialisieren
    this.components.portfolio = new PortfolioManager();
    
    // Statistiken initialisieren
    this.components.stats = new StatsCounter();
    
    // Mobile Optimierungen
    this.setupMobileOptimizations();
    
    // Resize Handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
    
    // Service Worker registrieren
    this.registerServiceWorker();
    
    console.log('✅ Website erfolgreich initialisiert');
  }

  setupMobileOptimizations() {
    // Viewport-spezifische Optimierungen
    this.optimizeForViewport();
    
    // Touch-Events optimieren
    this.optimizeTouchEvents();
  }

  optimizeForViewport() {
    const viewport = window.innerWidth;
    const body = document.body;
    
    // Klassen entfernen
    body.classList.remove('mobile-optimized', 'tablet-optimized', 'desktop-optimized');
    
    if (viewport < 768) {
      body.classList.add('mobile-optimized');
      this.enableMobileOptimizations();
    } else if (viewport < 1024) {
      body.classList.add('tablet-optimized');
      this.enableTabletOptimizations();
    } else {
      body.classList.add('desktop-optimized');
      this.enableDesktopOptimizations();
    }
  }

  enableMobileOptimizations() {
    // Reduzierte Animationen auf schwachen Geräten
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
    }
  }

  enableTabletOptimizations() {
    // Touch-spezifische Optimierungen
    document.body.classList.add('touch-device');
  }

  enableDesktopOptimizations() {
    // Hover-Effekte aktivieren
    document.body.classList.add('hover-enabled');
  }

  optimizeTouchEvents() {
    // Passive Event Listeners für bessere Performance
    const touchElements = document.querySelectorAll('.portfolio-item, .skill-card, .cta-button');
    touchElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }

  handleResize() {
    this.components.navigation?.handleResize();
    this.components.animations?.recalculate();
    this.optimizeForViewport();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registriert:', registration);
      } catch (error) {
        console.log('❌ Service Worker Registrierung fehlgeschlagen:', error);
      }
    }
  }

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
}

// Header Component
class HeaderComponent {
  constructor() {
    this.header = document.querySelector('header');
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    if (!this.header) return;
    
    // Scroll-Effekte
    window.addEventListener('scroll', this.debounce(() => {
      this.handleScroll();
    }, 10), { passive: true });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Header Background bei Scroll
    if (currentScrollY > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Hide/Show Header bei Scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.header.classList.add('hidden');
    } else {
      this.header.classList.remove('hidden');
    }
    
    this.lastScrollY = currentScrollY;
  }

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
}

// Navigation Component
class NavigationComponent {
  constructor() {
    this.mobileMenuButton = document.querySelector('.mobile-menu-button');
    this.navLinks = document.querySelector('.nav-links');
    this.isOpen = false;
    this.scrollPosition = 0;
    this.init();
  }

  init() {
    if (!this.mobileMenuButton || !this.navLinks) return;
    
    // Mobile Menu Toggle
    this.mobileMenuButton.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Navigation Links
    const navLinks = this.navLinks.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e);
      });
    });
    
    // Escape key für Mobile Menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
    this.updateMobileMenu();
  }

  closeMobileMenu() {
    this.isOpen = false;
    this.updateMobileMenu();
  }

  updateMobileMenu() {
    this.mobileMenuButton.setAttribute('aria-expanded', this.isOpen);
    this.navLinks.classList.toggle('open', this.isOpen);
    
    // Body Scroll Lock
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

  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Mobile Menu schließen
        if (this.isOpen) {
          this.closeMobileMenu();
        }
        
        // Smooth Scroll
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, this.isOpen ? 300 : 0);
      }
    }
  }

  handleResize() {
    // Bei Resize Mobile Menu schließen wenn zu groß
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMobileMenu();
    }
  }
}

// Animation Controller
class AnimationController {
  constructor() {
    this.observedElements = new Set();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.observeElements();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Element nur einmal animieren
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    const animatableElements = document.querySelectorAll(
      '.skill-card, .portfolio-item, .section-card, .hero, .profile-image'
    );
    
    animatableElements.forEach(element => {
      this.observer.observe(element);
      this.observedElements.add(element);
    });
  }

  recalculate() {
    // Intersection Observer neu berechnen
    this.observedElements.forEach(element => {
      if (!element.classList.contains('animate-in')) {
        this.observer.unobserve(element);
        this.observer.observe(element);
      }
    });
  }
}

// Portfolio Manager
class PortfolioManager {
  constructor() {
    this.portfolioData = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadPortfolioData();
    this.renderPortfolio();
    this.initFilters();
  }

  async loadPortfolioData() {
    // Erweiterte DIY-Portfolio-Daten mit allen gewünschten Features
    this.portfolioData = [
      {
        id: 1,
        title: "Vintage Makramee Wandbehang",
        description: "Trendiger Boho-Wandbehang mit natürlichen Materialien",
        fullDescription: "Erstellen Sie einen wunderschönen Makramee-Wandbehang im Vintage-Stil. Dieses Projekt kombiniert traditionelle Knüpftechniken mit modernem Design und bringt natürliche Eleganz in jeden Raum.",
        category: "diy",
        difficulty: "mittel",
        timeRequired: "4-6 Stunden",
        tags: ["Makramee", "Wanddeko", "Boho", "Natürlich"],
        image: "🪢",
        gallery: ["🪢", "🧵", "📏", "✂️", "🏠"],
        materials: [
          { name: "Makramee-Garn", amount: "200m", price: "€15,99" },
          { name: "Holzstab", amount: "1 Stück (80cm)", price: "€8,50" },
          { name: "Schere", amount: "1 Stück", price: "€12,00" },
          { name: "Maßband", amount: "1 Stück", price: "€3,99" },
          { name: "Kamm", amount: "1 Stück", price: "€5,50" }
        ],
        tools: ["Schere", "Maßband", "Kamm", "Clips zum Fixieren"],
        steps: [
          {
            title: "Vorbereitung",
            description: "Garn in 16 Stränge à 2,5m schneiden",
            image: "✂️",
            time: "15 min",
            tips: "Alle Stränge sollten exakt gleich lang sein für ein symmetrisches Ergebnis"
          },
          {
            title: "Grundknoten",
            description: "Garn mit Ankerstich am Holzstab befestigen",
            image: "🪢", 
            time: "20 min",
            tips: "Knoten fest anziehen, aber nicht zu straff - das Garn sollte sich noch bewegen können"
          },
          {
            title: "Oberes Muster",
            description: "Erste Reihe mit diagonalen Kreuzknoten knüpfen",
            image: "🔀",
            time: "45 min",
            tips: "Gleichmäßige Abstände einhalten für ein professionelles Aussehen"
          },
          {
            title: "Mittelteil",
            description: "Charakteristische Rhombenmuster erstellen",
            image: "💎",
            time: "90 min", 
            tips: "Vor jedem neuen Abschnitt Länge prüfen und nachmessen"
          },
          {
            title: "Fransen",
            description: "Untere Enden aufkämmen und gleichmäßig schneiden",
            image: "🧵",
            time: "30 min",
            tips: "Fransen in feuchtem Zustand kämmen für beste Ergebnisse"
          },
          {
            title: "Finishing",
            description: "Endkontrolle und Aufhängung anbringen",
            image: "🏠",
            time: "15 min",
            tips: "24h hängen lassen, damit sich das Garn setzen kann"
          }
        ],
        difficulty_details: {
          level: 2,
          skills: ["Grundknoten", "Kreuzknoten", "Messen"],
          prerequisites: "Keine Vorkenntnisse nötig",
          age_group: "Ab 14 Jahren"
        },
        featured: true,
        rating: 4.8,
        completions: 127
      },
      {
        id: 2,
        title: "Shabby-Chic Bilderrahmen Upcycling",
        description: "Alte Rahmen in Vintage-Schätze verwandeln",
        fullDescription: "Hauchen Sie alten Bilderrahmen neues Leben ein! Mit einfachen Techniken und natürlichen Materialien entstehen einzigartige Vintage-Rahmen mit charaktervollem Shabby-Chic-Look.",
        category: "diy",
        difficulty: "einfach",
        timeRequired: "2-3 Stunden",
        tags: ["Vintage", "Upcycling", "Rahmen", "Shabby-Chic"],
        image: "🖼️",
        gallery: ["🖼️", "🎨", "🪵", "✨", "🏠"],
        materials: [
          { name: "Alter Bilderrahmen", amount: "1 Stück", price: "€0,00 (vorhanden)" },
          { name: "Kreidefarbe weiß", amount: "250ml", price: "€12,99" },
          { name: "Kreidefarbe grau", amount: "100ml", price: "€8,99" },
          { name: "Schleifpapier", amount: "3 Blatt", price: "€4,50" },
          { name: "Pinsel Set", amount: "1 Set", price: "€15,99" },
          { name: "Wachs", amount: "1 Dose", price: "€11,50" }
        ],
        tools: ["Pinsel", "Schleifpapier", "Lappen", "Schutzbrille"],
        steps: [
          {
            title: "Rahmen vorbereiten",
            description: "Rahmen gründlich reinigen und alte Farbreste entfernen",
            image: "🧽",
            time: "20 min",
            tips: "Bei hartnäckigen Farbresten warmes Seifenwasser verwenden"
          },
          {
            title: "Grundierung",
            description: "Erste Schicht weiße Kreidefarbe auftragen",
            image: "🎨",
            time: "30 min",
            tips: "Dünne, gleichmäßige Schicht - lieber zwei dünne als eine dicke"
          },
          {
            title: "Trocknen lassen",
            description: "Farbe vollständig trocknen lassen",
            image: "⏰",
            time: "60 min",
            tips: "Bei hoher Luftfeuchtigkeit länger warten"
          },
          {
            title: "Zweite Schicht",
            description: "Graue Akzente an Kanten und Vertiefungen",
            image: "🖌️",
            time: "25 min",
            tips: "Mit fast trockenem Pinsel arbeiten für natürlichen Look"
          },
          {
            title: "Distressing",
            description: "Leicht schleifen für Vintage-Effekt",
            image: "📜",
            time: "15 min",
            tips: "Weniger ist mehr - nur an natürlichen Abnutzungsstellen"
          },
          {
            title: "Versiegelung",
            description: "Wachs auftragen und polieren",
            image: "✨",
            time: "20 min",
            tips: "Mit kreisenden Bewegungen einarbeiten und nachpolieren"
          }
        ],
        difficulty_details: {
          level: 1,
          skills: ["Pinselführung", "Farbauftrag"],
          prerequisites: "Keine",
          age_group: "Ab 10 Jahren (mit Hilfe)"
        },
        featured: true,
        rating: 4.9,
        completions: 203
      },
      {
        id: 3,
        title: "Frühlingshafte Türkränze",
        description: "Natürliche Frühlingsdeko für den Eingangsbereich",
        fullDescription: "Begrüßen Sie den Frühling mit einem selbstgemachten Türkranz aus natürlichen Materialien. Dieser Kranz bringt frische Farben und Frühlingsduft direkt vor Ihre Haustür.",
        category: "seasonal",
        difficulty: "einfach",
        timeRequired: "1-2 Stunden",
        tags: ["Frühling", "Türkranz", "Natur", "Deko"],
        image: "🌸",
        gallery: ["🌸", "🌿", "🌻", "🎀", "🚪"],
        materials: [
          { name: "Strohkranz", amount: "1 Stück (30cm)", price: "€7,99" },
          { name: "Frühlingsblumen künstlich", amount: "1 Bund", price: "€12,50" },
          { name: "Efeuranken", amount: "2m", price: "€8,99" },
          { name: "Satinband", amount: "1m", price: "€4,50" },
          { name: "Heißkleber", amount: "10 Sticks", price: "€3,99" },
          { name: "Draht", amount: "2m", price: "€2,50" }
        ],
        tools: ["Heißklebepistole", "Drahtschere", "Schere"],
        steps: [
          {
            title: "Basis wickeln",
            description: "Efeuranken um den Strohkranz wickeln",
            image: "🌿",
            time: "20 min",
            tips: "Überlappend wickeln für vollständige Abdeckung"
          },
          {
            title: "Blumen vorbereiten", 
            description: "Künstliche Blumen von Stielen trennen",
            image: "🌻",
            time: "15 min",
            tips: "Verschiedene Größen für natürlichen Look beibehalten"
          },
          {
            title: "Blumen befestigen",
            description: "Blumen mit Heißkleber am Kranz befestigen",
            image: "🌸",
            time: "30 min",
            tips: "Von größeren zu kleineren Blumen arbeiten"
          },
          {
            title: "Akzente setzen",
            description: "Kleinere Elemente und Grün hinzufügen",
            image: "🌾",
            time: "20 min", 
            tips: "Unregelmäßige Verteilung wirkt natürlicher"
          },
          {
            title: "Schleife binden",
            description: "Dekorative Schleife aus Satinband",
            image: "🎀",
            time: "10 min",
            tips: "Schleife erst zum Schluss befestigen"
          },
          {
            title: "Aufhängung",
            description: "Drahtschlaufe zur Befestigung anbringen",
            image: "🚪",
            time: "5 min",
            tips: "Verstärkt befestigen für Wind-Sicherheit"
          }
        ],
        difficulty_details: {
          level: 1,
          skills: ["Wickeln", "Kleben", "Drapieren"],
          prerequisites: "Keine", 
          age_group: "Ab 8 Jahren"
        },
        featured: false,
        rating: 4.7,
        completions: 156
      },
      {
        id: 4,
        title: "Holz-Schmuckschalen mit Brandmalerei",
        description: "Personalisierte Schmuckaufbewahrung mit Pyrografie",
        fullDescription: "Erstellen Sie einzigartige Schmuckschalen aus Holz mit der faszinierenden Technik der Brandmalerei. Jede Schale wird zum individuellen Kunstwerk mit persönlichen Motiven.",
        category: "diy",
        difficulty: "fortgeschritten",
        timeRequired: "6-8 Stunden",
        tags: ["Holz", "Brandmalerei", "Schmuck", "Personalisiert"],
        image: "🔥",
        gallery: ["🔥", "🪵", "💍", "🎨", "✨"],
        materials: [
          { name: "Holzschale roh", amount: "1 Stück", price: "€15,99" },
          { name: "Schleifpapier Set", amount: "1 Set", price: "€8,50" },
          { name: "Brandmalkolben", amount: "1 Set", price: "€45,00" },
          { name: "Holzbeize", amount: "1 Flasche", price: "€9,99" },
          { name: "Klarlack", amount: "1 Dose", price: "€12,50" },
          { name: "Vorlage Papier", amount: "5 Blatt", price: "€2,99" }
        ],
        tools: ["Brandmalkolben", "Schleifpapier", "Pinsel", "Schutzbrille", "Arbeitshandschuhe"],
        steps: [
          {
            title: "Holz vorbereiten",
            description: "Schale gründlich schleifen und reinigen",
            image: "🪵",
            time: "60 min",
            tips: "Mit verschiedenen Körnungen von grob zu fein arbeiten"
          },
          {
            title: "Design übertragen",
            description: "Motiv mit Kohlepapier auf Holz übertragen",
            image: "📝",
            time: "30 min",
            tips: "Leicht andrücken, um Kohlereste zu minimieren"
          },
          {
            title: "Brandmalerei",
            description: "Motiv mit Brandmalkolben nachzeichnen",
            image: "🔥",
            time: "180 min",
            tips: "Langsam und gleichmäßig führen, Kolben regelmäßig reinigen"
          },
          {
            title: "Details ausarbeiten",
            description: "Feine Linien und Schattierungen hinzufügen",
            image: "🎨",
            time: "120 min",
            tips: "Verschiedene Aufsätze für unterschiedliche Effekte nutzen"
          },
          {
            title: "Beizen",
            description: "Holzbeize für warmen Farbton auftragen",
            image: "🖌️",
            time: "20 min",
            tips: "Mit dem Faserverlauf arbeiten für gleichmäßigen Ton"
          },
          {
            title: "Versiegeln",
            description: "Klarlack für Schutz und Glanz auftragen",
            image: "✨",
            time: "30 min",
            tips: "Mehrere dünne Schichten besser als eine dicke"
          }
        ],
        difficulty_details: {
          level: 3,
          skills: ["Brandmalerei", "Holzbearbeitung", "Feinmotorik"],
          prerequisites: "Erfahrung mit Brandmalkolben empfohlen",
          age_group: "Ab 16 Jahren"
        },
        featured: true,
        rating: 4.6,
        completions: 89
      },
      {
        id: 5,
        title: "Advent-Kalender aus Papiertüten",
        description: "Nachhaltige Weihnachtsdeko zum Selbermachen",
        fullDescription: "Kreieren Sie einen zauberhaften Adventskalender aus umweltfreundlichen Materialien. 24 liebevoll gestaltete Tütchen bringen Vorfreude in die Weihnachtszeit.",
        category: "seasonal",
        difficulty: "einfach",
        timeRequired: "3-4 Stunden",
        tags: ["Weihnachten", "Adventskalender", "Nachhaltig", "Familie"],
        image: "🎄",
        gallery: ["🎄", "📦", "🎁", "✨", "🏠"],
        materials: [
          { name: "Papiertüten braun", amount: "24 Stück", price: "€8,99" },
          { name: "Zahlen-Sticker", amount: "1 Set", price: "€4,50" },
          { name: "Washi-Tape", amount: "5 Rollen", price: "€12,99" },
          { name: "Satinband", amount: "3m", price: "€6,50" },
          { name: "Holzklammern", amount: "24 Stück", price: "€5,99" },
          { name: "Leine", amount: "3m", price: "€3,50" }
        ],
        tools: ["Schere", "Locher", "Klebestift"],
        steps: [
          {
            title: "Tüten vorbereiten",
            description: "Alle Papiertüten auf gleiche Größe bringen",
            image: "📦",
            time: "20 min",
            tips: "Oberkante sauber falten für einheitliches Aussehen"
          },
          {
            title: "Zahlen aufkleben",
            description: "Zahlen 1-24 auf die Tüten kleben",
            image: "🔢",
            time: "15 min",
            tips: "Mittig positionieren und gleichmäßige Abstände einhalten"
          },
          {
            title: "Verzieren",
            description: "Jede Tüte individuell mit Washi-Tape gestalten",
            image: "🎨",
            time: "90 min",
            tips: "Verschiedene Muster kombinieren für abwechslungsreichen Look"
          },
          {
            title: "Verschluss vorbereiten",
            description: "Löcher für Aufhängung stanzen",
            image: "🕳️",
            time: "10 min",
            tips: "Verstärker-Aufkleber verwenden für stabilere Löcher"
          },
          {
            title: "Befüllen",
            description: "Kleine Geschenke oder Süßigkeiten einfüllen",
            image: "🎁",
            time: "30 min",
            tips: "Nicht zu schwer befüllen, damit Aufhängung hält"
          },
          {
            title: "Aufhängen",
            description: "Kalender an Leine oder Ast aufhängen",
            image: "🏠",
            time: "15 min",
            tips: "Leine straff spannen und gleichmäßige Abstände beachten"
          }
        ],
        difficulty_details: {
          level: 1,
          skills: ["Kleben", "Lochen", "Arrangieren"],
          prerequisites: "Keine",
          age_group: "Ab 6 Jahren (mit Hilfe)"
        },
        featured: false,
        rating: 4.9,
        completions: 234
      },
      {
        id: 6,
        title: "Digitale Bullet Journal Vorlagen",
        description: "Personalisierbare Planer für digitale Organisation",
        fullDescription: "Erstellen Sie professionelle digitale Bullet Journal Vorlagen für verschiedene Planer-Apps. Diese Templates helfen bei der Organisation von Terminen, Zielen und täglichen Aufgaben.",
        category: "templates",
        difficulty: "mittel",
        timeRequired: "5-7 Stunden",
        tags: ["Digital", "Planer", "Organisation", "Templates"],
        image: "📱",
        gallery: ["📱", "💻", "📝", "🎨", "📊"],
        materials: [
          { name: "Design-Software Lizenz", amount: "1 Monat", price: "€20,99" },
          { name: "Schriftarten Paket", amount: "1 Set", price: "€15,00" },
          { name: "Icon-Sammlung", amount: "1 Set", price: "€12,50" },
          { name: "Farbpalette Guide", amount: "1 Stück", price: "€8,99" }
        ],
        tools: ["Computer/Tablet", "Design-Software", "Stylus (optional)"],
        steps: [
          {
            title: "Konzept entwickeln",
            description: "Layout und Funktionen planen",
            image: "💡",
            time: "60 min",
            tips: "Zielgruppe und Verwendungszweck klar definieren"
          },
          {
            title: "Grundlayout",
            description: "Master-Template mit Grundelementen erstellen",
            image: "📐",
            time: "90 min",
            tips: "Konsistente Abstände und Proportionen verwenden"
          },
          {
            title: "Monatsübersicht",
            description: "Kalender-Layout für Monatsplanung",
            image: "📅",
            time: "75 min",
            tips: "Genug Platz für Einträge, aber kompakt bleiben"
          },
          {
            title: "Wochenansicht",
            description: "Detaillierte Wochenplaner erstellen",
            image: "📋",
            time: "90 min",
            tips: "Verschiedene Zeitraster für unterschiedliche Bedürfnisse"
          },
          {
            title: "Spezialseiten",
            description: "Habit Tracker, Notizen, Goals hinzufügen",
            image: "🎯",
            time: "120 min",
            tips: "Vielseitigkeit ohne Überladung anstreben"
          },
          {
            title: "Export vorbereiten",
            description: "Verschiedene Formate und Größen erstellen",
            image: "💾",
            time: "45 min",
            tips: "PDF, PNG, und native App-Formate bereitstellen"
          }
        ],
        difficulty_details: {
          level: 2,
          skills: ["Design-Software", "Layout-Design", "Digitale Gestaltung"],
          prerequisites: "Grundkenntnisse in Design-Software",
          age_group: "Ab 14 Jahren"
        },
        featured: false,
        rating: 4.5,
        completions: 178
      }
    ];
  }

  renderPortfolio() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    // Loading Spinner entfernen
    grid.innerHTML = '';

    // Projekte nach Filter filtern
    const filteredItems = this.currentFilter === 'all' 
      ? this.portfolioData 
      : this.portfolioData.filter(item => item.category === this.currentFilter);

    if (filteredItems.length === 0) {
      grid.innerHTML = '<p class="no-results">Keine Projekte in dieser Kategorie gefunden.</p>';
      return;
    }

    // Portfolio Items erstellen
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
    
    // Schwierigkeitsgrad-Anzeige
    const difficultyClass = {
      'einfach': 'difficulty-easy',
      'mittel': 'difficulty-medium', 
      'fortgeschritten': 'difficulty-hard'
    }[item.difficulty] || 'difficulty-medium';
    
    const difficultyStars = '★'.repeat(item.difficulty_details.level) + '☆'.repeat(3 - item.difficulty_details.level);
    
    // Featured Badge
    const featuredBadge = item.featured ? '<div class="featured-badge">⭐ Empfohlen</div>' : '';
    
    article.innerHTML = `
      <div class="portfolio-image" role="img" aria-label="${item.title}">
        ${item.image}
        ${featuredBadge}
        <div class="project-gallery-preview">
          ${item.gallery.slice(1, 4).map(img => `<span class="gallery-thumb">${img}</span>`).join('')}
          ${item.gallery.length > 4 ? `<span class="more-images">+${item.gallery.length - 4}</span>` : ''}
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-header">
          <h3>${item.title}</h3>
          <div class="project-meta">
            <span class="difficulty-indicator ${difficultyClass}" title="${item.difficulty}">
              ${difficultyStars}
            </span>
            <span class="time-indicator" title="Benötigte Zeit">
              ⏱️ ${item.timeRequired}
            </span>
          </div>
        </div>
        <p class="project-description">${item.description}</p>
        <div class="project-details">
          <div class="material-count">
            📦 ${item.materials.length} Materialien
          </div>
          <div class="steps-count">
            📋 ${item.steps.length} Schritte
          </div>
          <div class="rating-display">
            ⭐ ${item.rating} (${item.completions})
          </div>
        </div>
        <div class="portfolio-tags">
          ${item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
        </div>
        <div class="portfolio-actions">
          <button class="view-project-btn" data-project-id="${item.id}">
            <span>📖</span>
            <span>Anleitung ansehen</span>
          </button>
        </div>
      </div>
    `;

    // Click Handler für Anleitung
    const viewBtn = article.querySelector('.view-project-btn');
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openProjectModal(item);
    });

    // Click Handler für Portfolio-Item (öffnet auch Modal)
    article.addEventListener('click', () => {
      this.openProjectModal(item);
    });

    return article;
  }

  openProjectModal(project) {
    // Erstelle und zeige detailliertes Projekt-Modal
    const modal = this.createProjectModal(project);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);

    // Close Handlers
    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }, 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // Tab Navigation für Steps
    this.initStepNavigation(modal, project);
  }

  createProjectModal(project) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    
    const difficultyStars = '★'.repeat(project.difficulty_details.level) + '☆'.repeat(3 - project.difficulty_details.level);
    const totalCost = project.materials.reduce((sum, material) => {
      return sum + parseFloat(material.price.replace('€', '').replace(',', '.'));
    }, 0);
    
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Modal schließen">×</button>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="project-hero">
            <div class="project-main-image">
              <span class="main-emoji">${project.image}</span>
              ${project.featured ? '<div class="featured-badge">⭐ Empfohlen</div>' : ''}
            </div>
            <div class="project-info">
              <h1>${project.title}</h1>
              <p class="project-full-description">${project.fullDescription}</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-icon">⭐</span>
                  <span class="stat-value">${project.rating}</span>
                  <span class="stat-label">(${project.completions} mal gemacht)</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-value">${project.timeRequired}</span>
                  <span class="stat-label">Arbeitszeit</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">💰</span>
                  <span class="stat-value">~€${totalCost.toFixed(2)}</span>
                  <span class="stat-label">Materialkosten</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Navigation -->
        <div class="modal-nav">
          <button class="nav-tab active" data-tab="overview">Übersicht</button>
          <button class="nav-tab" data-tab="materials">Materialien</button>
          <button class="nav-tab" data-tab="steps">Anleitung</button>
          <button class="nav-tab" data-tab="gallery">Galerie</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          
          <!-- Overview Tab -->
          <div class="tab-content active" id="overview">
            <div class="overview-grid">
              <div class="difficulty-card">
                <h3>Schwierigkeitsgrad</h3>
                <div class="difficulty-display">
                  <span class="difficulty-stars">${difficultyStars}</span>
                  <span class="difficulty-text">${project.difficulty}</span>
                </div>
                <div class="difficulty-details">
                  <p><strong>Benötigte Fähigkeiten:</strong> ${project.difficulty_details.skills.join(', ')}</p>
                  <p><strong>Voraussetzungen:</strong> ${project.difficulty_details.prerequisites}</p>
                  <p><strong>Altersgruppe:</strong> ${project.difficulty_details.age_group}</p>
                </div>
              </div>
              
              <div class="tools-card">
                <h3>Benötigte Werkzeuge</h3>
                <div class="tools-list">
                  ${project.tools.map(tool => `<span class="tool-item">🔧 ${tool}</span>`).join('')}
                </div>
              </div>
              
              <div class="tags-card">
                <h3>Kategorien</h3>
                <div class="modal-tags">
                  ${project.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Tab -->
          <div class="tab-content" id="materials">
            <div class="materials-section">
              <h3>Materialliste</h3>
              <div class="materials-grid">
                ${project.materials.map(material => `
                  <div class="material-item">
                    <div class="material-info">
                      <span class="material-name">${material.name}</span>
                      <span class="material-amount">${material.amount}</span>
                    </div>
                    <span class="material-price">${material.price}</span>
                  </div>
                `).join('')}
              </div>
              <div class="materials-total">
                <strong>Geschätzte Gesamtkosten: €${totalCost.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <!-- Steps Tab -->
          <div class="tab-content" id="steps">
            <div class="steps-section">
              <h3>Schritt-für-Schritt Anleitung</h3>
              <div class="steps-list">
                ${project.steps.map((step, index) => `
                  <div class="step-item">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                      <div class="step-header">
                        <h4>${step.title}</h4>
                        <span class="step-time">⏱️ ${step.time}</span>
                      </div>
                      <div class="step-visual">
                        <span class="step-emoji">${step.image}</span>
                      </div>
                      <p class="step-description">${step.description}</p>
                      <div class="step-tip">
                        <span class="tip-icon">💡</span>
                        <span class="tip-text">${step.tips}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Gallery Tab -->
          <div class="tab-content" id="gallery">
            <div class="gallery-section">
              <h3>Projekt-Galerie</h3>
              <div class="gallery-grid">
                ${project.gallery.map((img, index) => `
                  <div class="gallery-item" data-stage="${index}">
                    <span class="gallery-emoji">${img}</span>
                    <div class="gallery-label">Stadium ${index + 1}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-actions">
            <button class="bookmark-btn">
              <span>🔖</span>
              <span>Merken</span>
            </button>
            <button class="share-btn">
              <span>📤</span>
              <span>Teilen</span>
            </button>
            <button class="start-project-btn">
              <span>🚀</span>
              <span>Projekt starten</span>
            </button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  initStepNavigation(modal, project) {
    const tabs = modal.querySelectorAll('.nav-tab');
    const contents = modal.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active classes
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active classes
        tab.classList.add('active');
        modal.querySelector(`#${targetTab}`).classList.add('active');
      });
    });

    // Footer button handlers
    modal.querySelector('.bookmark-btn').addEventListener('click', () => {
      this.bookmarkProject(project);
    });

    modal.querySelector('.share-btn').addEventListener('click', () => {
      this.shareProject(project);
    });

    modal.querySelector('.start-project-btn').addEventListener('click', () => {
      this.startProject(project);
    });
  }

  bookmarkProject(project) {
    // Lokale Speicherung der gemerkten Projekte
    const bookmarks = JSON.parse(localStorage.getItem('diy-bookmarks') || '[]');
    if (!bookmarks.includes(project.id)) {
      bookmarks.push(project.id);
      localStorage.setItem('diy-bookmarks', JSON.stringify(bookmarks));
      
      // Feedback anzeigen
      this.showNotification('Projekt gespeichert! 🔖');
    }
  }

  shareProject(project) {
    // Web Share API oder Fallback
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href + '#project-' + project.id
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href + '#project-' + project.id);
      this.showNotification('Link kopiert! 📤');
    }
  }

  startProject(project) {
    // Projekt in "Meine Projekte" hinzufügen
    const myProjects = JSON.parse(localStorage.getItem('my-projects') || '[]');
    const projectData = {
      ...project,
      startedAt: new Date().toISOString(),
      progress: 0,
      currentStep: 0
    };
    
    myProjects.push(projectData);
    localStorage.setItem('my-projects', JSON.stringify(myProjects));
    
    this.showNotification('Projekt gestartet! 🚀 Viel Spaß beim Basteln!');
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.setFilter(filter);
        
        // Update active button
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      });
    });
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderPortfolio();
  }

  triggerItemAnimations() {
    // Trigger animation for portfolio items
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 100);
    });
  }
}

// Stats Counter
class StatsCounter {
  constructor() {
    this.init();
  }

  init() {
    const statsElements = document.querySelectorAll('.stat-number');
    if (statsElements.length === 0) return;

    this.setupIntersectionObserver(statsElements);
  }

  setupIntersectionObserver(elements) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }
}

// Hauptanwendung starten
const app = new ModernWebsite();

// Web Vitals messen
measureWebVitals();

// Export für mögliche externe Nutzung
window.BastelGlueckApp = app;
