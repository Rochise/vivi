/**
 * ViagerPro Scraper - Main Entry Point
 * Automated scraper for viager listings from Leboncoin and SeLoger
 * 
 * Usage:
 *   npm start          - Start scheduler (runs every hour)
 *   npm run scrape     - Run once immediately
 */

require('dotenv').config();
const cron = require('node-cron');
const database = require('./database');
const notifier = require('./notifier');
const leboncoinScraper = require('./scrapers/leboncoin');
const selogerScraper = require('./scrapers/seloger');

// Configuration
const SCRAPE_INTERVAL = parseInt(process.env.SCRAPE_INTERVAL_MINUTES) || 60;
const isOneShot = process.argv.includes('--once');

/**
 * Main scraping function
 */
async function runScrape() {
    console.log('\n' + '='.repeat(60));
    console.log(`🔍 Starting viager scrape at ${new Date().toLocaleString('fr-FR')}`);
    console.log('='.repeat(60) + '\n');

    const allListings = [];
    const newListings = [];

    try {
        // Scrape Leboncoin
        console.log('\n--- Leboncoin ---');
        const lbcListings = await leboncoinScraper.scrape({ maxPages: 3, headless: true });
        allListings.push(...lbcListings);

        // Random delay between scrapers to avoid pattern detection
        await new Promise(r => setTimeout(r, Math.random() * 5000 + 3000));

        // Scrape SeLoger
        console.log('\n--- SeLoger ---');
        const slListings = await selogerScraper.scrape({ maxPages: 3, headless: true });
        allListings.push(...slListings);

    } catch (error) {
        console.error('❌ Scraping error:', error.message);
    }

    console.log(`\n📊 Total listings found: ${allListings.length}`);

    // Save to database
    for (const listing of allListings) {
        try {
            const result = database.upsertListing(listing);
            if (result.isNew) {
                newListings.push(result.listing);
            }
        } catch (error) {
            console.error('   Error saving listing:', error.message);
        }
    }

    console.log(`✨ New listings: ${newListings.length}`);

    // Send email notification for new listings
    if (newListings.length > 0) {
        const unnotified = database.getUnnotifiedListings();
        if (unnotified.length > 0) {
            console.log(`\n📧 Sending email notification for ${unnotified.length} listings...`);
            const emailSent = await notifier.sendNewListingsEmail(unnotified);

            if (emailSent) {
                database.markAsNotified(unnotified.map(l => l.id));
            }
        }
    }

    // Cleanup old listings
    database.cleanupOldListings();

    // Display stats
    const stats = database.getStats();
    console.log('\n📈 Database stats:');
    console.log(`   Total listings: ${stats.total}`);
    console.log(`   New (last 24h): ${stats.new}`);
    console.log(`   By source:`, stats.bySource);

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Scrape completed at ${new Date().toLocaleString('fr-FR')}`);
    console.log('='.repeat(60) + '\n');

    return { total: allListings.length, new: newListings.length };
}

/**
 * Initialize and start
 */
async function main() {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║               🏠 ViagerPro Scraper v1.0                 ║
║     Automated viager listings from LBC + SeLoger        ║
╚══════════════════════════════════════════════════════════╝
    `);

    // Initialize database
    await database.init();

    // Initialize email notifier
    const emailReady = notifier.init();
    if (!emailReady) {
        console.log('⚠️  Email notifications disabled. Configure .env to enable.');
    }

    if (isOneShot) {
        // Run once and exit
        console.log('🔄 Running single scrape...\n');
        await runScrape();
        database.close();
        process.exit(0);
    }

    // Run immediately on start
    console.log('🔄 Running initial scrape...\n');
    await runScrape();

    // Schedule periodic scrapes
    const cronExpression = `0 */${SCRAPE_INTERVAL} * * * *`; // Every SCRAPE_INTERVAL minutes

    // For hourly, use simpler expression
    const hourlyExpression = '0 * * * *'; // Every hour at minute 0

    console.log(`\n⏰ Scheduler started: Running every ${SCRAPE_INTERVAL} minutes`);
    console.log('   Press Ctrl+C to stop\n');

    cron.schedule(hourlyExpression, async () => {
        console.log('\n⏰ Scheduled scrape triggered');
        await runScrape();
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n\n👋 Shutting down...');
        database.close();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n\n👋 Shutting down...');
        database.close();
        process.exit(0);
    });
}

// Export for testing
module.exports = { runScrape };

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
