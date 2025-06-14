const fs = require('fs');

// Read environment variables
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

// Create config file content
const configContent = `// Generated config file
export const AIRTABLE_BASE_ID = "${AIRTABLE_BASE_ID}";
export const AIRTABLE_API_KEY = "${AIRTABLE_API_KEY}";
export const AIRTABLE_TABLE_NAME = "${AIRTABLE_TABLE_NAME}";
`;

// Write to config.js
fs.writeFileSync('src/config.js', configContent);

console.log('Config file created successfully'); 