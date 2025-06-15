class MementoCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.weeks = 104; // 2 years per row
        this.rows = 40;   // 80 years total
        this.markedWeeks = new Set();
        this.birthDate = localStorage.getItem('birthDate') ? new Date(localStorage.getItem('birthDate')) : null;
    }

    connectedCallback() {
        this.loadState();
        this.render();
        this.setupEventListeners();
        if (this.birthDate) {
            this.markWeeksUpToCurrent();
        }
    }

    render() {
        const style = `
            :host {
                display: block;
                width: 100%;
            }

            .calendar-container {
                width: 100%;
                overflow-x: auto;
                padding: 1rem;
                position: relative;
                background: white;
                border-radius: var(--border-radius, 12px);
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(104, 1fr);
                gap: 2px;
                width: fit-content;
                margin: 0 auto;
            }

            .dot {
                width: 4px;
                height: 4px;
                background: #9B2C2C;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .dot:hover {
                transform: scale(1.5);
            }

            .dot.marked {
                background: #1A1A1A;
            }

            .controls {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                justify-content: center;
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

            .title {
                text-align: center;
                color: var(--accent-color, #9B2C2C);
                margin-bottom: 1rem;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .birth-date-input {
                display: flex;
                gap: 1rem;
                align-items: center;
                margin-bottom: 1rem;
                justify-content: center;
            }

            input[type="date"] {
                background: var(--primary-color, #1A1A1A);
                color: var(--text-color, #E1E1E1);
                border: 1px solid rgba(155, 44, 44, 0.3);
                padding: 0.5rem;
                border-radius: 8px;
                font-family: inherit;
            }

            label {
                color: var(--text-color, #E1E1E1);
                font-weight: 500;
            }
        `;

        const dots = Array.from({ length: this.rows * this.weeks }, (_, i) => {
            const row = Math.floor(i / this.weeks);
            const col = i % this.weeks;
            const isMarked = this.markedWeeks.has(i);
            return `<div class="dot ${isMarked ? 'marked' : ''}" 
                        data-index="${i}" 
                        data-row="${row}" 
                        data-col="${col}"></div>`;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="title">Memento Mori Calendar</div>
            <div class="birth-date-input">
                <label for="birthdate">Birth Date:</label>
                <input type="date" id="birthdate" value="${this.birthDate ? this.birthDate.toISOString().split('T')[0] : ''}">
                <button id="update-birthdate">Update</button>
            </div>
            <div class="calendar-container">
                <div class="calendar-grid">${dots}</div>
            </div>
            <div class="controls">
                <button id="reset-btn">Reset All</button>
            </div>
        `;
    }

    setupEventListeners() {
        const grid = this.shadowRoot.querySelector('.calendar-grid');
        const resetBtn = this.shadowRoot.querySelector('#reset-btn');
        const birthdateInput = this.shadowRoot.querySelector('#birthdate');
        const updateBirthdateBtn = this.shadowRoot.querySelector('#update-birthdate');

        grid.addEventListener('click', (e) => {
            const dot = e.target.closest('.dot');
            if (dot) {
                const index = parseInt(dot.dataset.index);
                if (this.markedWeeks.has(index)) {
                    this.markedWeeks.delete(index);
                } else {
                    this.markedWeeks.add(index);
                }
                dot.classList.toggle('marked');
                this.saveState();
            }
        });

        resetBtn.addEventListener('click', () => {
            this.markedWeeks.clear();
            this.render();
            this.saveState();
        });

        updateBirthdateBtn.addEventListener('click', () => {
            const birthDate = new Date(birthdateInput.value);
            if (birthDate && !isNaN(birthDate)) {
                this.birthDate = birthDate;
                localStorage.setItem('birthDate', birthDate.toISOString());
                this.markedWeeks.clear();
                this.markWeeksUpToCurrent();
                this.render();
                this.saveState();
            }
        });
    }

    markWeeksUpToCurrent() {
        if (!this.birthDate) return;
        
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        
        // Calculate the difference in milliseconds
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const ageInWeeks = Math.floor(diffDays / 7);
        
        if (ageInWeeks >= 0 && ageInWeeks < this.rows * this.weeks) {
            for (let i = 0; i <= ageInWeeks; i++) {
                this.markedWeeks.add(i);
            }
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('mementoCalendar', JSON.stringify(Array.from(this.markedWeeks)));
    }

    loadState() {
        const saved = localStorage.getItem('mementoCalendar');
        if (saved) {
            this.markedWeeks = new Set(JSON.parse(saved));
        }
    }
}

customElements.define('memento-calendar', MementoCalendar); 