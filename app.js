// ===== Life Expectancy Tables (INSEE) =====
const LIFE_EXPECTANCY_TABLE = {
    male: {
        50: 31.0, 51: 30.1, 52: 29.2, 53: 28.3, 54: 27.4,
        55: 26.5, 56: 25.7, 57: 24.8, 58: 24.0, 59: 23.1,
        60: 22.3, 61: 21.5, 62: 20.7, 63: 19.9, 64: 19.1,
        65: 18.4, 66: 17.6, 67: 16.9, 68: 16.1, 69: 15.4,
        70: 14.7, 71: 14.0, 72: 13.3, 73: 12.6, 74: 12.0,
        75: 11.3, 76: 10.7, 77: 10.1, 78: 9.5, 79: 8.9,
        80: 8.3, 81: 7.8, 82: 7.3, 83: 6.8, 84: 6.3,
        85: 5.9, 86: 5.5, 87: 5.1, 88: 4.7, 89: 4.4,
        90: 4.1, 91: 3.8, 92: 3.5, 93: 3.3, 94: 3.0,
        95: 2.8, 96: 2.6, 97: 2.4, 98: 2.3, 99: 2.1,
        100: 2.0
    },
    female: {
        50: 35.3, 51: 34.3, 52: 33.4, 53: 32.4, 54: 31.5,
        55: 30.5, 56: 29.6, 57: 28.7, 58: 27.7, 59: 26.8,
        60: 25.9, 61: 25.0, 62: 24.1, 63: 23.2, 64: 22.3,
        65: 21.4, 66: 20.5, 67: 19.7, 68: 18.8, 69: 18.0,
        70: 17.1, 71: 16.3, 72: 15.5, 73: 14.7, 74: 13.9,
        75: 13.1, 76: 12.4, 77: 11.6, 78: 10.9, 79: 10.2,
        80: 9.5, 81: 8.8, 82: 8.2, 83: 7.6, 84: 7.0,
        85: 6.5, 86: 6.0, 87: 5.5, 88: 5.0, 89: 4.6,
        90: 4.3, 91: 3.9, 92: 3.6, 93: 3.3, 94: 3.1,
        95: 2.8, 96: 2.6, 97: 2.4, 98: 2.2, 99: 2.1,
        100: 2.0
    }
};

// ===== Disease Statistics (based on medical literature and mortality data) =====
// lifeReduction: years subtracted from base life expectancy
// multiplier: additional factor for elderly (compounds with age)
// survivalRate5y: 5-year survival rate (for info)
const DISEASE_STATISTICS = {
    // Aucune pathologie
    none: {
        name: "Bonne santé",
        lifeReduction: 0,
        multiplier: 1.05,
        description: "Aucune pathologie connue"
    },
    minor: {
        name: "Pathologies mineures",
        lifeReduction: 0.5,
        multiplier: 1.0,
        description: "Hypertension contrôlée, cholestérol..."
    },

    // Maladies cardiovasculaires
    heart_failure: {
        name: "Insuffisance cardiaque",
        lifeReduction: 5,
        multiplier: 0.65,
        description: "Espérance médiane: 5 ans après diagnostic"
    },
    coronary: {
        name: "Maladie coronarienne",
        lifeReduction: 4,
        multiplier: 0.75,
        description: "Réduction moyenne de 4-6 ans"
    },
    stroke: {
        name: "AVC",
        lifeReduction: 6,
        multiplier: 0.60,
        description: "Risque de récidive, réduction significative"
    },
    arrhythmia: {
        name: "Arythmie sévère",
        lifeReduction: 3,
        multiplier: 0.80,
        description: "Fibrillation auriculaire, risque d'AVC"
    },

    // Cancers
    cancer_remission: {
        name: "Cancer en rémission",
        lifeReduction: 2,
        multiplier: 0.90,
        description: "+5 ans sans récidive, bon pronostic"
    },
    cancer_prostate: {
        name: "Cancer prostate",
        lifeReduction: 2,
        multiplier: 0.85,
        description: "Survie à 5 ans: 98% (stade localisé)"
    },
    cancer_breast: {
        name: "Cancer du sein",
        lifeReduction: 3,
        multiplier: 0.80,
        description: "Survie à 5 ans: 90% (global)"
    },
    cancer_colon: {
        name: "Cancer colorectal",
        lifeReduction: 5,
        multiplier: 0.70,
        description: "Survie à 5 ans: 65% (tous stades)"
    },
    cancer_lung: {
        name: "Cancer du poumon",
        lifeReduction: 8,
        multiplier: 0.40,
        description: "Survie à 5 ans: 20% (tous stades)"
    },
    cancer_pancreas: {
        name: "Cancer du pancréas",
        lifeReduction: 10,
        multiplier: 0.20,
        description: "Survie à 5 ans: 10%, très agressif"
    },

    // Maladies respiratoires
    copd_moderate: {
        name: "BPCO modérée",
        lifeReduction: 3,
        multiplier: 0.85,
        description: "Stade II, réduction de 3-5 ans"
    },
    copd_severe: {
        name: "BPCO sévère",
        lifeReduction: 7,
        multiplier: 0.55,
        description: "Stade III-IV, oxygénothérapie"
    },
    pulmonary_fibrosis: {
        name: "Fibrose pulmonaire",
        lifeReduction: 8,
        multiplier: 0.45,
        description: "Survie médiane: 3-5 ans après diagnostic"
    },

    // Maladies métaboliques
    diabetes_controlled: {
        name: "Diabète contrôlé",
        lifeReduction: 2,
        multiplier: 0.90,
        description: "Réduction moyenne de 1-3 ans"
    },
    diabetes_complications: {
        name: "Diabète complications",
        lifeReduction: 6,
        multiplier: 0.65,
        description: "Néphropathie, rétinopathie, neuropathie"
    },
    renal_failure: {
        name: "Insuffisance rénale",
        lifeReduction: 7,
        multiplier: 0.55,
        description: "Dialyse: espérance 5-10 ans"
    },
    cirrhosis: {
        name: "Cirrhose hépatique",
        lifeReduction: 8,
        multiplier: 0.50,
        description: "Survie médiane: 2-12 ans selon stade"
    },

    // Maladies neurologiques
    alzheimer_early: {
        name: "Alzheimer précoce",
        lifeReduction: 5,
        multiplier: 0.65,
        description: "Espérance: 8-10 ans après diagnostic"
    },
    alzheimer_advanced: {
        name: "Alzheimer avancé",
        lifeReduction: 8,
        multiplier: 0.40,
        description: "Stade sévère, dépendance totale"
    },
    parkinson: {
        name: "Parkinson",
        lifeReduction: 4,
        multiplier: 0.75,
        description: "Réduction moyenne de 2-5 ans"
    },
    als: {
        name: "SLA",
        lifeReduction: 12,
        multiplier: 0.15,
        description: "Survie médiane: 2-5 ans après diagnostic"
    }
};

