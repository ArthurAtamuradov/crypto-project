const { getBinancePrices, getHuobiPrices } = require("../utils/apiUtils");

let bestRates = {};

async function updateRates() {
  let [binancePrices, huobiPrices] = await Promise.all([
    getBinancePrices(),
    getHuobiPrices(),
  ]);
  const usdtSymbols = binancePrices
    .filter(({ symbol }) => symbol.endsWith("USDT"))
    .map(({ symbol }) => symbol);

  usdtSymbols.forEach((symbol) => {
    const binancePrice = binancePrices.find(({ symbol: s }) => s === symbol);

    const huobiPrice = huobiPrices.find(
      ({ symbol: s }) => s.toLowerCase() === symbol.toLowerCase()
    );

    const huobiRate = huobiPrice ? parseFloat(huobiPrice.close) : -1;

    bestRates[symbol] = binancePrice
      ? { price: parseFloat(binancePrice.price), exchange: "Binance" }
      : null;

    if (
      huobiPrice &&
      (!bestRates[symbol] || huobiRate > parseFloat(bestRates[symbol].price))
    ) {
      bestRates[symbol] = {
        price: parseFloat(huobiPrice.close),
        exchange: "Huobi",
      };
    }
  });

  return bestRates;
}

module.exports = {
  updateRates,
};
