export async function fetchBazaarData() {
    const response = await fetch("https://api.hypixel.net/skyblock/bazaar");
    const data = await response.json();
    return data.products;
}