// ===== Department Price References (DVF Data - Updated January 2026) =====
// Prix moyens au m² par département (sources: DVF, Notaires de France)
// Mise à jour mensuelle recommandée
const DEPARTMENT_PRICES = {
    // Île-de-France
    '75': { name: 'Paris', avg: 10500, low: 8000, medLow: 9500, med: 10500, medHigh: 12000, high: 15000 },
    '92': { name: 'Hauts-de-Seine', avg: 7200, low: 5000, medLow: 6000, med: 7200, medHigh: 8500, high: 10000 },
    '93': { name: 'Seine-Saint-Denis', avg: 4100, low: 3000, medLow: 3500, med: 4100, medHigh: 5000, high: 6000 },
    '94': { name: 'Val-de-Marne', avg: 5200, low: 3500, medLow: 4500, med: 5200, medHigh: 6500, high: 8000 },
    '78': { name: 'Yvelines', avg: 4500, low: 3000, medLow: 3800, med: 4500, medHigh: 5500, high: 7000 },
    '91': { name: 'Essonne', avg: 3200, low: 2200, medLow: 2800, med: 3200, medHigh: 4000, high: 5000 },
    '95': { name: 'Val-d\'Oise', avg: 3400, low: 2300, medLow: 2900, med: 3400, medHigh: 4200, high: 5200 },
    '77': { name: 'Seine-et-Marne', avg: 2800, low: 1800, medLow: 2300, med: 2800, medHigh: 3500, high: 4500 },

    // Grandes métropoles
    '69': { name: 'Rhône (Lyon)', avg: 4800, low: 3000, medLow: 4000, med: 4800, medHigh: 6000, high: 7500 },
    '13': { name: 'Bouches-du-Rhône', avg: 3800, low: 2500, medLow: 3200, med: 3800, medHigh: 4800, high: 6000 },
    '31': { name: 'Haute-Garonne (Toulouse)', avg: 3500, low: 2200, medLow: 2900, med: 3500, medHigh: 4300, high: 5500 },
    '33': { name: 'Gironde (Bordeaux)', avg: 4200, low: 2800, medLow: 3500, med: 4200, medHigh: 5200, high: 6500 },
    '44': { name: 'Loire-Atlantique (Nantes)', avg: 3900, low: 2600, medLow: 3300, med: 3900, medHigh: 4800, high: 6000 },
    '59': { name: 'Nord (Lille)', avg: 3000, low: 1800, medLow: 2400, med: 3000, medHigh: 3800, high: 5000 },
    '67': { name: 'Bas-Rhin (Strasbourg)', avg: 3200, low: 2000, medLow: 2600, med: 3200, medHigh: 4000, high: 5000 },
    '34': { name: 'Hérault (Montpellier)', avg: 3400, low: 2200, medLow: 2800, med: 3400, medHigh: 4200, high: 5500 },

    // Côte d'Azur
    '06': { name: 'Alpes-Maritimes (Nice)', avg: 5200, low: 3500, medLow: 4300, med: 5200, medHigh: 6500, high: 8500 },
    '83': { name: 'Var (Toulon)', avg: 3800, low: 2500, medLow: 3200, med: 3800, medHigh: 4800, high: 6200 },

    // Autres départements (moyennes)
    'default': { name: 'France', avg: 2500, low: 1500, medLow: 2000, med: 2500, medHigh: 3500, high: 5000 }
};

// Date de dernière mise à jour des prix
const PRICES_LAST_UPDATE = 'Janvier 2026';

/**
 * Get price ranges for a department based on postal code
 */
