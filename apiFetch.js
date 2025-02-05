// apiFetch.js

/**
 * Ruft die Auktionen von der Hypixel API ab.
 * Diese Daten werden beispielsweise für den Kat Flip (Pet Upgrade) benötigt.
 *
 * @returns {Promise<Array>} Ein Promise, das ein Array von Auktionen zurückgibt.
 */
export async function fetchAuctionData() {
  const response = await fetch("https://api.hypixel.net/skyblock/auctions");
  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Auktionen");
  }
  const data = await response.json();
  return data.auctions; // Annahme: Die API liefert ein Objekt mit einem "auctions"-Array.
}

/**
 * Ruft die Bazaar-Daten von der Hypixel API ab.
 * Diese Daten werden beispielsweise für den Forge Flip benötigt.
 *
 * @returns {Promise<Object>} Ein Promise, das ein Objekt mit Bazaar-Produkten zurückgibt.
 */
export async function fetchBazaarData() {
  const response = await fetch("https://api.hypixel.net/skyblock/bazaar");
  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Bazaar-Daten");
  }
  const data = await response.json();
  return data.products; // Annahme: Die API liefert ein Objekt mit den Produkten.
}
