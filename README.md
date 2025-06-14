# Memento Mori Quotes

A Progressive Web App for collecting and sharing meaningful quotes about life, death, and everything in between.

## Features

- Dark theme with elegant design
- Category-based filtering
- Search functionality
- Mobile-friendly interface
- PWA support for installation on devices
- Airtable backend for data storage

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/memento-mori.git
cd memento-mori
```

2. Set up Airtable:
   - Create an Airtable account if you don't have one
   - Create a new base with a table named "Quotes"
   - Add the following fields to your table:
     - Quote (Single line text)
     - Category (Single select)
     - SourceLink (URL)
     - CreatedAt (Date, auto-generated)

3. Configure the app:
   - Copy `src/config.template.js` to `src/config.js`
   - Fill in your Airtable credentials:
     - Base ID (found in the API documentation)
     - API Key (from your account settings)
     - Table Name (default is "Quotes")

4. Serve the app locally:
   - Use any static file server, for example:
   ```bash
   npx serve
   ```
   - Or open `index.html` directly in your browser

## Deployment

The app can be deployed to any static hosting service. Here are some options:

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select your main branch as the source
4. Your app will be available at `https://yourusername.github.io/memento-mori`

### Netlify

1. Create a Netlify account
2. Connect your GitHub repository
3. Deploy settings:
   - Build command: leave empty
   - Publish directory: `.` (root)
4. Your app will be available at a Netlify subdomain

## Security Note

Never commit your `config.js` file or share your Airtable API key. The `.gitignore` file is set up to prevent accidental commits of sensitive data.

## License

MIT License - feel free to use this project for your own purposes.

## Version

v1.0.0 