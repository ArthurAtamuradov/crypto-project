const { getBinancePrices, getHuobiPrices } = require("../utils/apiUtils");

let bestRates = {};

async function updateRates() {
  //getting prices

  let [binancePrices, huobiPrices] = await Promise.all([
    getBinancePrices(),
    getHuobiPrices(),
  ]);

  //selecting usdt symbols
  const usdtSymbols = binancePrices
    .filter(({ symbol }) => symbol.endsWith("USDT"))
    .map(({ symbol }) => symbol);

  huobiPrices
    .filter(({ symbol }) => symbol.endsWith("usdt"))
    .forEach((price) => {
      const usdtSymbol = price.symbol.toUpperCase();

      if (!usdtSymbols.includes(usdtSymbol)) {
        usdtSymbols.push(usdtSymbol);
      }
    });

  //selecting best prices
  usdtSymbols.forEach((symbol) => {
    const binancePrice = binancePrices.find(({ symbol: s }) => s === symbol);

    const huobiPrice = huobiPrices.find(
      ({ symbol: s }) => s.toLowerCase() === symbol.toLowerCase()
    );

    bestRates[symbol] = binancePrice
      ? { price: parseFloat(binancePrice.price), exchange: "Binance" }
      : null;

    const huobiRate = huobiPrice ? parseFloat(huobiPrice.close) : -1;

    if (
      huobiPrice &&
      (!binancePrice || huobiRate > parseFloat(binancePrice.price))
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
