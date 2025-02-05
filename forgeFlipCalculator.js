// forgeFlipCalculator.js

import { fetchBazaarData } from "./apiFetch.js";

/**
 * Lädt die Kosten aus der Datei costs.json.
 * Diese Datei sollte einen Abschnitt "forge" enthalten, in dem die Materialien und deren Kosten für Items hinterlegt sind.
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
 * Ermittelt automatisch die profitabelsten Forge Flips.
 * Für jedes in costs.json hinterlegte Item wird:
 * - die Bazaar-Daten (über fetchBazaarData) abgerufen,
 * - der aktuelle Verkaufspreis (marketPrice) ermittelt,
 * - die Herstellungskosten (Summe der Materialkosten) berechnet,
 * - der Profit (marketPrice minus Herstellungskosten) bestimmt.
 *
 * @returns {Promise<Array>} Eine Liste der Forge Items mit berechnetem Profit, sortiert absteigend.
 */
export async function findBestForgeFlips() {
  const costs = await fetchCosts();
  const forgeCosts = costs.forge; // Annahme: costs.json hat einen "forge"-Abschnitt

  // Bazaar-Daten abrufen
  const bazaarProducts = await fetchBazaarData();

  const calculatedFlips = [];

  for (const itemName in forgeCosts) {
    if (!forgeCosts.hasOwnProperty(itemName)) continue;
    const itemData = forgeCosts[itemName];
    // Berechne die Gesamtkosten aus den Materialkosten
    const totalCost = itemData.materials.reduce((sum, mat) => sum + (mat.cost * mat.amount), 0);

    // Suche in den Bazaar-Daten nach dem passenden Item.
    // Zuerst direkt per Schlüssel, andernfalls über einen Namensvergleich.
    let bazaarItem = bazaarProducts[itemName];
    if (!bazaarItem) {
      bazaarItem = Object.values(bazaarProducts).find(product =>
        product.product_name && product.product_name.toLowerCase() === itemName.toLowerCase()
      );
    }
    if (!bazaarItem) {
      // Überspringe das Item, falls keine Bazaar-Daten vorliegen.
      continue;
    }

    // Verwende den sellPrice als Verkaufswert (Passe dies bei Bedarf an)
    const marketPrice = bazaarItem.sellPrice || 0;
    const profit = marketPrice - totalCost;

    calculatedFlips.push({
      item: itemName,
      totalCost,
      marketPrice,
      profit
    });
  }

  // Sortiere absteigend nach Profit
  calculatedFlips.sort((a, b) => b.profit - a.profit);
  return calculatedFlips;
}
