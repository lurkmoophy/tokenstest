const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LINKS_URL = 'https://lurkmoophytokenstest.zeroheight.com/api/token_management/token_set/12956/style_dictionary_links?format=style-dictionary';
const OUTPUT_DIR = path.resolve(__dirname, '../tokens');

async function fetchAllTokens() {
  try {
    const { data: rawText } = await axios.get(LINKS_URL, {
      headers: {
        Accept: 'text/plain',
      },
      responseType: 'text',
    });

    const urls = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const url of urls) {
      const match = url.match(/collection_name=([^&]+)&mode_name=([^&]+)/);
      const collection = match?.[1] ?? 'unknown_collection';
      const mode = match?.[2] ?? 'unknown_mode';
      const filename = `${collection}--${mode}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);

      console.log(`⬇️ Fetching ${filename}...`);

      try {
        const res = await axios.get(url);
        fs.writeFileSync(filepath, JSON.stringify(res.data, null, 2));
      } catch (err) {
        console.error(`❌ Failed to fetch ${url}: ${err.message}`);
      }
    }

    console.log('✅ All tokens downloaded!');
  } catch (err) {
    console.error('❌ Failed to fetch token list:', err.message);
  }
}

fetchAllTokens();
