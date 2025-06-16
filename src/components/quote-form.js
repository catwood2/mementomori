import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class QuoteForm extends LitElement {
  static properties = {
    isExpanded: { type: Boolean },
    showSuccess: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
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

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--card-background, #1E1E1E);
      padding: 1.5rem;
      border-radius: 0 0 var(--border-radius, 12px) var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
      border-top: none;
      margin-top: -1px;
      animation: slideDown 0.2s ease-out;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary, #A0A0A0);
    }

    textarea,
    select,
    input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid rgba(155, 44, 44, 0.3);
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.2s;
      font-family: inherit;
      background: var(--primary-color, #1A1A1A);
      color: var(--text-color, #E1E1E1);
    }

    textarea:focus,
    select:focus,
    input:focus {
      outline: none;
      border-color: var(--accent-color, #9B2C2C);
      box-shadow: 0 0 0 3px rgba(155, 44, 44, 0.2);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B2C2C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      padding-right: 2.5rem;
    }

    button {
      align-self: flex-end;
      background: var(--accent-color, #9B2C2C);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(155, 44, 44, 0.2);
    }

    button:hover {
      transform: translateY(-1px);
      background-color: #B83280;
      box-shadow: 0 4px 8px rgba(155, 44, 44, 0.3);
    }

    button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(155, 44, 44, 0.2);
    }

    .button-icon {
      width: 16px;
      height: 16px;
    }

    .success-message {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-color, #9B2C2C);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(155, 44, 44, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .success-message.visible {
      opacity: 1;
      visibility: visible;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translate(-50%, 1rem);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    }

    .success-icon {
      width: 20px;
      height: 20px;
    }

    .hidden {
      display: none;
    }
  `;

  constructor() {
    super();
    this.isExpanded = true;
    this.showSuccess = false;
  }

  _toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }

  render() {
    return html`
      <div class="accordion">
        <div class="accordion-header" @click=${this._toggleAccordion}>
          <div class="accordion-title">
            <svg class="accordion-icon ${this.isExpanded ? 'expanded' : ''}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            Add a Quote
          </div>
        </div>
        <form @submit=${this._onSubmit} class=${this.isExpanded ? '' : 'hidden'}>
          <div class="form-group">
            <label for="quote">Quote</label>
            <textarea id="quote" name="quote" required placeholder="Enter your quote here..."></textarea>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" required>
              <option value="">Select a category</option>
              <option value="Life">Life</option>
              <option value="Death">Death</option>
              <option value="Humor">Humor</option>
              <option value="Motivation">Motivation</option>
            </select>
          </div>
          <div class="form-group">
            <label for="sourceLink">Source Link (optional)</label>
            <input type="url" id="sourceLink" name="sourceLink" placeholder="https://...">
          </div>
          <button type="submit">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Quote
          </button>
        </form>
        <div class="success-message ${this.showSuccess ? 'visible' : ''}">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Quote added successfully!
        </div>
      </div>
    `;
  }

  async _onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const quote = form.quote.value.trim();
    const category = form.category.value;
    const sourceLink = form.sourceLink.value.trim();
    const author = localStorage.getItem('userHandle') || 'Anonymous';

    if (!quote) {
      alert('Please enter a quote');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Quote: quote,
            Category: category,
            SourceLink: sourceLink,
            Author: author,
            Content: quote,
            Likes: 0,
            Replies: 0,
            Retweets: 0,
            CreatedAt: new Date().toISOString()
          }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit quote');
      }

      form.reset();
      this.dispatchEvent(new CustomEvent('quote-submitted', {
        bubbles: true,
        composed: true
      }));
    } catch (err) {
      console.error('Error submitting quote:', err);
      alert('Failed to submit quote. Please try again.');
    }
  }

  _showSuccess() {
    this.showSuccess = true;
    this.requestUpdate();
    
    setTimeout(() => {
      this.showSuccess = false;
      this.requestUpdate();
    }, 3000);
  }

  _showError(message) {
    alert(`Error: ${message}\n\nPlease check the console for more details.`);
  }
}

customElements.define('quote-form', QuoteForm);