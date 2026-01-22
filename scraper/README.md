# ViagerPro Scraper

Scraper automatisé pour les annonces viager sur Leboncoin et SeLoger.

## 🚀 Installation

```bash
cd scraper
npm install
npm run install-browsers
```

## ⚙️ Configuration Email

1. Copiez `.env.example` vers `.env`
2. Configurez vos paramètres SMTP :

```env
# Pour Gmail, utilisez un "mot de passe d'application"
# https://myaccount.google.com/apppasswords

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx

NOTIFICATION_EMAIL=votre.email@gmail.com
SCRAPE_INTERVAL_MINUTES=60
```

## 📧 Configuration Gmail

1. Activez la validation en 2 étapes sur votre compte Google
2. Créez un mot de passe d'application : [Lien](https://myaccount.google.com/apppasswords)
3. Utilisez ce mot de passe dans `SMTP_PASS`

## 🏃 Utilisation

```bash
# Lancer le scraper en continu (toutes les heures)
npm start

# Exécuter une seule fois
npm run scrape
```

## 📁 Structure

```
scraper/
├── index.js           # Point d'entrée, scheduler
├── database.js        # Gestion SQLite
├── notifier.js        # Notifications email
├── logger.js          # Logging
├── scrapers/
│   ├── leboncoin.js   # Scraper Leboncoin
│   └── seloger.js     # Scraper SeLoger
├── viager.db          # Base de données (créée automatiquement)
└── .env               # Configuration (à créer)
```

## ⚠️ Avertissement

Ce scraper est fourni à titre éducatif. Le scraping peut violer les CGU des sites concernés. Utilisation à vos propres risques.
