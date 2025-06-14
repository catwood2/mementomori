import { LitElement, html, css } from 'https://unpkg.com/lit?module';
import { AIRTABLE_BASE_ID, AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME } from '../config.js';

class QuoteForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
  `;

  static properties = {
    showSuccess: { type: Boolean }
  };

  constructor() {
    super();
    this.showSuccess = false;
  }

  render() {
    return html`
      <form @submit=${this._onSubmit} novalidate>
        <div class="form-group">
          <label for="quote">Quote</label>
          <textarea id="quote" name="quote" placeholder="Hard choices, easy life. Easy choices, hard life." required></textarea>
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="" disabled selected>Select a category</option>
            <option value="Life">Life</option>
            <option value="Death">Death</option>
            <option value="Humor">Humor</option>
            <option value="Motivation">Motivation</option>
          </select>
        </div>

        <div class="form-group">
          <label for="link">Source Link</label>
          <input type="url" id="link" name="link" placeholder="https://example.com" />
        </div>

        <button type="submit">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Add Quote
        </button>
      </form>

      <div class="success-message ${this.showSuccess ? 'visible' : ''}">
        <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Quote added successfully!
      </div>
    `;
  }

  async _onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    const payload = {
      fields: {
        Quote: form.quote.value,
        Category: form.category.value,
        SourceLink: form.link.value || 'No source provided'
      }
    };

    try {
      const res = await fetch('/.netlify/functions/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw error;
      }

      form.reset();
      this._showSuccess();
      this.dispatchEvent(new CustomEvent('quote-added'));
    } catch (err) {
      console.error('Airtable error:', err);
      this._showError();
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

  _showError() {
    alert('Could not save quote. See DevTools → Network & Console for details.');
  }
}

customElements.define('quote-form', QuoteForm);