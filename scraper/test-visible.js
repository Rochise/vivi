/**
 * Test script for scraping with visible browser (non-headless)
 */

const leboncoin = require('./scrapers/leboncoin');
const seloger = require('./scrapers/seloger');

async function testScraping() {
    console.log('🧪 Testing scrapers in NON-HEADLESS mode (visible browser)...\n');

    // Test Leboncoin with visible browser
    console.log('━'.repeat(50));
    console.log('Testing Leboncoin...');
    console.log('━'.repeat(50));

    const lbcListings = await leboncoin.scrape({
        maxPages: 1,
        headless: false  // Visible browser
    });

    console.log(`\n📊 Leboncoin results: ${lbcListings.length} listings found`);
    if (lbcListings.length > 0) {
        console.log('Sample:', lbcListings[0]);
    }

    // Wait a bit between scrapers
    await new Promise(r => setTimeout(r, 2000));

    // Test SeLoger with visible browser
    console.log('\n' + '━'.repeat(50));
    console.log('Testing SeLoger...');
    console.log('━'.repeat(50));

    const slgListings = await seloger.scrape({
        maxPages: 1,
        headless: false
    });

    console.log(`\n📊 SeLoger results: ${slgListings.length} listings found`);
    if (slgListings.length > 0) {
        console.log('Sample:', slgListings[0]);
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📋 SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Leboncoin: ${lbcListings.length} listings`);
    console.log(`SeLoger:   ${slgListings.length} listings`);
    console.log(`Total:     ${lbcListings.length + slgListings.length} listings`);

    if (lbcListings.length === 0 && slgListings.length === 0) {
        console.log('\n⚠️  Both scrapers returned 0 results.');
        console.log('   This is likely due to anti-bot protections (Datadome, Cloudflare).');
        console.log('   Possible solutions:');
        console.log('   1. Use residential proxies (paid service)');
        console.log('   2. Use a scraping API like ScrapingBee or Apify');
        console.log('   3. Try less protected sites (PAP.fr, Bien\'ici)');
    }
}

testScraping().catch(console.error);
