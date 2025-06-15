import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class AddQuote extends LitElement {
    static properties = {
        isExpanded: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            margin-bottom: 2rem;
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
            display: grid;
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

        input, textarea, select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color, #333);
            border-radius: 6px;
            background: var(--input-background, #2A2A2A);
            color: var(--text-color, #E1E1E1);
            font-size: 1rem;
            transition: all 0.2s;
        }

        input::placeholder, textarea::placeholder {
            color: var(--text-secondary, #A0A0A0);
            font-style: italic;
            opacity: 0.7;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: var(--accent-color, #9B2C2C);
            box-shadow: 0 0 0 2px rgba(155, 44, 44, 0.2);
        }

        .hidden {
            display: none;
        }
    `;

    constructor() {
        super();
        this.isExpanded = false;
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
                <form class="${this.isExpanded ? '' : 'hidden'}">
                    <input 
                        type="text" 
                        placeholder="Enter your quote here..." 
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Source (e.g., book, author, website)" 
                        required
                    />
                    <input 
                        type="url" 
                        placeholder="Source URL (optional)" 
                    />
                    <select required>
                        <option value="">Select a category...</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Religion">Religion</option>
                        <option value="Literature">Literature</option>
                        <option value="History">History</option>
                        <option value="Science">Science</option>
                        <option value="Art">Art</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="submit">Add Quote</button>
                </form>
            </div>
        `;
    }
}

customElements.define('add-quote', AddQuote); 