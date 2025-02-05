// katFlipCalculator.js

import { fetchAuctionData } from "./apiFetch.js";

/**
 * Lädt die Kosten aus der Datei costs.json.
 * Diese Datei sollte einen Abschnitt "pet" enthalten, in dem die Upgrade‑Kosten, Seltenheit,
 * erwarteter Marktwert usw. hinterlegt sind.
 *
 * @returns {Promise<Object>} Die JSON-Daten aus costs.json.
 */
async function fetchCosts() {
  const response = await fetch("./costs.json");
  if (!response.ok) {
    throw new Error("Fehler beim Laden der costs.json");
  }
  return response.json();
}

/**
 * Filtert die Auktionen nach dem angegebenen Pet-Namen und gibt den niedrigsten Startpreis zurück.
 * (Je nach API-Struktur musst du hier möglicherweise den Feldnamen anpassen.)
 *
 * @param {Array} auctions - Array von Auktionen aus der API.
 * @param {string} petName - Name des Pets.
 * @returns {number|null} - Der niedrigste gefundene Preis oder null, falls kein passender Eintrag existiert.
 */
function getLowestAuctionPrice(auctions, petName) {
  // Hier erfolgt ein einfacher Filter basierend auf dem Namen.
  const filtered = auctions.filter(a => 
    a.item_name && a.item_name.toLowerCase().includes(petName.toLowerCase())
  );
  if (filtered.length === 0) return null;
  const lowest = filtered.reduce((min, a) => {
    const bid = Number(a.starting_bid) || 0;
    return bid < min ? bid : min;
  }, Infinity);
  return lowest === Infinity ? null : lowest;
}

/**
 * Ermittelt automatisch die profitabelsten Kat Flips.
 * Für jedes in costs.json hinterlegte Pet wird:
 * - die Auktionen (über fetchAuctionData) abgerufen,
 * - der niedrigste Marktpreis ermittelt (falls vorhanden, sonst wird ein erwarteter Wert verwendet),
 * - der Profit (Marktpreis minus Upgrade-Kosten) berechnet.
 *
 * @returns {Promise<Array>} Eine Liste der Pets mit berechnetem Profit, sortiert absteigend.
 */
export async function findBestKatFlips() {
  const costs = await fetchCosts();
  const petCosts = costs.pet; // Annahme: costs.json hat einen "pet"-Abschnitt

  // Auktionen abrufen
  const auctions = await fetchAuctionData();

  const calculatedFlips = [];

  for (const petName in petCosts) {
    if (!petCosts.hasOwnProperty(petName)) continue;
    const petData = petCosts[petName];
    // Ermittle den aktuellen Marktpreis anhand der Auktionen.
    // Falls keine Auktion gefunden wird, wird der in costs.json hinterlegte expectedValue genutzt.
    const marketPrice = getLowestAuctionPrice(auctions, petName) || petData.expectedValue;
    const profit = marketPrice - petData.upgradeCost;

    calculatedFlips.push({
      pet: petName,
      rarity: petData.rarity,
      upgradeCost: petData.upgradeCost,
      marketPrice,
      profit
    });
  }

  // Sortiere absteigend nach Profit
  calculatedFlips.sort((a, b) => b.profit - a.profit);
  return calculatedFlips;
}