function getDepartmentPrices(postalCode) {
    if (!postalCode) return DEPARTMENT_PRICES['default'];

    const deptCode = postalCode.substring(0, 2);
    return DEPARTMENT_PRICES[deptCode] || DEPARTMENT_PRICES['default'];
}

/**
 * Update legend dynamically based on selected city
 */
function updateLegendForCity(cityName, postalCode) {
    const prices = getDepartmentPrices(postalCode);

    // Update city name
    const legendCityEl = document.getElementById('legendCity');
    if (legendCityEl) {
        legendCityEl.textContent = cityName || prices.name;
    }

    // Update date
    const legendDateEl = document.getElementById('legendDate');
    if (legendDateEl) {
        legendDateEl.textContent = PRICES_LAST_UPDATE;
    }

    // Update price ranges - use decimal if values are close
    const formatK = (n) => {
        if (n >= 1000) {
            const k = n / 1000;
            return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
        }
        return n.toLocaleString('fr-FR');
    };

    document.getElementById('legendLow').textContent = `< ${formatK(prices.low)} €`;
    document.getElementById('legendMedLow').textContent = `${formatK(prices.low)} - ${formatK(prices.medLow)} €`;
    document.getElementById('legendMed').textContent = `${formatK(prices.medLow)} - ${formatK(prices.med)} €`;
    document.getElementById('legendMedHigh').textContent = `${formatK(prices.med)} - ${formatK(prices.medHigh)} €`;
    document.getElementById('legendHigh').textContent = `> ${formatK(prices.medHigh)} €`;

    console.log(`📊 Legend updated for ${cityName} (${postalCode}): avg ${prices.avg}€/m²`);
}

/**
 * Update legend with real DVF data (percentiles from actual transactions)
 */
function updateLegendWithRealData(cityName, p10, p25, p50, p75, p90) {
    // Update city name
    const legendCityEl = document.getElementById('legendCity');
    if (legendCityEl) {
        legendCityEl.textContent = cityName;
    }

    // Update date to current month
    const legendDateEl = document.getElementById('legendDate');
    if (legendDateEl) {
        const now = new Date();
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        legendDateEl.textContent = `${months[now.getMonth()]} ${now.getFullYear()} (DVF)`;
    }

    // Format function
    const formatK = (n) => {
        if (n >= 1000) {
            const k = n / 1000;
            return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
        }
        return n.toLocaleString('fr-FR');
    };

    // Update legend with percentile ranges
    document.getElementById('legendLow').textContent = `< ${formatK(p10)} €`;
    document.getElementById('legendMedLow').textContent = `${formatK(p10)} - ${formatK(p25)} €`;
    document.getElementById('legendMed').textContent = `${formatK(p25)} - ${formatK(p75)} €`;
    document.getElementById('legendMedHigh').textContent = `${formatK(p75)} - ${formatK(p90)} €`;
    document.getElementById('legendHigh').textContent = `> ${formatK(p90)} €`;

    // Store current ranges for color function
    currentPriceRanges = { p10, p25, p50, p75, p90 };

    console.log(`📊 Legend updated with DVF data for ${cityName}: P10=${p10}, P50=${p50}, P90=${p90}`);
}

/**
 * Get color for price based on city-specific ranges
 */
function getPriceColor(priceM2, postalCode) {
    const prices = getDepartmentPrices(postalCode);

    if (priceM2 < prices.low) return '#22c55e';      // Green - very cheap
    if (priceM2 < prices.medLow) return '#84cc16';   // Light green
    if (priceM2 < prices.med) return '#eab308';      // Yellow - average
    if (priceM2 < prices.medHigh) return '#f97316';  // Orange
    return '#ef4444';                                  // Red - expensive
}

// ===== DOM Elements =====
const addressInput = document.getElementById('addressInput');
const addressSuggestions = document.getElementById('addressSuggestions');
const communeNameEl = document.getElementById('communeName');
const avgPriceEl = document.getElementById('avgPrice');
const transactionCountEl = document.getElementById('transactionCount');
const viagerForm = document.getElementById('viagerForm');
const resultsBody = document.getElementById('resultsBody');
const emptyState = document.getElementById('emptyState');

// ===== State =====
let map = null;
let markersLayer = null;
let selectedLocation = null;
let debounceTimer = null;
let currentAvgPriceM2 = 0; // Prix moyen au m² de la zone sélectionnée
let currentPriceRanges = null; // Fourchettes de prix dynamiques (percentiles DVF)

