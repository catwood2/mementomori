import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class AddQuote extends LitElement {
    static styles = css`
        :host {
            display: block;
            margin-bottom: 2rem;
        }

        form {
            display: grid;
            gap: 1rem;
            background: var(--card-background, #1E1E1E);
            padding: 1.5rem;
            border-radius: var(--border-radius, 12px);
            box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
            border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
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
    `;

    render() {
        return html`
            <form>
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
        `;
    }
}

customElements.define('add-quote', AddQuote); 