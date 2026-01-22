/**
 * SeLoger Scraper
 * Scrapes viager listings from seloger.com
 */

const { chromium } = require('playwright');

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// SeLoger search URL for viager
const SEARCH_URL = 'https://www.seloger.com/list.htm?projects=1&types=1,2&natures=1,2,4&places=[{ci:750056}]&qsVersion=1.0&m=search_refine-red498-search_results&LISTING-LISTpg=1';
const SEARCH_URL_VIAGER = 'https://www.seloger.com/immobilier/achat/immo-paris-75/?projects=1&types=1,2&natures=4';

/**
 * Random delay
 */
function randomDelay(min = 1000, max = 3000) {
    return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

/**
 * Get random user agent
 */
function getRandomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Extract listing data from SeLoger card
 */
async function extractListingData(card) {
    try {
        // Get link
        const linkEl = await card.$('a.Card__ContentZone-sc');
        if (!linkEl) {
            const altLink = await card.$('a[href*="/annonces/"]');
            if (!altLink) return null;
        }

        const link = linkEl || await card.$('a[href*="/annonces/"]');
        const url = link ? await link.getAttribute('href') : null;
        if (!url) return null;

        const fullUrl = url.startsWith('http') ? url : `https://www.seloger.com${url}`;

        // Get title
        const titleEl = await card.$('[data-test="sl.explore.card-title"]');
        const title = titleEl ? await titleEl.textContent() : '';

        // Get price
        const priceEl = await card.$('[data-test="sl.explore.card-price"]');
        let price = null;
        let rent = null;

        if (priceEl) {
            const priceText = await priceEl.textContent();
            const numbers = priceText.match(/[\d\s]+/g);
            if (numbers && numbers.length > 0) {
                price = parseInt(numbers[0].replace(/\s/g, ''));
            }
        }

        // Get location
        const locationEl = await card.$('[data-test="sl.explore.card-address"]');
        let city = '', postalCode = '', department = '';
        if (locationEl) {
            const locationText = await locationEl.textContent();
            const match = locationText.match(/(.+?)\s*\(?(\d{5})\)?/);
            if (match) {
                city = match[1].trim();
                postalCode = match[2];
                department = postalCode.substring(0, 2);
            } else {
                city = locationText.trim();
            }
        }

        // Get image
        const imgEl = await card.$('img');
        const imageUrl = imgEl ? await imgEl.getAttribute('src') : null;

        // Get details (surface, rooms)
        let surface = null;
        let rooms = null;

        const detailsEls = await card.$$('[data-test="sl.explore.card-tags"] span');
        for (const el of detailsEls) {
            const text = await el.textContent();
            if (text.includes('m²')) {
                const match = text.match(/(\d+)/);
                if (match) surface = parseInt(match[1]);
            }
            if (text.includes('pièce') || text.includes('p')) {
                const match = text.match(/(\d+)/);
                if (match) rooms = parseInt(match[1]);
            }
        }

        // Also try alternative selectors
        if (!surface) {
            const surfaceEl = await card.$('[data-test*="surface"]');
            if (surfaceEl) {
                const text = await surfaceEl.textContent();
                const match = text.match(/(\d+)/);
                if (match) surface = parseInt(match[1]);
            }
        }

        return {
            source: 'seloger',
            url: fullUrl,
            title: title.trim(),
            price,
            rent,
            city,
            postal_code: postalCode,
            department,
            surface,
            rooms,
            property_type: title.toLowerCase().includes('maison') ? 'house' : 'apartment',
            image_url: imageUrl
        };
    } catch (error) {
        console.error('Error extracting SeLoger listing:', error.message);
        return null;
    }
}

/**
 * Main scrape function
 */
async function scrape(options = {}) {
    const { maxPages = 3, headless = true } = options;
    const listings = [];

    console.log('🔵 Starting SeLoger scraper...');

    let browser;
    try {
        browser = await chromium.launch({
            headless,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });

        const context = await browser.newContext({
            userAgent: getRandomUA(),
            viewport: { width: 1920, height: 1080 },
            locale: 'fr-FR',
            timezoneId: 'Europe/Paris'
        });

        const page = await context.newPage();

        // Try direct viager search
        const viagerSearchUrl = 'https://www.seloger.com/list.htm?projects=1&types=1,2&natures=4&places=[{ci:750056}]&qsVersion=1.0';

        console.log('📄 Loading SeLoger search page...');
        await page.goto(viagerSearchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        await randomDelay(2000, 4000);

        // Handle cookie consent
        try {
            const acceptBtn = await page.$('#didomi-notice-agree-button');
            if (acceptBtn) {
                await acceptBtn.click();
                await randomDelay(1000, 2000);
            }
        } catch (e) { }

        // Also try CMP consent
        try {
            const cmpBtn = await page.$('[data-testid="accept-cmp"]');
            if (cmpBtn) {
                await cmpBtn.click();
                await randomDelay(1000, 2000);
            }
        } catch (e) { }

        // Scroll to load lazy content
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await randomDelay(1500, 2500);

        // Try different selectors for cards
        const cardSelectors = [
            '[data-test="sl.explore.card"]',
            '.Card__CardContainer-sc',
            'article[data-listing-id]',
            '.listing-item',
            '[class*="ListItem"]'
        ];

        let cards = [];
        for (const selector of cardSelectors) {
            cards = await page.$$(selector);
            if (cards.length > 0) {
                console.log(`   Found ${cards.length} cards with selector: ${selector}`);
                break;
            }
        }

        if (cards.length === 0) {
            console.log('⚠️  No listings found on SeLoger (may require different approach)');

            // Try to get any links to listings
            const links = await page.$$('a[href*="/annonces/"]');
            console.log(`   Found ${links.length} listing links`);

            for (const link of links.slice(0, 20)) {
                try {
                    const href = await link.getAttribute('href');
                    if (href && href.includes('/annonces/')) {
                        const fullUrl = href.startsWith('http') ? href : `https://www.seloger.com${href}`;
                        const text = await link.textContent();

                        listings.push({
                            source: 'seloger',
                            url: fullUrl,
                            title: text.trim().substring(0, 100) || 'Annonce SeLoger',
                            price: null,
                            rent: null,
                            city: 'Paris',
                            postal_code: '75000',
                            department: '75',
                            surface: null,
                            rooms: null,
                            property_type: 'apartment',
                            image_url: null
                        });
                    }
                } catch (e) { }
            }
        } else {
            // Extract from cards
            for (const card of cards) {
                const data = await extractListingData(card);
                if (data && data.url) {
                    listings.push(data);
                }
            }
        }

        console.log(`✅ SeLoger: Found ${listings.length} listings`);

    } catch (error) {
        console.error('❌ SeLoger scraper error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return listings;
}

module.exports = { scrape };
