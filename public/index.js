priceElement = document.getElementById("price");
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:3000');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("Connected to WS Server");
});

// Listen for messages
socket.addEventListener('message', function (event) {
    var date = new Date();
    // console.log(date.toGMTString(), 'Message from server ', event.data);
    console.log(event.data);
    priceElement.innerText = event.data;
});
