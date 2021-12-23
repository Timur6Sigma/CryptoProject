// import libraries
const express = require("express");
const app = express();
const WebSocket = require("ws");

// log date and time when program started
var date = new Date();
console.log(`${date.toGMTString()} | Program started`);

// #####################################################################

// create http server using express
const server = require("http").createServer(app);

// create websocket server on same port as the http (express) server
const wss = new WebSocket.Server({server:server});

// #####################################################################

// use the following port for the server
const port = 3000;

// use folder called "public" for html, js and css files
app.use(express.static("public"));
// http server listens on port
server.listen(port, function() {
  var date = new Date();
  console.log(`${date.toGMTString()} | Listening on port: ${port}`);
});

// #####################################################################

// declare empty array which will hold the incoming data
var cryptoData = JSON.parse('{"Binance":{"btcusdt_trade":[]}}');
var dataAmountSentAlready = JSON.parse('{"Binance":{"btcusdt_trade":0}}');
// declare variable which will hold how many clients are connected to the server
var connectedClients = 0;

// write functions of the websocket server
// if the client is connected:
wss.on("connection", function connectionWSS(wsClient) {
  // if the client is connected: add 1 to variable "connectedClients" (once)
  connectedClients += 1;
  // if the client is connected: log it (once)
  var date = new Date();
  console.log(`${date.toGMTString()} | New client has connected - Server has ${connectedClients} Clients!`);

  // if the client is connected: every n milliseconds the code in "setInterval" is executed
  setInterval(() => {
    for (var i = dataAmountSentAlready.Binance.btcusdt_trade; i < cryptoData.Binance.btcusdt_trade.length; i++) {
      wsClient.send(cryptoData.Binance.btcusdt_trade[i]);
    }
    dataAmountSentAlready.Binance.btcusdt_trade = cryptoData.Binance.btcusdt_trade.length;
  }, 50);

  // if the client is connected and gets a message:
  wsClient.on("message", function incomingWSS(message) {
      // if the client is connected and gets a message: log the message
      var date = new Date();
      console.log(`${date.toGMTString()} | Received message: ${message.toString()}`);
  });

  // if the client is connected and gets disconnects:
  wsClient.on("close", function closeWSS() {
    // if the client is connected and disconnects: subtract 1 from variable "connectedClients" (once)
    connectedClients -= 1;
    // if the client is connected and disconnects: log it (once)
    var date = new Date();
    console.log(`${date.toGMTString()} | Client has disconnected - Server has ${connectedClients} Clients!`);
  });
});

// #####################################################################

// Create and connect to Binance Websocket
const streamsBinance = ["btcusdt@trade"];
let wsBinance = new WebSocket("wss://fstream.binance.com/stream?streams="+streamsBinance.join("/"));

wsBinance.on("open", function openWsBinance() {
  console.log(`${date.toGMTString()} | Connected to Binance Websocket`);
});

wsBinance.on("message", function incomingWsBinance(data) {
  if (cryptoData.Binance.btcusdt_trade.length > 100000) {
    cryptoData.Binance.btcusdt_trade.shift();
  }
  cryptoData.Binance.btcusdt_trade.push(data.toString());
});

wsBinance.on("ping", function heartbeatWsBinance() {
  var date = new Date();
  console.log(`${date.toGMTString()} | Got a Ping from Binance | Pong has been sent automatically`);
});

wsBinance.on("pong", function heartbeatWsBinance() {
  var date = new Date();
  console.log(`${date.toGMTString()} | Got a Pong from Binance`);
});
