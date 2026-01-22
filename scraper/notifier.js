/**
 * Email notification module using Nodemailer
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

/**
 * Initialize email transporter
 */
function init() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('⚠️  Email not configured. Set SMTP_* variables in .env');
        return false;
    }

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    console.log('📧 Email transporter initialized');
    return true;
}

/**
 * Format price for display
 */
function formatPrice(price) {
    if (!price) return 'Non précisé';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Generate HTML for a single listing
 */
function generateListingHTML(listing) {
    const sourceLabel = listing.source === 'leboncoin' ? '🟠 Leboncoin' : '🔵 SeLoger';
    const priceInfo = listing.rent
        ? `Bouquet: ${formatPrice(listing.price)} + ${formatPrice(listing.rent)}/mois`
        : `Prix: ${formatPrice(listing.price)}`;

    return `
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #fafafa;">
            <div style="display: flex; gap: 16px;">
                ${listing.image_url ? `
                    <img src="${listing.image_url}" alt="Photo" 
                         style="width: 150px; height: 100px; object-fit: cover; border-radius: 4px;">
                ` : ''}
                <div style="flex: 1;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${sourceLabel}</div>
                    <h3 style="margin: 0 0 8px 0; color: #333;">
                        <a href="${listing.url}" style="color: #7c3aed; text-decoration: none;">
                            ${listing.title || 'Annonce viager'}
                        </a>
                    </h3>
                    <div style="color: #16a34a; font-weight: 600; font-size: 16px;">${priceInfo}</div>
                    <div style="color: #666; font-size: 14px; margin-top: 4px;">
                        📍 ${listing.city || ''} ${listing.postal_code || ''} 
                        ${listing.surface ? `• ${listing.surface} m²` : ''}
                        ${listing.rooms ? `• ${listing.rooms} pièces` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Send notification email for new listings
 */
async function sendNewListingsEmail(listings) {
    if (!transporter) {
        console.warn('⚠️  Cannot send email: transporter not initialized');
        return false;
    }

    if (!listings.length) {
        return false;
    }

    const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

    const listingsHTML = listings.map(generateListingHTML).join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            </style>
        </head>
        <body style="margin: 0; padding: 20px; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 24px; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">🏠 Nouvelles annonces viager</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9;">${listings.length} nouvelle(s) annonce(s) trouvée(s)</p>
                </div>
                <div style="padding: 24px;">
                    ${listingsHTML}
                </div>
                <div style="padding: 16px 24px; background: #f8f8f8; text-align: center; color: #666; font-size: 12px;">
                    ViagerPro Scraper • ${new Date().toLocaleString('fr-FR')}
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"ViagerPro" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: `🏠 ${listings.length} nouvelle(s) annonce(s) viager`,
            html: html
        });

        console.log(`📧 Email sent to ${recipientEmail} with ${listings.length} listings`);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        return false;
    }
}

/**
 * Send test email
 */
async function sendTestEmail() {
    if (!transporter) {
        console.error('❌ Transporter not initialized');
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"ViagerPro" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
            subject: '✅ ViagerPro - Test de notification',
            html: `
                <h1>Test réussi !</h1>
                <p>Votre configuration email fonctionne correctement.</p>
                <p>Vous recevrez une notification lorsque de nouvelles annonces viager seront trouvées.</p>
            `
        });
        console.log('✅ Test email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Test email failed:', error.message);
        return false;
    }
}

module.exports = {
    init,
    sendNewListingsEmail,
    sendTestEmail
};
