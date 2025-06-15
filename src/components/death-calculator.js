import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class DeathCalculator extends LitElement {
    static styles = css`
        :host {
            display: block;
            background: var(--card-background, #1E1E1E);
            padding: var(--spacing, 1rem);
            border-radius: var(--border-radius, 12px);
            box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
            border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
        }

        .calculator-form {
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

        input, select {
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

        input:focus, select:focus {
            outline: none;
            border-color: var(--accent-color, #9B2C2C);
            box-shadow: 0 0 0 3px rgba(155, 44, 44, 0.2);
        }

        button {
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

        .results {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(155, 44, 44, 0.2);
        }

        .result-item {
            margin-bottom: 1rem;
        }

        .result-label {
            font-size: 0.875rem;
            color: var(--text-secondary, #A0A0A0);
            margin-bottom: 0.25rem;
        }

        .result-value {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--accent-color, #9B2C2C);
        }

        .life-timeline {
            margin-top: 2rem;
            height: 40px;
            background: var(--primary-color, #1A1A1A);
            border-radius: 20px;
            position: relative;
            overflow: hidden;
        }

        .life-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: var(--accent-color, #9B2C2C);
            transition: width 1s ease-out;
        }

        .life-marker {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 2px;
            height: 20px;
            background: white;
        }

        .life-marker.current {
            background: #4CAF50;
        }

        .life-marker.death {
            background: #9B2C2C;
        }

        .age-details {
            font-size: 0.875rem;
            color: var(--text-secondary, #A0A0A0);
            margin-top: 0.5rem;
        }

        .init-button {
            width: 100%;
            text-align: center;
            font-size: 1.1rem;
        }

        .hidden {
            display: none;
        }
    `;

    static properties = {
        birthDate: { type: String },
        gender: { type: String },
        lifeExpectancy: { type: Number },
        deathDate: { type: String },
        lifeProgress: { type: Number },
        exactAge: { type: Number },
        showForm: { type: Boolean },
        hasCalculated: { type: Boolean }
    };

    constructor() {
        super();
        this.birthDate = '';
        this.gender = 'male';
        this.lifeExpectancy = 0;
        this.deathDate = '';
        this.lifeProgress = 0;
        this.exactAge = 0;
        this.showForm = false;
        this.hasCalculated = false;
        
        // Load stored data after properties are initialized
        this.updateComplete.then(() => {
            this._loadFromStorage();
        });
    }

    _loadFromStorage() {
        const stored = localStorage.getItem('deathCalculator');
        if (stored) {
            const data = JSON.parse(stored);
            this.deathDate = data.deathDate;
            this.hasCalculated = true;
            // Dispatch event to update header
            this.dispatchEvent(new CustomEvent('death-date-update', {
                detail: { deathDate: this.deathDate },
                bubbles: true,
                composed: true
            }));
        }
    }

    _saveToStorage() {
        localStorage.setItem('deathCalculator', JSON.stringify({
            deathDate: this.deathDate
        }));
    }

    // SSA Actuarial Table data (simplified for example)
    static lifeExpectancyTable = {
        male: {
            0: 76.1,
            20: 57.6,
            30: 48.2,
            40: 38.9,
            50: 29.9,
            60: 21.7,
            70: 14.6,
            80: 8.9,
            90: 4.8
        },
        female: {
            0: 81.1,
            20: 61.8,
            30: 52.2,
            40: 42.7,
            50: 33.3,
            60: 24.5,
            70: 16.8,
            80: 10.4,
            90: 5.6
        }
    };

    render() {
        if (this.hasCalculated) {
            return html``;
        }

        if (!this.showForm) {
            return html`
                <button class="init-button" @click=${this._showForm}>
                    Calculate Your Death Date
                </button>
            `;
        }

        return html`
            <div class="calculator-form">
                <div class="form-group">
                    <label for="birthdate">Date of Birth</label>
                    <input 
                        type="date" 
                        id="birthdate" 
                        .value=${this.birthDate}
                        @input=${this._onBirthDateChange}
                    />
                </div>

                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select 
                        id="gender" 
                        .value=${this.gender}
                        @change=${this._onGenderChange}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <button @click=${this._calculate}>Calculate</button>

                ${this.lifeExpectancy ? html`
                    <div class="results">
                        <div class="result-item">
                            <div class="result-label">Current Age</div>
                            <div class="result-value">${this.exactAge.toFixed(1)} years</div>
                            <div class="age-details">Born on ${new Date(this.birthDate).toLocaleDateString()}</div>
                        </div>

                        <div class="result-item">
                            <div class="result-label">Remaining Life Expectancy</div>
                            <div class="result-value">${this.lifeExpectancy.toFixed(1)} years</div>
                        </div>

                        <div class="result-item">
                            <div class="result-label">Projected Death Date</div>
                            <div class="result-value">${this.deathDate}</div>
                        </div>

                        <div class="life-timeline">
                            <div class="life-progress" style="width: ${this.lifeProgress}%"></div>
                            <div class="life-marker current" style="left: ${(this.exactAge / (this.exactAge + this.lifeExpectancy)) * 100}%"></div>
                            <div class="life-marker death" style="left: 100%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    _showForm() {
        this.showForm = true;
    }

    _onBirthDateChange(e) {
        this.birthDate = e.target.value;
    }

    _onGenderChange(e) {
        this.gender = e.target.value;
    }

    _calculate() {
        if (!this.birthDate) return;

        const birth = new Date(this.birthDate);
        const today = new Date();
        
        // Calculate exact age in years
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        this.exactAge = age;

        // Find the closest age in the table
        const ages = Object.keys(DeathCalculator.lifeExpectancyTable[this.gender])
            .map(Number)
            .sort((a, b) => a - b);
        
        const closestAge = ages.reduce((prev, curr) => {
            return Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev;
        });

        // Get life expectancy
        this.lifeExpectancy = DeathCalculator.lifeExpectancyTable[this.gender][closestAge];

        // Calculate death date by adding remaining years to current date
        const deathDate = new Date(today);
        deathDate.setFullYear(deathDate.getFullYear() + Math.floor(this.lifeExpectancy));
        // Add the fractional part of the years as days
        const fractionalYears = this.lifeExpectancy - Math.floor(this.lifeExpectancy);
        const additionalDays = Math.floor(fractionalYears * 365.25); // Using 365.25 to account for leap years
        deathDate.setDate(deathDate.getDate() + additionalDays);
        
        this.deathDate = deathDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Calculate life progress
        this.lifeProgress = (age / (age + this.lifeExpectancy)) * 100;

        // Save to storage and update header
        this.hasCalculated = true;
        this._saveToStorage();
        this.dispatchEvent(new CustomEvent('death-date-update', {
            detail: { deathDate: this.deathDate },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('death-calculator', DeathCalculator); 