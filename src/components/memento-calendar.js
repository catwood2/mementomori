class MementoCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.weeks = 104; // 2 years per row
        this.rows = 40;   // 80 years total
        this.markedWeeks = new Set();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const style = `
            :host {
                display: block;
                background: var(--card-background, #1E1E1E);
                padding: 1rem;
                border-radius: var(--border-radius, 12px);
                box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
                border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
            }

            .calendar-container {
                width: 100%;
                overflow-x: auto;
                padding: 1rem;
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

            .age-labels {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 0.5rem;
                color: var(--text-secondary, #A0A0A0);
                font-size: 0.8rem;
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
        `;

        const dots = Array.from({ length: this.rows * this.weeks }, (_, i) => {
            const row = Math.floor(i / this.weeks);
            const col = i % this.weeks;
            const age = row * 2;
            const isMarked = this.markedWeeks.has(i);
            return `<div class="dot ${isMarked ? 'marked' : ''}" 
                        data-index="${i}" 
                        data-age="${age}" 
                        data-week="${col + 1}"></div>`;
        }).join('');

        const ageLabels = Array.from({ length: this.rows + 1 }, (_, i) => {
            const age = i * 2;
            return `<div>${age}</div>`;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="title">Memento Mori Calendar</div>
            <div class="calendar-container">
                <div class="age-labels">${ageLabels}</div>
                <div class="calendar-grid">${dots}</div>
            </div>
            <div class="controls">
                <button id="reset-btn">Reset All</button>
                <button id="mark-current-btn">Mark Current Week</button>
            </div>
        `;
    }

    setupEventListeners() {
        const grid = this.shadowRoot.querySelector('.calendar-grid');
        const resetBtn = this.shadowRoot.querySelector('#reset-btn');
        const markCurrentBtn = this.shadowRoot.querySelector('#mark-current-btn');

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

        markCurrentBtn.addEventListener('click', () => {
            const today = new Date();
            const birthDate = new Date(localStorage.getItem('birthDate') || today);
            const ageInWeeks = Math.floor((today - birthDate) / (7 * 24 * 60 * 60 * 1000));
            
            if (ageInWeeks >= 0 && ageInWeeks < this.rows * this.weeks) {
                this.markedWeeks.add(ageInWeeks);
                this.render();
                this.saveState();
            }
        });
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