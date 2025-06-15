class DeathCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.birthDate = localStorage.getItem('birthDate') ? new Date(localStorage.getItem('birthDate')) : null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    // Life expectancy based on US Social Security Administration data
    getLifeExpectancy(birthDate) {
        const age = this.calculateAge(birthDate);
        const isMale = localStorage.getItem('gender') === 'male';
        
        // Base life expectancy at birth (2020 data)
        let expectancy = isMale ? 74.2 : 79.9;
        
        // Adjust for current age (simplified calculation)
        if (age > 0) {
            expectancy += age * 0.1; // Each year lived adds about 0.1 years to life expectancy
        }
        
        return Math.round(expectancy);
    }

    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    calculateDeathDate(birthDate) {
        const expectancy = this.getLifeExpectancy(birthDate);
        const deathDate = new Date(birthDate);
        deathDate.setFullYear(deathDate.getFullYear() + expectancy);
        return deathDate;
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    render() {
        const style = `
            :host {
                display: block;
                background: var(--card-background, #1E1E1E);
                padding: 1.5rem;
                border-radius: var(--border-radius, 12px);
                box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
                border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
                margin-bottom: 1rem;
            }

            .calculator {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .input-group {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            label {
                color: var(--text-color, #E1E1E1);
                font-weight: 500;
            }

            input[type="date"] {
                background: var(--primary-color, #1A1A1A);
                color: var(--text-color, #E1E1E1);
                border: 1px solid rgba(155, 44, 44, 0.3);
                padding: 0.5rem;
                border-radius: 8px;
                font-family: inherit;
            }

            select {
                background: var(--primary-color, #1A1A1A);
                color: var(--text-color, #E1E1E1);
                border: 1px solid rgba(155, 44, 44, 0.3);
                padding: 0.5rem;
                border-radius: 8px;
                font-family: inherit;
            }

            .result {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(155, 44, 44, 0.1);
                border-radius: 8px;
                text-align: center;
            }

            .death-date {
                font-size: 1.5rem;
                color: var(--accent-color, #9B2C2C);
                font-weight: 600;
                margin: 0.5rem 0;
            }

            .life-expectancy {
                color: var(--text-secondary, #A0A0A0);
                font-size: 0.9rem;
            }

            button {
                background: var(--accent-color, #9B2C2C);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            button:hover {
                background: #D88A1A;
            }
        `;

        const deathDate = this.birthDate ? this.calculateDeathDate(this.birthDate) : null;
        const lifeExpectancy = this.birthDate ? this.getLifeExpectancy(this.birthDate) : null;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="calculator">
                <div class="input-group">
                    <label for="birthdate">Birth Date:</label>
                    <input type="date" id="birthdate" value="${this.birthDate ? this.birthDate.toISOString().split('T')[0] : ''}">
                </div>
                <div class="input-group">
                    <label for="gender">Gender:</label>
                    <select id="gender">
                        <option value="male" ${localStorage.getItem('gender') === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${localStorage.getItem('gender') === 'female' ? 'selected' : ''}>Female</option>
                    </select>
                </div>
                <button id="calculate-btn">Calculate</button>
                ${deathDate ? `
                    <div class="result">
                        <div>Your projected death date is:</div>
                        <div class="death-date">${this.formatDate(deathDate)}</div>
                        <div class="life-expectancy">Based on a life expectancy of ${lifeExpectancy} years</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupEventListeners() {
        const calculateBtn = this.shadowRoot.querySelector('#calculate-btn');
        const birthdateInput = this.shadowRoot.querySelector('#birthdate');
        const genderSelect = this.shadowRoot.querySelector('#gender');

        calculateBtn.addEventListener('click', () => {
            const birthDate = new Date(birthdateInput.value);
            const gender = genderSelect.value;
            
            if (birthDate && !isNaN(birthDate)) {
                localStorage.setItem('birthDate', birthDate.toISOString());
                localStorage.setItem('gender', gender);
                this.birthDate = birthDate;
                this.render();
            }
        });
    }
}

customElements.define('death-calculator', DeathCalculator); 