// ===== Initialize Map =====
function initMap() {
    // Default center on France
    map = L.map('map', {
        center: [46.603354, 1.888334],
        zoom: 6,
        zoomControl: true
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

// ===== Get color based on price per m² =====
function getPriceColor(pricePerM2) {
    if (pricePerM2 < 3000) return '#22c55e';
    if (pricePerM2 < 5000) return '#84cc16';
    if (pricePerM2 < 7000) return '#eab308';
    if (pricePerM2 < 10000) return '#f97316';
    return '#ef4444';
}

// ===== Search addresses via API Adresse =====
async function searchAddress(query) {
    if (query.length < 3) {
        hideSuggestions();
        return;
    }

    try {
        const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=8`
        );
        const data = await response.json();
        displayAddressSuggestions(data.features);
    } catch (error) {
        console.error('Address search error:', error);
    }
}

function displayAddressSuggestions(features) {
    if (!features || features.length === 0) {
        hideSuggestions();
        return;
    }

    addressSuggestions.innerHTML = features.map(f => {
        const p = f.properties;
        return `
            <div class="suggestion-item" 
                 data-lat="${f.geometry.coordinates[1]}"
                 data-lon="${f.geometry.coordinates[0]}"
                 data-city="${p.city || ''}"
                 data-citycode="${p.citycode || ''}"
                 data-postcode="${p.postcode || ''}">
                <div class="address-main">${p.label}</div>
                <div class="address-secondary">${p.context || ''}</div>
            </div>
        `;
    }).join('');

    addressSuggestions.classList.add('active');

    addressSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => selectAddress(item));
    });
}

function hideSuggestions() {
    addressSuggestions.classList.remove('active');
}

async function selectAddress(item) {
    const lat = parseFloat(item.dataset.lat);
    const lon = parseFloat(item.dataset.lon);
    const city = item.dataset.city;
    const citycode = item.dataset.citycode;
    const postcode = item.dataset.postcode;

    selectedLocation = { lat, lon, city, citycode, postcode };

    addressInput.value = item.querySelector('.address-main').textContent;
    hideSuggestions();

    // Update commune name
    communeNameEl.textContent = `${city} (${postcode})`;

    // Update legend with city-specific price ranges
    updateLegendForCity(city, postcode);

    // Center map on location
    map.setView([lat, lon], 14);

    // Add marker for selected address
    markersLayer.clearLayers();

    const mainMarker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: '#a855f7',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(markersLayer);

    mainMarker.bindPopup(`<strong>Adresse sélectionnée</strong><br>${city}`);

    // Fetch nearby transactions
    await fetchNearbyTransactions(lat, lon, citycode);

    // Auto-calculate if all fields are filled
    if (typeof debouncedAutoCalculate === 'function') {
        debouncedAutoCalculate();
    }
}

// ===== Fetch DVF transactions around location =====
async function fetchNearbyTransactions(lat, lon, citycode) {
    avgPriceEl.textContent = '...';
    transactionCountEl.textContent = '...';

    try {
        // Use DVF API with code_commune (this API works reliably)
        const response = await fetch(
            `https://api.cquest.org/dvf?code_commune=${citycode}&limit=200`
        );

        if (!response.ok) throw new Error('API error');

        const data = await response.json();

        if (data.resultats && data.resultats.length > 0) {
            displayTransactions(data.resultats, lat, lon);
        } else {
            avgPriceEl.textContent = 'Non disponible';
            transactionCountEl.textContent = '0';
        }
    } catch (error) {
        console.error('DVF fetch error:', error);
        avgPriceEl.textContent = 'Non disponible';
        transactionCountEl.textContent = '0';
    }
}


function displayTransactions(transactions, centerLat, centerLon) {
    // Filter valid transactions with surface (handle both API formats)
    const validTransactions = transactions.filter(t => {
        const surface = t.surface_reelle_bati || t.surface_relle_bati || t.surface_terrain;
        const price = t.valeur_fonciere;
        return price && surface && surface > 0 && price > 10000;
    });

    if (validTransactions.length === 0) {
        avgPriceEl.textContent = 'Non disponible';
        transactionCountEl.textContent = '0';
        return;
    }

    // Calculate average price per m²
    let totalPricePerM2 = 0;
    let count = 0;

    validTransactions.forEach((t, index) => {
        const surface = t.surface_reelle_bati || t.surface_relle_bati || t.surface_terrain;
        const pricePerM2 = t.valeur_fonciere / surface;

        // Filter outliers
        if (pricePerM2 > 500 && pricePerM2 < 25000) {
            totalPricePerM2 += pricePerM2;
            count++;

            // Create marker position
            let markerLat = t.latitude || t.lat;
            let markerLon = t.longitude || t.lon;

            // If no coordinates, simulate positions around the center (max 30 markers)
            if ((!markerLat || !markerLon) && count <= 30) {
                const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
                const radius = 0.002 + (index % 5) * 0.001; // Varying radius
                markerLat = centerLat + Math.cos(angle) * radius;
                markerLon = centerLon + Math.sin(angle) * radius;
            }

            if (markerLat && markerLon) {
                addTransactionMarker({
                    ...t,
                    latitude: markerLat,
                    longitude: markerLon,
                    surface_reelle_bati: surface
                }, pricePerM2);
            }
        }
    });

    if (count > 0) {
        const avgPrice = Math.round(totalPricePerM2 / count);
        currentAvgPriceM2 = avgPrice; // Store in global state
        avgPriceEl.textContent = `${avgPrice.toLocaleString('fr-FR')} €/m²`;
        transactionCountEl.textContent = count.toString();

        // Calculate price ranges from actual data (percentiles)
        const prices = validTransactions
            .map(t => {
                const surface = t.surface_reelle_bati || t.surface_relle_bati || t.surface_terrain;
                return t.valeur_fonciere / surface;
            })
            .filter(p => p > 500 && p < 25000)
            .sort((a, b) => a - b);

        if (prices.length >= 5) {
            // Calculate percentiles: 10%, 25%, 50% (median), 75%, 90%
            const p10 = Math.round(prices[Math.floor(prices.length * 0.10)]);
            const p25 = Math.round(prices[Math.floor(prices.length * 0.25)]);
            const p50 = Math.round(prices[Math.floor(prices.length * 0.50)]);
            const p75 = Math.round(prices[Math.floor(prices.length * 0.75)]);
            const p90 = Math.round(prices[Math.floor(prices.length * 0.90)]);

            // Update legend with real data
            updateLegendWithRealData(selectedLocation?.city || 'Zone', p10, p25, p50, p75, p90);
        }

        // Auto-fill property price based on surface if empty
        const surfaceInput = document.getElementById('surface');
        const priceInput = document.getElementById('propertyPrice');
        if (surfaceInput.value && !priceInput.value) {
            priceInput.value = Math.round(avgPrice * parseFloat(surfaceInput.value));
        }
    } else {
        currentAvgPriceM2 = 0; // Reset
        avgPriceEl.textContent = 'Non disponible';
        transactionCountEl.textContent = '0';
    }
}

function addTransactionMarker(transaction, pricePerM2) {
    const color = getPriceColor(pricePerM2);

    const marker = L.circleMarker([transaction.latitude, transaction.longitude], {
        radius: 6,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.7
    }).addTo(markersLayer);

    const date = transaction.date_mutation ?
        new Date(transaction.date_mutation).toLocaleDateString('fr-FR') :
        'Date inconnue';

    const popupContent = `
        <strong>${Math.round(pricePerM2).toLocaleString('fr-FR')} €/m²</strong><br>
        Prix: ${Math.round(transaction.valeur_fonciere).toLocaleString('fr-FR')} €<br>
        Surface: ${transaction.surface_reelle_bati} m²<br>
        Date: ${date}
    `;

    marker.bindPopup(popupContent);
}

// ===== Viager Calculations =====
// DUH (Droit d'Usage et d'Habitation) coefficients by age
const DUH_COEFFICIENTS = {
    50: 0.60, 51: 0.59, 52: 0.58, 53: 0.57, 54: 0.56,
    55: 0.55, 56: 0.54, 57: 0.53, 58: 0.52, 59: 0.51,
    60: 0.50, 61: 0.49, 62: 0.48, 63: 0.47, 64: 0.46,
    65: 0.45, 66: 0.44, 67: 0.43, 68: 0.42, 69: 0.41,
    70: 0.40, 71: 0.39, 72: 0.38, 73: 0.37, 74: 0.36,
    75: 0.35, 76: 0.34, 77: 0.33, 78: 0.32, 79: 0.31,
    80: 0.30, 81: 0.29, 82: 0.28, 83: 0.27, 84: 0.26,
    85: 0.25, 86: 0.24, 87: 0.23, 88: 0.22, 89: 0.21,
    90: 0.20, 91: 0.19, 92: 0.18, 93: 0.17, 94: 0.16,
    95: 0.15, 96: 0.14, 97: 0.13, 98: 0.12, 99: 0.11,
    100: 0.10
};

function calculateLifeExpectancy(age, gender, diseaseCode) {
    const table = LIFE_EXPECTANCY_TABLE[gender];
    const baseExpectancy = table[Math.min(Math.max(age, 50), 100)] || 5;

    // Get disease statistics
    const disease = DISEASE_STATISTICS[diseaseCode] || DISEASE_STATISTICS.none;

    // Apply disease impact: reduce base expectancy and apply multiplier
    // The multiplier accounts for accelerated decline in elderly with the condition
    let adjustedExpectancy = (baseExpectancy - disease.lifeReduction) * disease.multiplier;

    // Ensure minimum of 1 year
    adjustedExpectancy = Math.max(adjustedExpectancy, 1);

    return {
        years: Math.round(adjustedExpectancy * 10) / 10,
        baseExpectancy: baseExpectancy,
        disease: disease,
        reduction: disease.lifeReduction,
        impactPercent: Math.round((1 - adjustedExpectancy / baseExpectancy) * 100)
    };
}

function getDUHCoefficient(age) {
    return DUH_COEFFICIENTS[Math.min(Math.max(age, 50), 100)] || 0.20;
}

function calculateViager(params) {
    const { propertyPrice, surface, bouquet, rente, age, gender, disease, avgPriceM2, taxeFonciere, person2 } = params;

    // Calculate estimated value from surface × average price/m² (from DVF data)
    const estimatedValue = avgPriceM2 > 0 && surface > 0 ? avgPriceM2 * surface : propertyPrice;

    // Calculate real price per m² (based on entered price)
    const realPriceM2 = surface > 0 ? Math.round(propertyPrice / surface) : 0;

    // Price difference between market avg and entered price
    const priceDiffPercent = avgPriceM2 > 0 ? Math.round((realPriceM2 / avgPriceM2 - 1) * 100) : 0;

    // ===== Life Expectancy Calculation (with couple support) =====
    // Couple bonus: +10% life expectancy based on INSEE/INED studies
    // Married/partnered people live longer on average
    const COUPLE_BONUS = 1.10; // +10% life expectancy

    // Calculate life expectancy for person 1
    let lifeExpectancyData = calculateLifeExpectancy(age, gender, disease);
    let lifeExpectancy = lifeExpectancyData.years;
    let isCouple = false;
    let person2LifeExpectancy = null;
    let coupleInfo = null;

    // If there's a second person (couple), use the last survivor logic
    if (person2) {
        isCouple = true;
        const lifeExpectancyData2 = calculateLifeExpectancy(person2.age, person2.gender, person2.disease);
        person2LifeExpectancy = lifeExpectancyData2.years;

        // Apply couple bonus to both
        const person1WithBonus = lifeExpectancy * COUPLE_BONUS;
        const person2WithBonus = person2LifeExpectancy * COUPLE_BONUS;

        // Use the longest life expectancy (last survivor)
        const lastSurvivorExpectancy = Math.max(person1WithBonus, person2WithBonus);

        coupleInfo = {
            person1Base: lifeExpectancy,
            person2Base: person2LifeExpectancy,
            person1WithBonus: Math.round(person1WithBonus * 10) / 10,
            person2WithBonus: Math.round(person2WithBonus * 10) / 10,
            bonusPercent: 10,
            lastSurvivor: lastSurvivorExpectancy
        };

        lifeExpectancy = Math.round(lastSurvivorExpectancy * 10) / 10;
    }

    const durationMonths = Math.round(lifeExpectancy * 12);
    const durationYears = (durationMonths / 12).toFixed(1);

    // DUH coefficient (use the oldest person for couple)
    const effectiveAge = person2 ? Math.min(age, person2.age) : age;
    const duhCoef = getDUHCoefficient(effectiveAge);

    // DUH value (value of occupancy right)
    const duhValue = Math.round(propertyPrice * duhCoef);

    // Bare ownership value (property value minus DUH)
    const bareOwnership = propertyPrice - duhValue;

    // Total rents over estimated duration
    const totalRentes = rente * durationMonths;

    // Total property taxes over estimated duration (annual tax × years)
    const totalTaxesFoncieres = Math.round(taxeFonciere * parseFloat(durationYears));

    // Notary fees (approximately 8% of bare ownership for old properties)
    const notaryFees = Math.round(bareOwnership * 0.08);

    // Total acquisition cost
    const totalCost = bouquet + totalRentes + totalTaxesFoncieres + notaryFees;

    // Total cost for direct purchase (property + notary fees on full price)
    const directPurchaseCost = propertyPrice + Math.round(propertyPrice * 0.08);

    // Savings vs direct purchase
    const savings = directPurchaseCost - totalCost;
    const savingsPercent = ((savings / directPurchaseCost) * 100).toFixed(1);

    // Difference between bouquet and bare ownership value
    const bouquetDiff = bouquet - bareOwnership;

    // ===== Break-Even Analysis =====
    // Calculate when the investment becomes unprofitable
    // Monthly cost = rent + (property tax / 12)
    const monthlyTaxe = taxeFonciere / 12;
    const monthlyCost = rente + monthlyTaxe;

    // Fixed costs at start
    const fixedCosts = bouquet + notaryFees;

    // Margin = property value - fixed costs
    const margin = propertyPrice - fixedCosts;

    // Months until break-even (when cumulative costs exceed property value)
    let breakEvenMonths = 0;
    if (monthlyCost > 0) {
        breakEvenMonths = Math.floor(margin / monthlyCost);
    }

    const breakEvenYears = (breakEvenMonths / 12).toFixed(1);

    // Calculate the break-even date
    const today = new Date();
    const breakEvenDate = new Date(today);
    breakEvenDate.setMonth(breakEvenDate.getMonth() + breakEvenMonths);

    const breakEvenInfo = {
        months: breakEvenMonths,
        years: breakEvenYears,
        date: breakEvenDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        monthlyCost: monthlyCost,
        margin: margin,
        isProfitable: breakEvenMonths > durationMonths
    };

    return {
        // Property values
        estimatedValue,
        propertyPrice,
        realPriceM2,
        avgPriceM2,
        priceDiffPercent,
        surface,

        // Duration & Disease
        lifeExpectancy,
        baseExpectancy: lifeExpectancyData.baseExpectancy,
        durationMonths,
        durationYears,
        diseaseInfo: lifeExpectancyData.disease,
        diseaseImpact: lifeExpectancyData.impactPercent,
        lifeReduction: lifeExpectancyData.reduction,

        // Couple info
        isCouple,
        coupleInfo,

        // DUH analysis
        duhCoef,
        duhValue,
        bareOwnership,

        // Costs
        bouquet,
        rente,
        totalRentes,
        totalTaxesFoncieres,
        taxeFonciereAnnuelle: taxeFonciere,
        notaryFees,
        totalCost,

        // Comparison
        bouquetDiff,
        directPurchaseCost,
        savings,
        profitability: savings > 0 ? `+${savingsPercent}%` : `${savingsPercent}%`,
        isPositive: savings > 0,

        // Break-even
        breakEvenInfo
    };
}

function formatCurrency(value) {
    return value.toLocaleString('fr-FR') + ' €';
}

function displayResults(r) {
    // Property values section
    document.getElementById('estimatedValue').textContent = formatCurrency(r.estimatedValue);
    document.getElementById('marketPrice').textContent = formatCurrency(r.propertyPrice);

    // Show real price/m² with comparison to DVF average
    const realPriceM2El = document.getElementById('realPriceM2');
    if (r.realPriceM2 > 0) {
        const diffSign = r.priceDiffPercent >= 0 ? '+' : '';
        realPriceM2El.textContent = `${r.realPriceM2.toLocaleString('fr-FR')} €/m² (${diffSign}${r.priceDiffPercent}%)`;
        realPriceM2El.style.color = r.priceDiffPercent > 10 ? '#ef4444' : r.priceDiffPercent < -10 ? '#22c55e' : '#fafafa';
    } else {
        realPriceM2El.textContent = '—';
        realPriceM2El.style.color = '#fafafa';
    }

    // Duration & Disease section
    document.getElementById('diseaseDisplay').textContent = r.diseaseInfo.name;
    document.getElementById('baseExpectancy').textContent = `${r.baseExpectancy} ans`;

    const diseaseImpactEl = document.getElementById('diseaseImpact');
    if (r.diseaseImpact > 0) {
        diseaseImpactEl.textContent = `-${r.lifeReduction} ans (-${r.diseaseImpact}%)`;
        diseaseImpactEl.style.color = r.diseaseImpact > 30 ? '#ef4444' : r.diseaseImpact > 15 ? '#f97316' : '#eab308';
    } else {
        diseaseImpactEl.textContent = 'Aucun';
        diseaseImpactEl.style.color = '#22c55e';
    }

    // Update life expectancy display with couple info
    const lifeExpEl = document.getElementById('lifeExpectancy');
    if (r.isCouple && r.coupleInfo) {
        lifeExpEl.textContent = `${r.lifeExpectancy} ans (couple +10%)`;
        lifeExpEl.style.color = '#60a5fa';
    } else {
        lifeExpEl.textContent = `${r.lifeExpectancy} ans`;
        lifeExpEl.style.color = '#fafafa';
    }

    document.getElementById('duration').textContent = `${r.durationYears} ans (${r.durationMonths} mois)`;
    document.getElementById('duhCoef').textContent = `${Math.round(r.duhCoef * 100)}%`;

    // Costs section
    document.getElementById('bouquetDisplay').textContent = formatCurrency(r.bouquet);
    document.getElementById('totalRentes').textContent = formatCurrency(r.totalRentes);
    document.getElementById('totalTaxesFoncieres').textContent = formatCurrency(r.totalTaxesFoncieres);
    document.getElementById('notaryFees').textContent = formatCurrency(r.notaryFees);
    document.getElementById('totalCost').textContent = formatCurrency(r.totalCost);

    // Viager analysis section
    document.getElementById('duhValue').textContent = formatCurrency(r.duhValue);
    document.getElementById('bareOwnership').textContent = formatCurrency(r.bareOwnership);

    const bouquetDiffEl = document.getElementById('bouquetDiff');
    const diffPrefix = r.bouquetDiff >= 0 ? '+' : '';
    bouquetDiffEl.textContent = `${diffPrefix}${r.bouquetDiff.toLocaleString('fr-FR')} €`;
    bouquetDiffEl.style.color = r.bouquetDiff > 0 ? '#ef4444' : '#22c55e';

    // Rentability section
    const savingsEl = document.getElementById('savings');
    savingsEl.textContent = `${r.isPositive ? '+' : ''}${r.savings.toLocaleString('fr-FR')} €`;

    document.getElementById('profitability').textContent = r.profitability;

    // Break-even section
    const be = r.breakEvenInfo;
    const breakEvenDurEl = document.getElementById('breakEvenDuration');
    const breakEvenDateEl = document.getElementById('breakEvenDate');

    if (be.isProfitable) {
        breakEvenDurEl.textContent = `${be.years} ans (${be.months} mois)`;
        breakEvenDurEl.style.color = '#22c55e';
    } else {
        breakEvenDurEl.textContent = `${be.years} ans ⚠️ Risque`;
        breakEvenDurEl.style.color = '#ef4444';
    }
    breakEvenDateEl.textContent = be.date;

    // Break-even details
    document.getElementById('bePropertyValue').textContent = formatCurrency(r.propertyPrice);
    document.getElementById('beBouquet').textContent = formatCurrency(r.bouquet);
    document.getElementById('beRente').textContent = formatCurrency(r.rente) + '/mois';
    document.getElementById('beTaxe').textContent = formatCurrency(r.taxeFonciereAnnuelle);
    document.getElementById('beNotary').textContent = formatCurrency(r.notaryFees);
    document.getElementById('beMonthlyCost').textContent = formatCurrency(Math.round(be.monthlyCost)) + '/mois';
    document.getElementById('beMargin').textContent = formatCurrency(Math.round(be.margin));
    document.getElementById('beMonths').textContent = `${be.months} mois (${be.years} ans)`;

    emptyState.style.display = 'none';
    resultsBody.style.display = 'block';
}

// ===== Event Listeners =====
addressInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => searchAddress(e.target.value), 300);
});

