// Einfache Portfolio-Implementation die garantiert funktioniert
console.log('🚀 Portfolio-Script startet...');

// Portfolio-Daten
const portfolioData = [
  {
    id: 1,
    title: "Vintage Makramee Wandbehang",
    description: "Trendiger Boho-Wandbehang mit natürlichen Materialien",
    category: "diy",
    difficulty: "mittel",
    timeRequired: "4-6 Stunden",
    tags: ["Makramee", "Wanddeko", "Boho"],
    image: "🪢",
    materials: ["Makramee-Garn 200m", "Holzstab 80cm", "Schere", "Maßband"],
    steps: ["Garn schneiden", "Grundknoten", "Muster knüpfen", "Fransen"],
    featured: true,
    rating: 4.8,
    completions: 127
  },
  {
    id: 2,
    title: "Shabby-Chic Bilderrahmen",
    description: "Alte Rahmen in Vintage-Schätze verwandeln",
    category: "diy",
    difficulty: "einfach",
    timeRequired: "2-3 Stunden",
    tags: ["Vintage", "Upcycling", "Rahmen"],
    image: "🖼️",
    materials: ["Alter Rahmen", "Kreidefarbe", "Schleifpapier", "Pinsel"],
    steps: ["Vorbereiten", "Grundierung", "Schleifen", "Versiegeln"],
    featured: true,
    rating: 4.9,
    completions: 203
  },
  {
    id: 3,
    title: "Frühlings-Türkranz",
    description: "Natürliche Frühlingsdeko für den Eingangsbereich",
    category: "seasonal",
    difficulty: "einfach",
    timeRequired: "1-2 Stunden",
    tags: ["Frühling", "Türkranz", "Natur"],
    image: "🌸",
    materials: ["Strohkranz", "Frühlingsblumen", "Efeuranken", "Satinband"],
    steps: ["Basis wickeln", "Blumen befestigen", "Schleife binden"],
    featured: false,
    rating: 4.7,
    completions: 156
  },
  {
    id: 4,
    title: "Holz-Schmuckschalen",
    description: "Personalisierte Schmuckaufbewahrung mit Brandmalerei",
    category: "diy",
    difficulty: "fortgeschritten",
    timeRequired: "6-8 Stunden",
    tags: ["Holz", "Brandmalerei", "Schmuck"],
    image: "🔥",
    materials: ["Holzschale", "Brandmalkolben", "Schleifpapier", "Holzbeize"],
    steps: ["Holz vorbereiten", "Design übertragen", "Brandmalerei", "Versiegeln"],
    featured: true,
    rating: 4.6,
    completions: 89
  },
  {
    id: 5,
    title: "Adventskalender",
    description: "Nachhaltige Weihnachtsdeko zum Selbermachen",
    category: "seasonal",
    difficulty: "einfach",
    timeRequired: "3-4 Stunden",
    tags: ["Weihnachten", "Adventskalender", "Nachhaltig"],
    image: "🎄",
    materials: ["Papiertüten", "Zahlen-Sticker", "Washi-Tape", "Holzklammern"],
    steps: ["Tüten vorbereiten", "Verzieren", "Befüllen", "Aufhängen"],
    featured: false,
    rating: 4.9,
    completions: 234
  },
  {
    id: 6,
    title: "Digitale Bullet Journal Vorlagen",
    description: "Personalisierbare Planer für digitale Organisation",
    category: "templates",
    difficulty: "mittel",
    timeRequired: "5-7 Stunden",
    tags: ["Digital", "Planer", "Organisation"],
    image: "📱",
    materials: ["Design-Software", "Schriftarten", "Icon-Sammlung"],
    steps: ["Konzept entwickeln", "Layout erstellen", "Export vorbereiten"],
    featured: false,
    rating: 4.5,
    completions: 178
  }
];

// Aktueller Filter
let currentFilter = 'all';

// Portfolio rendern
function renderPortfolio() {
  console.log('📋 Rendere Portfolio...');
  
  const grid = document.getElementById('portfolio-grid');
  if (!grid) {
    console.error('❌ Portfolio-Grid nicht gefunden!');
    return;
  }

  // Loading entfernen
  grid.innerHTML = '';

  // Filtern
  const filteredItems = currentFilter === 'all' 
    ? portfolioData 
    : portfolioData.filter(item => item.category === currentFilter);

  console.log(`✅ Zeige ${filteredItems.length} Projekte (Filter: ${currentFilter})`);

  // Items erstellen
  filteredItems.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'portfolio-item';
    article.style.animationDelay = `${index * 0.1}s`;
    
    // Schwierigkeitsgrad
    const difficultyStars = {
      'einfach': '⭐☆☆',
      'mittel': '⭐⭐☆', 
      'fortgeschritten': '⭐⭐⭐'
    }[item.difficulty] || '⭐⭐☆';
    
    const featuredBadge = item.featured ? '<div class="featured-badge">⭐ Empfohlen</div>' : '';
    
    article.innerHTML = `
      <div class="portfolio-image" role="img" aria-label="${item.title}">
        ${item.image}
        ${featuredBadge}
      </div>
      <div class="portfolio-content">
        <div class="portfolio-header">
          <h3>${item.title}</h3>
          <div class="project-meta">
            <span class="difficulty-indicator" title="${item.difficulty}">
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
          <button class="view-project-btn" onclick="showProjectDetails(${item.id})">
            <span>📖</span>
            <span>Anleitung ansehen</span>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(article);
  });
  
  // Animation triggern
  setTimeout(() => {
    const items = grid.querySelectorAll('.portfolio-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 100);
    });
  }, 100);
}

// Filter-Buttons initialisieren
function initFilters() {
  console.log('🎛️ Initialisiere Filter...');
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      console.log(`🔍 Filter gewechselt zu: ${filter}`);
      
      // Filter setzen
      currentFilter = filter;
      
      // Button-Status updaten
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      // Portfolio neu rendern
      renderPortfolio();
    });
  });
}

// Projekt-Details anzeigen (vereinfacht)
function showProjectDetails(projectId) {
  const project = portfolioData.find(p => p.id === projectId);
  if (project) {
    alert(`${project.title}\n\n${project.description}\n\nSchwierigkeit: ${project.difficulty}\nZeit: ${project.timeRequired}\n\nMaterialien:\n${project.materials.join('\n')}\n\nSchritte:\n${project.steps.join('\n')}`);
  }
}

// Mobile Menu (vereinfacht)
function initMobileMenu() {
  const button = document.querySelector('.mobile-menu-button');
  const nav = document.querySelector('.nav-links');
  
  if (button && nav) {
    button.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', !isOpen);
    });
  }
}

// Navigation (vereinfacht)
function initNavigation() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Mobile Menu schließen
        const nav = document.querySelector('.nav-links');
        if (nav) nav.classList.remove('open');
        
        // Smooth Scroll
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Hauptinitialisierung
function init() {
  console.log('🚀 Starte Website-Initialisierung...');
  
  try {
    // Portfolio laden
    renderPortfolio();
    
    // Filter initialisieren
    initFilters();
    
    // Navigation initialisieren
    initNavigation();
    
    // Mobile Menu initialisieren
    initMobileMenu();
    
    console.log('✅ Website erfolgreich initialisiert!');
    
  } catch (error) {
    console.error('❌ Fehler bei der Initialisierung:', error);
  }
}

// Globale Funktionen für onclick
window.showProjectDetails = showProjectDetails;

// DOM Ready Check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('📄 Portfolio-Script geladen!');
