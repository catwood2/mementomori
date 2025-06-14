import { LitElement, html, css } from 'https://unpkg.com/lit?module';
import { AIRTABLE_BASE_ID, AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME } from '../config.js';

class QuoteList extends LitElement {
  static properties = {
    quotes: { type: Array },
    searchTerm: { type: String },
    filterCategory: { type: String }
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
  `;

  constructor() {
    super();
    this.quotes = [];
    this.searchTerm = '';
    this.filterCategory = undefined;
    this._load();
    this.addEventListener('quote-added', () => this._load());
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
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
      const res = await fetch(`${url}?sort[0][field]=CreatedAt&sort[0][direction]=desc`, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
      });
      if (!res.ok) throw await res.json();
      const { records } = await res.json();
      this.quotes = records;
    } catch (err) {
      console.error('Load error:', err);
    }
  }

  render() {
    if (this.quotes.length === 0) {
      return html`<p class="placeholder">Loading quotes...</p>`;
    }
    
    if (!this.filterCategory && !this.searchTerm) {
      return html`<p class="placeholder">Please select a category or search to view quotes.</p>`;
    }
    
    if (this.filteredQuotes.length === 0) {
      return html`<p class="placeholder">No quotes found matching your criteria.</p>`;
    }

    return html`
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
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('quote-list', QuoteList);