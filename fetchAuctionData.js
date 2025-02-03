export async function fetchAuctionData() {
    const response = await fetch("https://api.hypixel.net/skyblock/auctions");
    const data = await response.json();
    return data.auctions;
}
