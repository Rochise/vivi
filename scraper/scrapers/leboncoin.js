/**
 * Leboncoin Scraper
 * Scrapes viager listings from leboncoin.fr
 */

const { chromium } = require('playwright');

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

const SEARCH_URL = 'https://www.leboncoin.fr/recherche?text=viager&category=9&category=10';

/**
 * Random delay between actions
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
 * Extract listing data from a card element
 */
async function extractListingData(card, page) {
    try {
        // Get the link and title
        const linkEl = await card.$('a[data-qa-id="aditem_container"]');
        if (!linkEl) return null;

        const url = await linkEl.getAttribute('href');
        const fullUrl = url.startsWith('http') ? url : `https://www.leboncoin.fr${url}`;

        // Get title
        const titleEl = await card.$('[data-qa-id="aditem_title"]');
        const title = titleEl ? await titleEl.textContent() : '';

        // Get price
        const priceEl = await card.$('[data-qa-id="aditem_price"]');
        let price = null;
        let rent = null;

        if (priceEl) {
            const priceText = await priceEl.textContent();
            // Parse price - look for bouquet and rente
            const numbers = priceText.match(/[\d\s]+/g);
            if (numbers && numbers.length > 0) {
                price = parseInt(numbers[0].replace(/\s/g, ''));
            }
            // Check if there's a monthly rent mentioned
            if (priceText.toLowerCase().includes('/mois') || priceText.toLowerCase().includes('mensuel')) {
                if (numbers && numbers.length > 1) {
                    rent = parseInt(numbers[1].replace(/\s/g, ''));
                }
            }
        }

        // Get location
        const locationEl = await card.$('[data-qa-id="aditem_location"]');
        let city = '', postalCode = '', department = '';
        if (locationEl) {
            const locationText = await locationEl.textContent();
            // Parse location - usually "City 12345"
            const match = locationText.match(/(.+?)\s+(\d{5})/);
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

        // Get surface and rooms from tags
        let surface = null;
        let rooms = null;
        const tagsEls = await card.$$('[data-qa-id="aditem_tags"] span');
        for (const tag of tagsEls) {
            const tagText = await tag.textContent();
            if (tagText.includes('m²')) {
                const surfaceMatch = tagText.match(/(\d+)\s*m²/);
                if (surfaceMatch) surface = parseInt(surfaceMatch[1]);
            }
            if (tagText.includes('pièce') || tagText.includes('p.')) {
                const roomsMatch = tagText.match(/(\d+)/);
                if (roomsMatch) rooms = parseInt(roomsMatch[1]);
            }
        }

        return {
            source: 'leboncoin',
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
        console.error('Error extracting listing:', error.message);
        return null;
    }
}

/**
 * Main scrape function
 */
async function scrape(options = {}) {
    const { maxPages = 3, headless = true } = options;
    const listings = [];

    console.log('🟠 Starting Leboncoin scraper...');

    let browser;
    try {
        browser = await chromium.launch({
            headless,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        const context = await browser.newContext({
            userAgent: getRandomUA(),
            viewport: { width: 1920, height: 1080 },
            locale: 'fr-FR',
            timezoneId: 'Europe/Paris'
        });

        // Block unnecessary resources
        await context.route('**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2}', route => route.abort());
        await context.route('**/*google*', route => route.abort());
        await context.route('**/*facebook*', route => route.abort());
        await context.route('**/*analytics*', route => route.abort());

        const page = await context.newPage();

        // Navigate to search page
        console.log('📄 Loading search page...');
        await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

        await randomDelay(2000, 4000);

        // Handle cookie consent if present
        try {
            const cookieBtn = await page.$('#didomi-notice-agree-button');
            if (cookieBtn) {
                await cookieBtn.click();
                await randomDelay(1000, 2000);
            }
        } catch (e) {
            // Cookie banner not present or already dismissed
        }

        // Scrape multiple pages
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`📄 Scraping page ${pageNum}...`);

            // Wait for listings to load
            await page.waitForSelector('[data-qa-id="aditem_container"]', { timeout: 10000 }).catch(() => null);

            // Get all listing cards
            const cards = await page.$$('[data-qa-id="aditem_container"]').catch(() => []);

            if (cards.length === 0) {
                console.log('⚠️  No listings found on this page');
                break;
            }

            console.log(`   Found ${cards.length} listings`);

            // Extract data from each card
            for (const card of cards) {
                const data = await extractListingData(card, page);
                if (data && data.url) {
                    listings.push(data);
                }
            }

            // Go to next page if not last
            if (pageNum < maxPages) {
                try {
                    const nextBtn = await page.$('[data-qa-id="pagination_next"]');
                    if (nextBtn) {
                        await nextBtn.click();
                        await randomDelay(2000, 4000);
                        await page.waitForLoadState('domcontentloaded');
                    } else {
                        break;
                    }
                } catch (e) {
                    console.log('   No more pages');
                    break;
                }
            }
        }

        console.log(`✅ Leboncoin: Found ${listings.length} listings`);

    } catch (error) {
        console.error('❌ Leboncoin scraper error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return listings;
}

module.exports = { scrape };
