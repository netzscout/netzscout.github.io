// Moderne Etsy API Integration
class EtsyProductManager {
  constructor() {
          this.apiKey = 'Ylod13esnlkgzlk3o92r8cr19'; // Wird benötigt
    this.shopId = 'BastelglueckbyReni'; // Ihr Shop-Name
    this.fallbackProducts = this.getFallbackProducts();
  }

  // Automatisches Laden von Etsy
  async loadEtsyProducts() {
    try {
      const response = await fetch(`https://openapi.etsy.com/v3/shops/${this.shopId}/listings/active`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return this.formatEtsyProducts(data.results);
      } else {
        throw new Error('Etsy API nicht verfügbar');
      }
    } catch (error) {
      console.log('Fallback auf manuelle Produkte:', error);
      return this.fallbackProducts;
    }
  }

  // Manuelle Fallback-Produkte (die Sie pflegen)
  getFallbackProducts() {
    return [
      {
        id: 'etsy-1',
        title: 'Frühlings-Deko Vorlagen Set',
        description: 'Wunderschöne digitale Vorlagen für Frühlingsdekorationen',
        price: '€8,99',
        image: 'files/produkt1.jpg',
        category: 'templates',
        tags: ['Frühling', 'Digital', 'Deko'],
        etsyUrl: 'https://bastelglueckbyreni.etsy.com/listing/YOUR_LISTING_ID',
        inStock: true
      },
      {
        id: 'etsy-2', 
        title: 'DIY Vintage Bilderrahmen Anleitung',
        description: 'Schritt-für-Schritt Anleitung für selbstgemachte Vintage-Rahmen',
        price: '€12,50',
        image: 'files/produkt2.jpg',
        category: 'diy',
        tags: ['Vintage', 'DIY', 'Anleitung'],
        etsyUrl: 'https://bastelglueckbyreni.etsy.com/listing/YOUR_LISTING_ID_2',
        inStock: true
      }
      // Weitere Produkte...
    ];
  }

  // Etsy-Daten formatieren
  formatEtsyProducts(etsyProducts) {
    return etsyProducts.map(product => ({
      id: `etsy-${product.listing_id}`,
      title: product.title,
      description: product.description.substring(0, 150) + '...',
      price: `€${product.price}`,
      image: product.images[0]?.url_fullxfull || 'files/placeholder.jpg',
      category: this.categorizeProduct(product.tags),
      tags: product.tags.slice(0, 3),
      etsyUrl: product.url,
      inStock: product.quantity > 0
    }));
  }

  categorizeProduct(tags) {
    if (tags.some(tag => tag.includes('digital') || tag.includes('template'))) {
      return 'templates';
    }
    if (tags.some(tag => tag.includes('diy') || tag.includes('anleitung'))) {
      return 'diy';
    }
    if (tags.some(tag => tag.includes('weihnacht') || tag.includes('ostern'))) {
      return 'seasonal';
    }
    return 'diy';
  }
}