document.addEventListener('click', (e) => {
    if (!addressSuggestions.contains(e.target) && e.target !== addressInput) {
        hideSuggestions();
    }
});

// ===== Auto-calculate function =====
function autoCalculate() {
    // Check if address is selected
    if (!selectedLocation || currentAvgPriceM2 === 0) {
        return; // Silently return, don't show alert for auto-calc
    }

    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value);
    const surface = parseFloat(document.getElementById('surface').value) || 0;
    const bouquet = parseFloat(document.getElementById('bouquet').value);
    const rente = parseFloat(document.getElementById('rente').value);
    const taxeFonciere = parseFloat(document.getElementById('taxeFonciere').value) || 0;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const disease = document.getElementById('disease').value;

    // Check if minimum required fields are filled
    if (!propertyPrice || !bouquet || !rente || !age || !surface || surface <= 0) {
        return; // Not enough data yet
    }

    if (age < 50 || age > 110) {
        return; // Invalid age
    }

    // Check for second person (couple)
    const age2Input = document.getElementById('age2');
    const secondPersonSection = document.getElementById('secondPersonSection');
    let person2 = null;

    if (secondPersonSection.style.display !== 'none' && age2Input.value) {
        const age2 = parseInt(age2Input.value);
        if (age2 >= 50 && age2 <= 110) {
            person2 = {
                age: age2,
                gender: document.getElementById('gender2').value,
                disease: document.getElementById('disease2').value
            };
        }
    }

    const results = calculateViager({
        propertyPrice,
        surface,
        bouquet,
        rente,
        age,
        gender,
        disease,
        avgPriceM2: currentAvgPriceM2,
        taxeFonciere,
        person2
    });
    displayResults(results);
}

