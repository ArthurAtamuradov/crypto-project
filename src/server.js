const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { updateRates } = require("./services/ratesService");
require("dotenv").config();

const refreshRate = process.env.REFRESH_RATE || 2000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.send("connected");
});

async function broadcastRates() {
  const bestRates = await updateRates();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "rates", data: bestRates }));
    }
  });
}

setInterval(async () => {
  await broadcastRates();
}, refreshRate);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
