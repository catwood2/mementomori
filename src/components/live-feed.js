import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class LiveFeed extends LitElement {
  static properties = {
    tweets: { type: Array },
    isExpanded: { type: Boolean },
    pollInterval: { type: Number },
    lastUpdate: { type: String }
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
      margin-top: 1rem;
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

    .feed-content {
      animation: slideDown 0.2s ease-out;
      padding: 1rem;
      background: var(--card-background, #1E1E1E);
      border-radius: 0 0 var(--border-radius, 12px) var(--border-radius, 12px);
      box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
      border: var(--card-border, 1px solid rgba(155, 44, 44, 0.2));
      border-top: none;
      margin-top: -1px;
    }

    .tweet {
      padding: 1rem;
      border-radius: 8px;
      background: var(--primary-color, #1A1A1A);
      margin-bottom: 1rem;
      animation: fadeIn 0.3s ease-out;
    }

    .tweet:last-child {
      margin-bottom: 0;
    }

    .tweet-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .tweet-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-color, #9B2C2C);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
    }

    .tweet-author {
      font-weight: 500;
      color: var(--text-color, #E1E1E1);
    }

    .tweet-time {
      font-size: 0.875rem;
      color: var(--text-secondary, #A0A0A0);
    }

    .tweet-content {
      color: var(--text-color, #E1E1E1);
      line-height: 1.5;
    }

    .tweet-actions {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(155, 44, 44, 0.2);
    }

    .tweet-action {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-secondary, #A0A0A0);
      font-size: 0.875rem;
      cursor: pointer;
      transition: color 0.2s;
    }

    .tweet-action:hover {
      color: var(--accent-color, #9B2C2C);
    }

    .tweet-action svg {
      width: 16px;
      height: 16px;
    }

    .last-update {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary, #A0A0A0);
      margin-top: 1rem;
    }

    .placeholder {
      text-align: center;
      color: var(--text-secondary, #A0A0A0);
      padding: 2rem;
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

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hidden {
      display: none;
    }
  `;

  constructor() {
    super();
    this.tweets = [];
    this.isExpanded = false;
    this.pollInterval = 30; // Poll every 30 seconds
    this.lastUpdate = '';
    this._pollTimer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPolling();
  }

  _toggleAccordion() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this._startPolling();
    } else {
      this._stopPolling();
    }
  }

  _startPolling() {
    this._stopPolling(); // Clear any existing timer
    this._pollTimer = setInterval(() => this._load(), this.pollInterval * 1000);
  }

  _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  async _load() {
    try {
      const res = await fetch('/.netlify/functions/airtable');
      if (!res.ok) {
        throw new Error('Failed to fetch tweets');
      }
      const { records } = await res.json();
      this.tweets = records.sort((a, b) => new Date(b.fields.CreatedAt) - new Date(a.fields.CreatedAt));
      this.lastUpdate = new Date().toLocaleTimeString();
    } catch (err) {
      console.error('Error loading tweets:', err);
    }
  }

  _formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours === 0) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
    
    // Otherwise show the date
    return date.toLocaleDateString();
  }

  render() {
    return html`
      <div class="accordion">
        <div class="accordion-header" @click=${this._toggleAccordion}>
          <div class="accordion-title">
            <svg class="accordion-icon ${this.isExpanded ? 'expanded' : ''}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            Live Feed
          </div>
        </div>
        <div class="feed-content ${this.isExpanded ? '' : 'hidden'}">
          ${this.tweets.length === 0 
            ? html`<div class="placeholder">No tweets yet. Check back soon!</div>`
            : this.tweets.map(tweet => html`
                <div class="tweet">
                  <div class="tweet-header">
                    <div class="tweet-avatar">${tweet.fields.Author?.[0] || '?'}</div>
                    <div class="tweet-author">${tweet.fields.Author || 'Anonymous'}</div>
                    <div class="tweet-time">${this._formatTime(tweet.fields.CreatedAt)}</div>
                  </div>
                  <div class="tweet-content">${tweet.fields.Content}</div>
                  <div class="tweet-actions">
                    <div class="tweet-action">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      ${tweet.fields.Likes || 0}
                    </div>
                    <div class="tweet-action">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      ${tweet.fields.Replies || 0}
                    </div>
                    <div class="tweet-action">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      ${tweet.fields.Retweets || 0}
                    </div>
                  </div>
                </div>
              `)
          }
          ${this.lastUpdate ? html`
            <div class="last-update">Last updated: ${this.lastUpdate}</div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('live-feed', LiveFeed); 