// Debounced auto-calculate
let calcDebounceTimer = null;
function debouncedAutoCalculate() {
    clearTimeout(calcDebounceTimer);
    calcDebounceTimer = setTimeout(autoCalculate, 150);
}

// ===== Add input listeners for dynamic calculation =====
const formInputs = [
    'propertyPrice', 'surface', 'bouquet', 'rente', 'taxeFonciere',
    'age', 'gender', 'disease', 'age2', 'gender2', 'disease2'
];

formInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', debouncedAutoCalculate);
        el.addEventListener('change', debouncedAutoCalculate);
    }
});

viagerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Vérifier qu'une adresse a été sélectionnée
    if (!selectedLocation || currentAvgPriceM2 === 0) {
        alert('Veuillez d\'abord sélectionner une adresse pour obtenir le prix au m² du quartier.');
        addressInput.focus();
        return;
    }

    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value);
    const surface = parseFloat(document.getElementById('surface').value) || 0;
    const bouquet = parseFloat(document.getElementById('bouquet').value);
    const rente = parseFloat(document.getElementById('rente').value);
    const taxeFonciere = parseFloat(document.getElementById('taxeFonciere').value) || 0;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const disease = document.getElementById('disease').value;

    if (!propertyPrice || !bouquet || !rente || !age) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    if (!surface || surface <= 0) {
        alert('Veuillez indiquer la surface du bien pour calculer la valeur estimée.');
        return;
    }

    if (age < 50 || age > 110) {
        alert('L\'âge doit être entre 50 et 110 ans');
        return;
    }

    // Check for second person (couple)
    const age2Input = document.getElementById('age2');
    const secondPersonSection = document.getElementById('secondPersonSection');
    let person2 = null;

    if (secondPersonSection.style.display !== 'none' && age2Input.value) {
        const age2 = parseInt(age2Input.value);
        if (age2 >= 50 && age2 <= 110) {
            person2 = {
                age: age2,
                gender: document.getElementById('gender2').value,
                disease: document.getElementById('disease2').value
            };
        }
    }

    const results = calculateViager({
        propertyPrice,
        surface,
        bouquet,
        rente,
        age,
        gender,
        disease,
        avgPriceM2: currentAvgPriceM2,
        taxeFonciere,
        person2
    });
    displayResults(results);
});

