import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class UserHandle extends LitElement {
  static properties = {
    handle: { type: String },
    showForm: { type: Boolean },
    hasSetHandle: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    .handle-container {
      background: var(--card-background, #1E1E1E);
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
      margin-top: 1rem;
      position: relative;
    }

    .set-handle-button {
      background: var(--accent-color, #9B2C2C);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .set-handle-button:hover {
      transform: translateY(-1px);
      background-color: #B83280;
      box-shadow: 0 4px 8px rgba(155, 44, 44, 0.3);
    }

    .set-handle-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(155, 44, 44, 0.2);
    }

    .handle-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
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

    input:focus {
      outline: none;
      border-color: var(--accent-color, #9B2C2C);
      box-shadow: 0 0 0 3px rgba(155, 44, 44, 0.2);
    }

    .current-handle {
      font-size: 0.875rem;
      color: var(--text-secondary, #A0A0A0);
      text-align: center;
      margin-top: 0.5rem;
    }

    .current-handle strong {
      color: var(--text-color, #E1E1E1);
      font-weight: 500;
    }

    .button-icon {
      width: 16px;
      height: 16px;
    }

    .hidden {
      display: none;
    }
  `;

  constructor() {
    super();
    this.handle = '';
    this.showForm = false;
    this.hasSetHandle = false;
    this._loadFromStorage();
  }

  _loadFromStorage() {
    const stored = localStorage.getItem('userHandle');
    if (stored) {
      this.handle = stored;
      this.hasSetHandle = true;
    }
  }

  _saveToStorage() {
    localStorage.setItem('userHandle', this.handle);
  }

  _showForm() {
    this.showForm = true;
  }

  _hideForm() {
    this.showForm = false;
  }

  _onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    this.handle = form.handle.value.trim();
    
    if (this.handle) {
      this.hasSetHandle = true;
      this._saveToStorage();
      this._hideForm();
      this.dispatchEvent(new CustomEvent('handle-update', {
        detail: { handle: this.handle },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    if (this.hasSetHandle) {
      return html`
        <div class="handle-container">
          <div class="current-handle">
            Posting as <strong>${this.handle}</strong>
          </div>
        </div>
      `;
    }

    return html`
      <div class="handle-container">
        ${!this.showForm ? html`
          <button class="set-handle-button" @click=${this._showForm}>
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Set Your Handle
          </button>
        ` : html`
          <form class="handle-form" @submit=${this._onSubmit}>
            <div class="form-group">
              <label for="handle">Choose a handle</label>
              <input 
                type="text" 
                id="handle" 
                name="handle" 
                required 
                placeholder="Enter your handle..."
                maxlength="30"
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
              >
            </div>
            <button type="submit" class="set-handle-button">
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Save Handle
            </button>
          </form>
        `}
      </div>
    `;
  }
}

customElements.define('user-handle', UserHandle); 