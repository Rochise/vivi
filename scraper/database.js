/**
 * Database module for storing viager listings
 * Uses sql.js (pure JavaScript SQLite)
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'viager.db');

let db = null;

/**
 * Initialize database and create tables
 */
async function init() {
    const SQL = await initSqlJs();

    // Load existing database or create new
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        console.log('📦 Database loaded from file');
    } else {
        db = new SQL.Database();
        console.log('📦 New database created');
    }

    // Create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS listings (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            title TEXT,
            price INTEGER,
            rent INTEGER,
            city TEXT,
            postal_code TEXT,
            department TEXT,
            surface INTEGER,
            rooms INTEGER,
            property_type TEXT,
            image_url TEXT,
            description TEXT,
            seller_info TEXT,
            first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_new INTEGER DEFAULT 1,
            notified INTEGER DEFAULT 0
        )
    `);

    // Create indexes
    try {
        db.run('CREATE INDEX IF NOT EXISTS idx_source ON listings(source)');
        db.run('CREATE INDEX IF NOT EXISTS idx_is_new ON listings(is_new)');
    } catch (e) {
        // Indexes may already exist
    }

    saveToFile();
    console.log('📦 Database initialized');
    return db;
}

/**
 * Save database to file
 */
function saveToFile() {
    if (!db) return;
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Generate unique ID from URL
 */
function generateId(url) {
    return Buffer.from(url).toString('base64').slice(0, 32);
}

/**
 * Insert or update a listing
 */
function upsertListing(listing) {
    const id = generateId(listing.url);

    // Check if exists
    const existing = db.exec(`SELECT id FROM listings WHERE url = '${listing.url.replace(/'/g, "''")}'`);

    if (existing.length > 0 && existing[0].values.length > 0) {
        // Update
        db.run(`
            UPDATE listings 
            SET last_seen_at = datetime('now'),
                title = '${(listing.title || '').replace(/'/g, "''")}',
                price = ${listing.price || 'NULL'},
                rent = ${listing.rent || 'NULL'},
                surface = ${listing.surface || 'NULL'},
                image_url = '${(listing.image_url || '').replace(/'/g, "''")}'
            WHERE url = '${listing.url.replace(/'/g, "''")}'
        `);
        saveToFile();
        return { isNew: false, listing: { ...listing, id } };
    }

    // Insert new
    db.run(`
        INSERT INTO listings (
            id, source, url, title, price, rent, city, postal_code, 
            department, surface, rooms, property_type, image_url, 
            description, seller_info, is_new, notified
        ) VALUES (
            '${id}',
            '${listing.source}',
            '${listing.url.replace(/'/g, "''")}',
            '${(listing.title || '').replace(/'/g, "''")}',
            ${listing.price || 'NULL'},
            ${listing.rent || 'NULL'},
            '${(listing.city || '').replace(/'/g, "''")}',
            '${listing.postal_code || ''}',
            '${listing.department || ''}',
            ${listing.surface || 'NULL'},
            ${listing.rooms || 'NULL'},
            '${listing.property_type || ''}',
            '${(listing.image_url || '').replace(/'/g, "''")}',
            '${(listing.description || '').replace(/'/g, "''")}',
            '${(listing.seller_info || '').replace(/'/g, "''")}',
            1, 0
        )
    `);

    saveToFile();
    console.log(`✨ New listing: ${listing.title}`);
    return { isNew: true, listing: { ...listing, id } };
}

/**
 * Get unnotified listings
 */
function getUnnotifiedListings() {
    const result = db.exec(`
        SELECT * FROM listings 
        WHERE is_new = 1 AND notified = 0
        ORDER BY first_seen_at DESC
    `);

    if (!result.length) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });
}

/**
 * Mark listings as notified
 */
function markAsNotified(ids) {
    if (!ids.length) return;
    const idList = ids.map(id => `'${id}'`).join(',');
    db.run(`UPDATE listings SET notified = 1 WHERE id IN (${idList})`);
    saveToFile();
}

/**
 * Cleanup old listings
 */
function cleanupOldListings() {
    db.run(`UPDATE listings SET is_new = 0 WHERE first_seen_at < datetime('now', '-24 hours')`);
    saveToFile();
}

/**
 * Get recent listings
 */
function getRecentListings(limit = 50) {
    const result = db.exec(`SELECT * FROM listings ORDER BY first_seen_at DESC LIMIT ${limit}`);
    if (!result.length) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });
}

/**
 * Get statistics
 */
function getStats() {
    const total = db.exec('SELECT COUNT(*) FROM listings')[0]?.values[0][0] || 0;
    const newCount = db.exec('SELECT COUNT(*) FROM listings WHERE is_new = 1')[0]?.values[0][0] || 0;

    const bySourceResult = db.exec('SELECT source, COUNT(*) FROM listings GROUP BY source');
    const bySource = {};
    if (bySourceResult.length) {
        bySourceResult[0].values.forEach(row => {
            bySource[row[0]] = row[1];
        });
    }

    return { total, new: newCount, bySource };
}

/**
 * Close database
 */
function close() {
    if (db) {
        saveToFile();
        db.close();
        console.log('📦 Database closed');
    }
}

module.exports = {
    init,
    upsertListing,
    getUnnotifiedListings,
    markAsNotified,
    cleanupOldListings,
    getRecentListings,
    getStats,
    close
};
