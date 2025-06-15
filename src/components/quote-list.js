import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class QuoteList extends LitElement {
  static properties = {
    quotes: { type: Array },
    searchTerm: { type: String },
    filterCategory: { type: String },
    likedQuotes: { type: Object },
    isExpanded: { type: Boolean },
    showPopup: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    ul {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 1rem;
    }

    li {
      background: var(--card-background, #1E1E1E);
      padding: 1.5rem;
      border-radius: var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      transition: all 0.3s ease;
      animation: fadeIn 0.3s ease-out;
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
      position: relative;
      overflow: hidden;
    }

    li::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--accent-color, #9B2C2C);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    li:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    }

    li:hover::before {
      opacity: 1;
    }

    .category {
      display: inline-block;
      background: var(--accent-color, #9B2C2C);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(155, 44, 44, 0.2);
    }

    .quote-link {
      text-decoration: none;
      color: inherit;
      display: block;
      transition: all 0.2s;
    }

    .quote-link:hover {
      transform: translateX(4px);
    }

    .quote {
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      color: var(--text-color, #E1E1E1);
      font-style: italic;
      position: relative;
      padding-left: 0;
    }

    .quote::before {
      content: '"';
      position: absolute;
      left: 0;
      top: -0.5rem;
      font-size: 2rem;
      color: var(--accent-color, #9B2C2C);
      opacity: 0.5;
    }

    .quote-link:hover .quote {
      color: var(--accent-color, #9B2C2C);
    }

    .source-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent-color, #9B2C2C);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      background: rgba(155, 44, 44, 0.1);
    }

    .source-link:hover {
      background: rgba(155, 44, 44, 0.2);
      transform: translateX(4px);
    }

    p.placeholder {
      text-align: center;
      color: var(--text-secondary, #A0A0A0);
      padding: 2rem;
      background: var(--card-background, #1E1E1E);
      border-radius: var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      animation: fadeIn 0.3s ease-out;
      border: var(--card-border, 1px solid rgba(49, 151, 149, 0.2));
    }

    .quote-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .like-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: var(--text-secondary, #A0A0A0);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .like-button:hover {
      background: rgba(155, 44, 44, 0.1);
      color: var(--accent-color, #9B2C2C);
    }

    .like-button.liked {
      color: var(--accent-color, #9B2C2C);
    }

    .like-button svg {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.2s;
    }

    .like-button:hover svg {
      transform: scale(1.1);
    }

    .like-count {
      font-size: 0.875rem;
      color: var(--text-secondary, #A0A0A0);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .accordion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--card-background, #1E1E1E);
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 1rem;
    }

    .accordion-header:hover {
      background: var(--card-background-hover, #252525);
    }

    .accordion-title {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-color, #E1E1E1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .accordion-icon {
      transition: transform 0.2s;
    }

    .accordion-icon.expanded {
      transform: rotate(180deg);
    }

    .quote-content {
      animation: slideDown 0.2s ease-out;
    }

    .search-filters {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--card-background, #1E1E1E);
      border-radius: var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color, #333);
      border-radius: 6px;
      background: var(--input-background, #2A2A2A);
      color: var(--text-color, #E1E1E1);
      font-size: 1rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent-color, #9B2C2C);
      box-shadow: 0 0 0 2px rgba(155, 44, 44, 0.2);
    }

    .category-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color, #333);
      border-radius: 1rem;
      background: var(--input-background, #2A2A2A);
      color: var(--text-color, #E1E1E1);
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .category-button:hover {
      background: var(--accent-color, #9B2C2C);
      border-color: var(--accent-color, #9B2C2C);
    }

    .category-button.active {
      background: var(--accent-color, #9B2C2C);
      border-color: var(--accent-color, #9B2C2C);
      color: white;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hidden {
      display: none;
    }

    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .popup-content {
      background: var(--card-background, #1E1E1E);
      padding: 1.5rem;
      border-radius: var(--border-radius, 12px);
      max-width: 400px;
      width: 90%;
      position: relative;
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
    }

    .popup-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      color: var(--text-secondary, #A0A0A0);
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
      transition: color 0.2s;
    }

    .popup-close:hover {
      color: var(--accent-color, #9B2C2C);
    }

    .popup-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--accent-color, #9B2C2C);
      margin-bottom: 1rem;
    }

    .popup-text {
      color: var(--text-color, #E1E1E1);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .popup-text p {
      margin-bottom: 0.75rem;
    }

    .popup-text p:last-child {
      margin-bottom: 0;
    }
  `;

  constructor() {
    super();
    this.quotes = [];
    this.searchTerm = '';
    this.filterCategory = undefined;
    this.likedQuotes = {};
    this.isExpanded = true;
    this.showPopup = false;
    this._loadLikedQuotes();
    this._load();
    this.addEventListener('quote-added', () => this._load());
  }

  _loadLikedQuotes() {
    const stored = localStorage.getItem('likedQuotes');
    if (stored) {
      this.likedQuotes = JSON.parse(stored);
    }
  }

  _saveLikedQuotes() {
    localStorage.setItem('likedQuotes', JSON.stringify(this.likedQuotes));
  }

  async _toggleLike(recordId) {
    const isLiked = this.likedQuotes[recordId];
    const newLikes = (this.quotes.find(q => q.id === recordId)?.fields.Likes || 0) + (isLiked ? -1 : 1);
    
    try {
      const res = await fetch('/.netlify/functions/airtable', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recordId,
          likes: newLikes
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update likes');
      }

      // Update local state
      if (isLiked) {
        delete this.likedQuotes[recordId];
      } else {
        this.likedQuotes[recordId] = true;
      }
      this._saveLikedQuotes();

      // Update quote in the list
      this.quotes = this.quotes.map(quote => {
        if (quote.id === recordId) {
          return {
            ...quote,
            fields: {
              ...quote.fields,
              Likes: newLikes
            }
          };
        }
        return quote;
      });
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  }

  get filteredQuotes() {
    return this.quotes.filter(record => {
      const { Quote, Category, SourceLink } = record.fields;
      const textLower = Quote.toLowerCase() + ' ' + SourceLink.toLowerCase();
      const matchesText = textLower.includes(this.searchTerm);
      let matchesCategory = true;
      if (this.filterCategory && this.filterCategory !== 'ALL') {
        matchesCategory = Category === this.filterCategory;
      }
      return matchesText && matchesCategory;
    });
  }

  async _load() {
    try {
      const res = await fetch('/.netlify/functions/airtable');
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw errorData;
      }
      const { records } = await res.json();
      this.quotes = records;
    } catch (err) {
      console.error('Load error:', err);
    }
  }

  _toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }

  _showPopup() {
    this.showPopup = true;
  }

  _hidePopup() {
    this.showPopup = false;
  }

  render() {
    if (this.quotes.length === 0) {
      return html`<p class="placeholder">Loading quotes...</p>`;
    }
    
    return html`
      <div class="accordion">
        <div class="accordion-header" @click=${this._toggleAccordion}>
          <div class="accordion-title">
            <svg class="accordion-icon ${this.isExpanded ? 'expanded' : ''}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            Find Quotes
          </div>
          <button class="info-button" @click=${e => { e.stopPropagation(); this._showPopup(); }}>ⓘ</button>
        </div>
        <div class="quote-content ${this.isExpanded ? '' : 'hidden'}">
          <input 
            type="text" 
            placeholder="Search quotes..." 
            .value=${this.searchTerm}
            @input=${e => this.searchTerm = e.target.value}
          />
          <div class="category-list">
            <button 
              class="category-button ${!this.filterCategory ? 'active' : ''}"
              @click=${() => this.filterCategory = undefined}
            >
              All
            </button>
            ${['Philosophy', 'Religion', 'Literature', 'History', 'Science', 'Art', 'Other'].map(category => html`
              <button 
                class="category-button ${this.filterCategory === category ? 'active' : ''}"
                @click=${() => this.filterCategory = category}
              >
                ${category}
              </button>
            `)}
          </div>
          ${!this.filterCategory && !this.searchTerm 
            ? html`<p class="placeholder">Please select a category or search to view quotes.</p>`
            : this.filteredQuotes.length === 0 
              ? html`<p class="placeholder">No quotes found matching your criteria.</p>`
              : html`
                <ul>
                  ${this.filteredQuotes.map(record => html`
                    <li>
                      <span class="category">${record.fields.Category}</span>
                      ${record.fields.SourceLink && record.fields.SourceLink !== 'No source provided' 
                        ? html`<a href="${record.fields.SourceLink}" target="_blank" class="quote-link">
                            <p class="quote">${record.fields.Quote}</p>
                          </a>`
                        : html`<p class="quote">${record.fields.Quote}</p>`
                      }
                      <div class="quote-actions">
                        <button 
                          class="like-button ${this.likedQuotes[record.id] ? 'liked' : ''}"
                          @click=${() => this._toggleLike(record.id)}
                          title="${this.likedQuotes[record.id] ? 'Unlike' : 'Like'} this quote"
                        >
                          <svg viewBox="0 0 24 24" fill="${this.likedQuotes[record.id] ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          ${record.fields.Likes || 0}
                        </button>
                      </div>
                    </li>
                  `)}
                </ul>
              `
          }
        </div>
      </div>
      ${this.showPopup ? html`
        <div class="popup-overlay" @click=${this._hidePopup}>
          <div class="popup-content" @click=${e => e.stopPropagation()}>
            <button class="popup-close" @click=${this._hidePopup}>×</button>
            <div class="popup-title">About Quotes</div>
            <div class="popup-text">
              <p>This section contains a collection of quotes about death, mortality, and the meaning of life. You can search through them or filter by category.</p>
              <p>Click on a quote to visit its source, or use the heart icon to save your favorites.</p>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('quote-list', QuoteList);