const axios = require("axios");

const binanceApi = "https://api.binance.com/api/v3/ticker/price";
const huobiApi = "https://api.huobi.pro/market/tickers";

async function getBinancePrices() {
  try {
    const response = await axios.get(binanceApi);
    return response.data;
  } catch (error) {
    console.error("Error fetching Binance prices:", error.message);
  }
}

async function getHuobiPrices() {
  try {
    const response = await axios.get(huobiApi);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Huobi prices:", error.message);
  }
}

module.exports = {
  getBinancePrices,
  getHuobiPrices,
};
