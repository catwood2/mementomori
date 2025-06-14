const { LitElement, html, css } = await import('https://unpkg.com/lit?module');

class QuoteForm extends LitElement {
  static styles = css`form { margin-bottom: 1em; }`;

  render() {
    return html`
      <form @submit=${this._onSubmit}>
        <textarea name="quote" placeholder="Quote" required></textarea>
        <input type="text" name="category" placeholder="Category" required />
        <input type="url" name="link" placeholder="Source link" required />
        <button type="submit">Add Quote</button>
      </form>
    `;
  }

  async _onSubmit(evt) {
    evt.preventDefault();
    const form = evt.target;
    const data = {
      fields: {
        Quote: form.quote.value,
        Category: form.category.value,
        SourceLink: form.link.value
      }
    };
    await fetch('https://api.airtable.com/v0/app6MFdBcHk4rO6n8/api/docs/Quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer paty1jgHks70TKpfD.e37d439f8c80a835ee8e901480fcc9a59afb1fe4fd22cc7cff854ebe35be9395'
      },
      body: JSON.stringify(data)
    });
    this.dispatchEvent(new CustomEvent('quote-added', { bubbles: true }));
    form.reset();
  }
}
customElements.define('quote-form', QuoteForm);