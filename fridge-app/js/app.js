document.addEventListener('DOMContentLoaded', () => {
  const app = new FridgeApp();
  app.init();
});

class FridgeApp {
  constructor() {
    this.currentTab = 'recipes';
  }

  init() {
    this.bindNav();
    this.renderAll();
    this.bindGlobalActions();
    this.checkExpirations();
    this.showTab('recipes');
  }

  bindNav() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.showTab(tab.dataset.tab);
      });
    });
  }

  showTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
    this.renderTab(tabId);
  }

  renderAll() {
    this.renderRecipes();
    this.renderFridge();
    this.renderShopping();
    this.renderSuggestions();
  }

  renderTab(tabId) {
    const renderers = {
      recipes: () => this.renderRecipes(),
      fridge: () => this.renderFridge(),
      shopping: () => this.renderShopping(),
      suggestions: () => this.renderSuggestions()
    };
    if (renderers[tabId]) renderers[tabId]();
  }

  // ── RECIPES ──

  renderRecipes() {
    const recipes = DataStore.load('recipes');
    const container = document.getElementById('recipes-list');
    const count = document.getElementById('recipes-count');
    count.textContent = `${recipes.length} recette${recipes.length !== 1 ? 's' : ''}`;

    if (recipes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📖</div>
          <h3>Aucune recette</h3>
          <p>Ajoute ta premiere recette depuis Instagram ou manuellement.</p>
        </div>`;
      return;
    }

    const search = document.getElementById('recipe-search')?.value?.toLowerCase() || '';
    const filtered = recipes.filter(r =>
      !search || r.name.toLowerCase().includes(search) ||
      r.ingredients?.some(i => i.name.toLowerCase().includes(search)) ||
      r.tags?.some(t => t.toLowerCase().includes(search))
    );

    container.innerHTML = filtered.map(r => `
      <div class="recipe-card" data-id="${r.id}">
        <div class="recipe-header">
          <h3 class="recipe-name">${this.escHtml(r.name)}</h3>
          ${r.source ? `<a href="${this.escHtml(r.source)}" target="_blank" class="recipe-source" title="Voir sur Instagram">📸</a>` : ''}
        </div>
        ${r.tags?.length ? `<div class="recipe-tags">${r.tags.map(t => `<span class="tag">${this.escHtml(t)}</span>`).join('')}</div>` : ''}
        <div class="recipe-meta">
          ${r.servings ? `<span>🍽 ${r.servings} pers.</span>` : ''}
          ${r.prepTime ? `<span>⏱ ${r.prepTime} min</span>` : ''}
          ${r.addedAt ? `<span>📅 ${new Date(r.addedAt).toLocaleDateString('fr-FR')}</span>` : ''}
        </div>
        ${r.ingredients?.length ? `
          <div class="recipe-ingredients">
            <strong>Ingredients :</strong>
            <ul>${r.ingredients.map(i => `<li>${this.escHtml(i.quantity || '')} ${this.escHtml(i.unit || '')} ${this.escHtml(i.name)}</li>`).join('')}</ul>
          </div>` : ''}
        ${r.steps ? `
          <div class="recipe-steps collapsed" onclick="this.classList.toggle('collapsed')">
            <strong>Preparation ▾</strong>
            <div class="steps-content">${this.escHtml(r.steps).replace(/\n/g, '<br>')}</div>
          </div>` : ''}
        <div class="recipe-actions">
          <button class="btn-sm btn-primary" onclick="app.addRecipeToShopping('${r.id}')">🛒 Liste de courses</button>
          <button class="btn-sm btn-danger" onclick="app.deleteRecipe('${r.id}')">Supprimer</button>
        </div>
      </div>
    `).join('');
  }

  showAddRecipeModal() {
    document.getElementById('modal-add-recipe').classList.add('open');
    document.getElementById('recipe-form').reset();
    document.getElementById('ingredients-list').innerHTML = '';
    this.addIngredientRow();
  }

  closeModal(id) {
    document.getElementById(id).classList.remove('open');
  }

  addIngredientRow() {
    const list = document.getElementById('ingredients-list');
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
      <input type="text" placeholder="Quantite" class="ing-qty" />
      <input type="text" placeholder="Unite" class="ing-unit" />
      <input type="text" placeholder="Ingredient" class="ing-name" required />
      <button type="button" class="btn-icon" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(row);
    row.querySelector('.ing-name').focus();
  }

  saveRecipe() {
    const form = document.getElementById('recipe-form');
    const name = document.getElementById('r-name').value.trim();
    if (!name) return;

    const ingredients = [];
    document.querySelectorAll('.ingredient-row').forEach(row => {
      const ingName = row.querySelector('.ing-name').value.trim();
      if (ingName) {
        ingredients.push({
          name: ingName,
          quantity: row.querySelector('.ing-qty').value.trim(),
          unit: row.querySelector('.ing-unit').value.trim()
        });
      }
    });

    const recipe = {
      id: DataStore.generateId(),
      name,
      source: document.getElementById('r-source').value.trim(),
      tags: document.getElementById('r-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      servings: document.getElementById('r-servings').value || null,
      prepTime: document.getElementById('r-preptime').value || null,
      ingredients,
      steps: document.getElementById('r-steps').value.trim(),
      addedAt: new Date().toISOString()
    };

    const recipes = DataStore.load('recipes');
    recipes.push(recipe);
    DataStore.save('recipes', recipes);
    this.closeModal('modal-add-recipe');
    this.renderRecipes();
    this.showToast('Recette ajoutee !');
  }

  deleteRecipe(id) {
    if (!confirm('Supprimer cette recette ?')) return;
    const recipes = DataStore.load('recipes').filter(r => r.id !== id);
    DataStore.save('recipes', recipes);
    this.renderRecipes();
    this.showToast('Recette supprimee');
  }

  addRecipeToShopping(recipeId) {
    const recipes = DataStore.load('recipes');
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe?.ingredients?.length) {
      this.showToast('Pas d\'ingredients dans cette recette');
      return;
    }

    const shopping = DataStore.load('shopping');
    const fridgeItems = DataStore.load('fridge').map(i => i.name.toLowerCase());

    recipe.ingredients.forEach(ing => {
      const alreadyInList = shopping.some(s => s.name.toLowerCase() === ing.name.toLowerCase() && !s.checked);
      const inFridge = fridgeItems.includes(ing.name.toLowerCase());
      if (!alreadyInList && !inFridge) {
        shopping.push({
          id: DataStore.generateId(),
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          fromRecipe: recipe.name,
          checked: false,
          addedAt: new Date().toISOString()
        });
      }
    });

    DataStore.save('shopping', shopping);
    this.showToast(`Ingredients ajoutes a la liste (${recipe.name})`);
    if (this.currentTab === 'shopping') this.renderShopping();
  }

  // ── FRIDGE ──

  renderFridge() {
    const items = DataStore.load('fridge');
    const container = document.getElementById('fridge-list');
    const count = document.getElementById('fridge-count');
    count.textContent = `${items.length} article${items.length !== 1 ? 's' : ''}`;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🧊</div>
          <h3>Frigo vide</h3>
          <p>Ajoute ce que tu as achete pour suivre ton inventaire.</p>
        </div>`;
      return;
    }

    const grouped = {};
    items.forEach(item => {
      const cat = item.category || 'autre';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    container.innerHTML = Object.entries(grouped).map(([catId, catItems]) => {
      const cat = CATEGORIES.fridge.find(c => c.id === catId) || { label: catId, icon: '📦' };
      return `
        <div class="fridge-category">
          <h3 class="category-title">${cat.icon} ${cat.label}</h3>
          <div class="fridge-items">
            ${catItems.map(item => {
              const status = this.getExpirationStatus(item);
              return `
                <div class="fridge-item ${status.class}">
                  <div class="item-info">
                    <span class="item-name">${this.escHtml(item.name)}</span>
                    ${item.quantity ? `<span class="item-qty">${this.escHtml(item.quantity)} ${this.escHtml(item.unit || '')}</span>` : ''}
                  </div>
                  <div class="item-expiry">
                    <span class="expiry-badge ${status.class}">${status.label}</span>
                    ${item.expiresAt ? `<span class="expiry-date">${new Date(item.expiresAt).toLocaleDateString('fr-FR')}</span>` : ''}
                  </div>
                  <div class="item-actions">
                    <button class="btn-icon" onclick="app.useFridgeItem('${item.id}')" title="Utilise">✓</button>
                    <button class="btn-icon btn-danger" onclick="app.deleteFridgeItem('${item.id}')" title="Supprimer">✕</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');
  }

  getExpirationStatus(item) {
    if (!item.expiresAt) return { class: 'status-ok', label: 'OK' };
    const now = new Date();
    const exp = new Date(item.expiresAt);
    const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { class: 'status-expired', label: `Expire depuis ${Math.abs(daysLeft)}j` };
    if (daysLeft === 0) return { class: 'status-urgent', label: 'Aujourd\'hui !' };
    if (daysLeft === 1) return { class: 'status-urgent', label: 'Demain' };
    if (daysLeft <= 3) return { class: 'status-warning', label: `${daysLeft}j restants` };
    return { class: 'status-ok', label: `${daysLeft}j` };
  }

  showAddFridgeModal() {
    document.getElementById('modal-add-fridge').classList.add('open');
    document.getElementById('fridge-form').reset();
    const catSelect = document.getElementById('f-category');
    catSelect.innerHTML = CATEGORIES.fridge.map(c =>
      `<option value="${c.id}">${c.icon} ${c.label}</option>`
    ).join('');
    this.updateDefaultExpiry();
  }

  updateDefaultExpiry() {
    const catId = document.getElementById('f-category').value;
    const cat = CATEGORIES.fridge.find(c => c.id === catId);
    if (cat) {
      const date = new Date();
      date.setDate(date.getDate() + cat.defaultDays);
      document.getElementById('f-expires').value = date.toISOString().split('T')[0];
    }
  }

  saveFridgeItem() {
    const name = document.getElementById('f-name').value.trim();
    if (!name) return;

    const item = {
      id: DataStore.generateId(),
      name,
      category: document.getElementById('f-category').value,
      quantity: document.getElementById('f-quantity').value.trim(),
      unit: document.getElementById('f-unit').value.trim(),
      purchasedAt: document.getElementById('f-purchased').value || new Date().toISOString().split('T')[0],
      expiresAt: document.getElementById('f-expires').value || null,
      addedAt: new Date().toISOString()
    };

    const fridge = DataStore.load('fridge');
    fridge.push(item);
    DataStore.save('fridge', fridge);
    this.closeModal('modal-add-fridge');
    this.renderFridge();
    this.showToast('Article ajoute au frigo !');
  }

  useFridgeItem(id) {
    const fridge = DataStore.load('fridge').filter(i => i.id !== id);
    DataStore.save('fridge', fridge);
    this.renderFridge();
    this.showToast('Article utilise');
  }

  deleteFridgeItem(id) {
    const fridge = DataStore.load('fridge').filter(i => i.id !== id);
    DataStore.save('fridge', fridge);
    this.renderFridge();
  }

  checkExpirations() {
    const items = DataStore.load('fridge');
    const expiring = items.filter(item => {
      if (!item.expiresAt) return false;
      const daysLeft = Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0 && daysLeft <= 2;
    });

    const alertContainer = document.getElementById('expiry-alerts');
    if (expiring.length === 0) {
      alertContainer.innerHTML = '';
      return;
    }

    alertContainer.innerHTML = `
      <div class="alert alert-warning">
        <strong>⚠️ Attention !</strong> ${expiring.length} article${expiring.length > 1 ? 's' : ''}
        expire${expiring.length > 1 ? 'nt' : ''} bientot :
        <ul>${expiring.map(i => `<li><strong>${this.escHtml(i.name)}</strong> — ${this.getExpirationStatus(i).label}</li>`).join('')}</ul>
      </div>
    `;
  }

  // ── SHOPPING LIST ──

  renderShopping() {
    const items = DataStore.load('shopping');
    const container = document.getElementById('shopping-list');
    const count = document.getElementById('shopping-count');
    const unchecked = items.filter(i => !i.checked);
    count.textContent = `${unchecked.length} article${unchecked.length !== 1 ? 's' : ''} restant${unchecked.length !== 1 ? 's' : ''}`;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h3>Liste vide</h3>
          <p>Ajoute des ingredients depuis une recette ou manuellement.</p>
        </div>`;
      return;
    }

    const sortedItems = [...items].sort((a, b) => (a.checked ? 1 : 0) - (b.checked ? 1 : 0));

    container.innerHTML = sortedItems.map(item => `
      <div class="shopping-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
        <label class="checkbox-label">
          <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="app.toggleShoppingItem('${item.id}')" />
          <span class="item-text">
            ${item.quantity ? `<strong>${this.escHtml(item.quantity)} ${this.escHtml(item.unit || '')}</strong>` : ''}
            ${this.escHtml(item.name)}
          </span>
          ${item.fromRecipe ? `<span class="from-recipe">📖 ${this.escHtml(item.fromRecipe)}</span>` : ''}
        </label>
        <button class="btn-icon" onclick="app.deleteShoppingItem('${item.id}')">✕</button>
      </div>
    `).join('');
  }

  addShoppingItem() {
    const input = document.getElementById('shopping-input');
    const name = input.value.trim();
    if (!name) return;

    const shopping = DataStore.load('shopping');
    shopping.push({
      id: DataStore.generateId(),
      name,
      quantity: '',
      unit: '',
      fromRecipe: null,
      checked: false,
      addedAt: new Date().toISOString()
    });
    DataStore.save('shopping', shopping);
    input.value = '';
    this.renderShopping();
  }

  toggleShoppingItem(id) {
    const shopping = DataStore.load('shopping');
    const item = shopping.find(i => i.id === id);
    if (item) item.checked = !item.checked;
    DataStore.save('shopping', shopping);
    this.renderShopping();
  }

  deleteShoppingItem(id) {
    const shopping = DataStore.load('shopping').filter(i => i.id !== id);
    DataStore.save('shopping', shopping);
    this.renderShopping();
  }

  clearCheckedShopping() {
    const shopping = DataStore.load('shopping').filter(i => !i.checked);
    DataStore.save('shopping', shopping);
    this.renderShopping();
    this.showToast('Articles coches supprimes');
  }

  moveCheckedToFridge() {
    const shopping = DataStore.load('shopping');
    const checked = shopping.filter(i => i.checked);
    const fridge = DataStore.load('fridge');

    checked.forEach(item => {
      fridge.push({
        id: DataStore.generateId(),
        name: item.name,
        category: 'autre',
        quantity: item.quantity,
        unit: item.unit,
        purchasedAt: new Date().toISOString().split('T')[0],
        expiresAt: null,
        addedAt: new Date().toISOString()
      });
    });

    const remaining = shopping.filter(i => !i.checked);
    DataStore.save('shopping', remaining);
    DataStore.save('fridge', fridge);
    this.renderShopping();
    this.renderFridge();
    this.showToast(`${checked.length} article${checked.length > 1 ? 's' : ''} ajoute${checked.length > 1 ? 's' : ''} au frigo`);
  }

  // ── SUGGESTIONS ──

  renderSuggestions() {
    const container = document.getElementById('suggestions-content');
    const fridge = DataStore.load('fridge');
    const recipes = DataStore.load('recipes');
    const season = SEASONS.getCurrent();
    const seasonLabel = SEASONS.getLabel();
    const seasonalIngredients = SEASONS.getSeasonalIngredients();

    let html = `<div class="season-banner"><span class="season-label">${seasonLabel}</span>
      <p>Ingredients de saison : ${seasonalIngredients.join(', ')}</p></div>`;

    // Expiring items suggestions
    const expiring = fridge.filter(item => {
      if (!item.expiresAt) return false;
      const daysLeft = Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0 && daysLeft <= 3;
    });

    if (expiring.length > 0) {
      html += `<div class="suggestion-section">
        <h3>🔥 A cuisiner en priorite</h3>
        <p>Ces ingredients expirent bientot :</p>
        <div class="expiring-items">
          ${expiring.map(i => `<span class="expiry-chip">${this.escHtml(i.name)} (${this.getExpirationStatus(i).label})</span>`).join('')}
        </div>`;

      const matchingRecipes = recipes.filter(r =>
        r.ingredients?.some(ing =>
          expiring.some(e => e.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(e.name.toLowerCase()))
        )
      );

      if (matchingRecipes.length > 0) {
        html += `<div class="suggested-recipes">
          ${matchingRecipes.map(r => `<div class="suggestion-card" onclick="app.showTab('recipes')">
            <strong>${this.escHtml(r.name)}</strong>
            <span class="match-info">Utilise : ${r.ingredients.filter(ing => expiring.some(e => e.name.toLowerCase().includes(ing.name.toLowerCase()))).map(i => i.name).join(', ')}</span>
          </div>`).join('')}
        </div>`;
      }
      html += `</div>`;
    }

    // Recipes you can make now
    if (fridge.length > 0 && recipes.length > 0) {
      const fridgeNames = fridge.map(i => i.name.toLowerCase());
      const canMake = recipes.map(r => {
        if (!r.ingredients?.length) return null;
        const matched = r.ingredients.filter(ing =>
          fridgeNames.some(f => f.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(f))
        );
        const ratio = matched.length / r.ingredients.length;
        return { recipe: r, matched: matched.length, total: r.ingredients.length, ratio };
      }).filter(r => r && r.ratio >= 0.5).sort((a, b) => b.ratio - a.ratio);

      if (canMake.length > 0) {
        html += `<div class="suggestion-section">
          <h3>✅ Recettes faisables maintenant</h3>
          <div class="suggested-recipes">
            ${canMake.map(m => `<div class="suggestion-card">
              <strong>${this.escHtml(m.recipe.name)}</strong>
              <span class="match-info">${m.matched}/${m.total} ingredients disponibles (${Math.round(m.ratio * 100)}%)</span>
            </div>`).join('')}
          </div>
        </div>`;
      }
    }

    // Seasonal suggestions
    html += `<div class="suggestion-section">
      <h3>${seasonLabel} Idees de saison</h3>
      <p>Voici des idees de plats pour cette saison :</p>
      <div class="season-ideas">${this.getSeasonalRecipeIdeas(season)}</div>
    </div>`;

    if (fridge.length === 0 && recipes.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-icon">💡</div>
        <h3>Ajoute des recettes et remplis ton frigo</h3>
        <p>Les suggestions apparaitront ici quand tu auras des recettes et des ingredients.</p>
      </div>`;
    }

    container.innerHTML = html;
  }

  getSeasonalRecipeIdeas(season) {
    const ideas = {
      printemps: ['Risotto aux asperges', 'Salade de fraises', 'Quiche aux epinards', 'Tarte aux petits pois'],
      été: ['Ratatouille', 'Gaspacho', 'Salade nicoise', 'Tarte aux tomates', 'Sorbet peche'],
      automne: ['Veloute de potiron', 'Risotto aux champignons', 'Tarte aux pommes', 'Gratin de courge'],
      hiver: ['Pot-au-feu', 'Gratin dauphinois', 'Soupe de poireaux', 'Blanquette de veau', 'Fondant au chocolat']
    };
    return (ideas[season] || []).map(i => `<span class="season-idea-chip">${i}</span>`).join('');
  }

  // ── IMPORT / EXPORT ──

  bindGlobalActions() {
    window.app = this;

    document.getElementById('btn-export')?.addEventListener('click', () => this.exportData());
    document.getElementById('btn-import')?.addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file')?.addEventListener('change', (e) => this.importData(e));

    document.getElementById('recipe-search')?.addEventListener('input', () => this.renderRecipes());

    document.getElementById('shopping-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addShoppingItem();
    });

    document.getElementById('f-category')?.addEventListener('change', () => this.updateDefaultExpiry());
  }

  exportData() {
    const data = DataStore.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frigo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Donnees exportees !');
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        DataStore.importAll(data);
        this.renderAll();
        this.checkExpirations();
        this.showToast('Donnees importees !');
      } catch {
        this.showToast('Erreur : fichier invalide');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // ── UTILS ──

  escHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}
