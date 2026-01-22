/**
 * Logger module using Winston
 */

const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level: process.env.DEBUG === 'true' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'scraper.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 3
        })
    ]
});

module.exports = logger;