// ===== Surface change handler to estimate price =====
document.getElementById('surface').addEventListener('input', (e) => {
    const surface = parseFloat(e.target.value);
    const avgPriceText = avgPriceEl.textContent;
    const priceInput = document.getElementById('propertyPrice');

    if (surface && avgPriceText && !avgPriceText.includes('—') && !avgPriceText.includes('Non')) {
        const avgPrice = parseInt(avgPriceText.replace(/[^\d]/g, ''));
        if (avgPrice && !priceInput.value) {
            priceInput.value = Math.round(avgPrice * surface);
        }
    }
});

// ===== Toggle Second Person Section =====
function toggleSecondPerson() {
    const section = document.getElementById('secondPersonSection');
    const indicator = document.getElementById('toggleIndicator');

    if (section.style.display === 'none') {
        section.style.display = 'block';
        indicator.textContent = '− Retirer';
        indicator.classList.add('active');
    } else {
        section.style.display = 'none';
        indicator.textContent = '+ Ajouter';
        indicator.classList.remove('active');
        // Clear fields when hiding
        document.getElementById('age2').value = '';
        document.getElementById('gender2').value = 'male';
        document.getElementById('disease2').value = 'none';
    }
}

// ===== Toggle Break-Even Details =====
function toggleBreakEvenDetails() {
    const details = document.getElementById('breakEvenDetails');
    const btn = document.getElementById('breakEvenBtn');

    if (details.style.display === 'none') {
        details.style.display = 'block';
        btn.textContent = '📉 Masquer';
        btn.classList.add('active');
    } else {
        details.style.display = 'none';
        btn.textContent = '📉 Voir détails';
        btn.classList.remove('active');
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    console.log('ViagerPro v1.2 initialized with map, couple support & break-even analysis');
});
