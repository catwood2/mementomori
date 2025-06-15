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
            position: relative;
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
            position: relative;
        }

        .top-buttons {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            display: flex;
            gap: 0.5rem;
        }

        .close-button, .info-icon {
            background: none;
            border: none;
            color: var(--text-secondary, #A0A0A0);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .close-button:hover, .info-icon:hover {
            color: var(--accent-color, #9B2C2C);
        }

        .info-icon {
            font-size: 1rem;
        }

        .what-is-this {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.2s;
            background: none;
            border: none;
            padding: 0;
            font-family: inherit;
        }

        .what-is-this:hover {
            color: rgba(255, 255, 255, 0.9);
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

        .hidden {
            display: none;
        }

        .calculator-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .calculate-button {
            flex: 1;
            text-align: center;
            font-size: 1.1rem;
            position: relative;
        }

        .info-button {
            background: none;
            border: none;
            color: var(--text-color, #E1E1E1);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .info-button:hover {
            color: var(--accent-color, #9B2C2C);
        }

        .close-button {
            background: none;
            border: none;
            color: var(--text-secondary, #A0A0A0);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .close-button:hover {
            color: var(--accent-color, #9B2C2C);
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
        hasCalculated: { type: Boolean },
        showPopup: { type: Boolean }
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
        this.showPopup = false;
        
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
        } else {
            this.hasCalculated = false;
            this.showForm = false;
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
                <div class="calculator-container">
                    <button class="calculate-button" @click=${this._showForm}>
                        Calculate the Day I Die
                    </button>
                    <div class="top-buttons">
                        <button class="info-button" @click=${this._showPopup}>ⓘ</button>
                        <button class="close-button" @click=${this._hideCalculator}>×</button>
                    </div>
                </div>
                ${this.showPopup ? html`
                    <div class="popup-overlay" @click=${this._hidePopup}>
                        <div class="popup-content" @click=${e => e.stopPropagation()}>
                            <button class="popup-close" @click=${this._hidePopup}>×</button>
                            <h3 class="popup-title">About Death Calculator</h3>
                            <div class="popup-text">
                                <p>This calculator estimates your life expectancy based on your birth date and gender, using data from the Social Security Administration's actuarial tables.</p>
                                <p>The calculation is an estimate and should not be taken as a definitive prediction. Many factors can influence life expectancy, including lifestyle choices, medical advances, and environmental factors.</p>
                                <p>Use this as a reminder to make the most of your time and live intentionally.</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;
        }

        return html`
            <div class="calculator-form">
                <div class="top-buttons">
                    <button class="info-icon" @click=${e => { e.stopPropagation(); this._showPopup(); }} title="What is this?">ⓘ</button>
                    <button class="close-button" @click=${this._hideCalculator}>×</button>
                </div>
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

    _hideCalculator() {
        this.hasCalculated = true;
        this.showForm = false;
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

    _showPopup() {
        this.showPopup = true;
    }

    _hidePopup() {
        this.showPopup = false;
    }
}

customElements.define('death-calculator', DeathCalculator); 