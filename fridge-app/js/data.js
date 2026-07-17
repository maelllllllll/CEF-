const DataStore = {
  KEYS: {
    recipes: 'fridgeApp_recipes',
    fridge: 'fridgeApp_fridge',
    shopping: 'fridgeApp_shopping'
  },

  load(key) {
    try {
      const data = localStorage.getItem(this.KEYS[key]);
      return data ? JSON.parse(data) : this.defaults(key);
    } catch {
      return this.defaults(key);
    }
  },

  save(key, data) {
    localStorage.setItem(this.KEYS[key], JSON.stringify(data));
  },

  defaults(key) {
    const d = { recipes: [], fridge: [], shopping: [] };
    return d[key] || [];
  },

  exportAll() {
    return {
      recipes: this.load('recipes'),
      fridge: this.load('fridge'),
      shopping: this.load('shopping'),
      exportedAt: new Date().toISOString()
    };
  },

  importAll(data) {
    if (data.recipes) this.save('recipes', data.recipes);
    if (data.fridge) this.save('fridge', data.fridge);
    if (data.shopping) this.save('shopping', data.shopping);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
};

const CATEGORIES = {
  fridge: [
    { id: 'viande', label: 'Viande & Poisson', icon: '🥩', defaultDays: 2 },
    { id: 'produits-laitiers', label: 'Produits laitiers', icon: '🧀', defaultDays: 7 },
    { id: 'fruits-legumes', label: 'Fruits & Légumes', icon: '🥬', defaultDays: 5 },
    { id: 'boissons', label: 'Boissons', icon: '🥤', defaultDays: 30 },
    { id: 'condiments', label: 'Condiments & Sauces', icon: '🫙', defaultDays: 90 },
    { id: 'cereales', label: 'Céréales & Féculents', icon: '🍚', defaultDays: 180 },
    { id: 'surgeles', label: 'Surgelés', icon: '🧊', defaultDays: 90 },
    { id: 'autre', label: 'Autre', icon: '📦', defaultDays: 14 }
  ],
  recipe: [
    'Entrée', 'Plat', 'Dessert', 'Snack', 'Boisson',
    'Petit-déjeuner', 'Accompagnement', 'Sauce'
  ]
};

const SEASONS = {
  getMonth() { return new Date().getMonth(); },
  getCurrent() {
    const m = this.getMonth();
    if (m >= 2 && m <= 4) return 'printemps';
    if (m >= 5 && m <= 7) return 'été';
    if (m >= 8 && m <= 10) return 'automne';
    return 'hiver';
  },
  getSeasonalIngredients() {
    const seasonal = {
      printemps: ['asperges', 'petits pois', 'radis', 'fraises', 'artichauts', 'épinards', 'fèves'],
      été: ['tomates', 'courgettes', 'aubergines', 'poivrons', 'pêches', 'abricots', 'melons', 'pastèque'],
      automne: ['champignons', 'courge', 'potiron', 'châtaignes', 'pommes', 'poires', 'raisin', 'noix'],
      hiver: ['poireaux', 'choux', 'endives', 'navets', 'clémentines', 'oranges', 'topinambours', 'panais']
    };
    return seasonal[this.getCurrent()] || [];
  },
  getLabel() {
    const labels = { printemps: '🌸 Printemps', été: '☀️ Été', automne: '🍂 Automne', hiver: '❄️ Hiver' };
    return labels[this.getCurrent()];
  }
};
