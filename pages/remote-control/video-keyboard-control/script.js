const DEFAULT_ROBOT_PROFILE = "RPI_BW_001";
/**
 * ESP_CW_001
 * RPI_BW_001
 * RPI_CL_001
 * RPI_CL_002
 * RPI_CW_001
 * RPI_HA_001
 * RPI_HW_001
 * JTSN_HW_001
 */
const deviceNamePrefixMap = {
  ESP_CW_001: "CoPlay",
  RPI_BW_001: "BBC",
};
/**
 * Bluetooth 서비스 및 특성 UUID
 */
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

const {
  pairButton,
  sendMediaServerInfoButton,
  openWebSocketButton,
  stopButton,
} = initializeDOMElements();
let {
  device,
  websocket,
  networkConfig,
  controlCommandMap,
  loadedImages,
  lastDirection,
} = initializeVariables();

function initializeDOMElements() {
  const pairButton = document.getElementById("pairButton");
  const sendMediaServerInfoButton = document.getElementById(
    "sendMediaServerInfoButton"
  );
  const openWebSocketButton = document.getElementById("openWebSocketButton");
  const stopButton = document.getElementById("stopButton");

  return {
    pairButton,
    sendMediaServerInfoButton,
    openWebSocketButton,
    stopButton,
  };
}

function initializeVariables() {
  let device;
  let websocket;
  let networkConfig = {};
  let controlCommandMap = {
    KeyW: "N",
    KeyA: "CCW",
    KeyS: "S",
    KeyD: "CW",
    KeyM: "STOP",
  };
  let loadedImages = [];
  let lastDirection;

  return {
    device,
    websocket,
    networkConfig,
    controlCommandMap,
    loadedImages,
    lastDirection,
  };
}

async function bluetoothPairing() {
  const ssidInput = document.getElementById("ssidInput");
  const passwordInput = document.getElementById("passwordInput");
  const hostInput = document.getElementById("hostInput");
  const portInput = document.getElementById("portInput");
  const channelInput = document.getElementById("channelInput");

  const robotSelect = document.getElementById("robotSelect");
  const robotNameInput = document.getElementById("robotNameInput");

  device = await connectToBluetoothDevice(
    deviceNamePrefixMap[robotSelect.value] ?? undefined
  );
  robotNameInput.value = device.name;
}

function sendMediaServerInfo() {
  const robotSelect = document.getElementById("robotSelect");

  networkConfig = {
    ssid: ssidInput.value,
    password: passwordInput.value,
    host: hostInput.value,
    port: portInput.value,
    channel: "instant",
    channel_name: channelInput.value,
  };

  const devicePort =
    window.location.protocol.replace(/:$/, "") === "http"
      ? networkConfig.port
      : networkConfig.port - 1;

  if (device) {
    const metricData = {
      type: "metric",
      data: {
        server: {
          ssid: networkConfig.ssid,
          password: networkConfig.password,
          host: networkConfig.host,
          port: devicePort,
          path: `pang/ws/pub?channel=instant&name=${networkConfig.channel_name}&track=video&mode=bundle`,
        },
        profile: robotSelect.value,
      },
    };
    sendMessageToDeviceOverBluetooth(JSON.stringify(metricData), device);
  }
}

function openWebSocket() {
  const canvasElement = document.getElementById("canvasElement");
  // const path = ...; // TODO: Create the WebSocket path based on networkConfig
  // const serverURL = ...; // TODO: Create the WebSocket server URL using protocol, host, port, and path

  // websocket = ...; // TODO: Create a new WebSocket instance using the serverURL
  // websocket.binaryType = "arraybuffer";

  // TODO: Step 1 - Set up WebSocket event handlers
  // TODO: Set 'onopen' handler to listen for WebSocket connection
  // TODO: If 'device' is available, add event listeners for keydown and keyup events
  // TODO: Display a message indicating that the WebSocket is open

  // TODO: Step 2 - Create a VideoDecoder instance
  // TODO: Create a new VideoDecoder instance with appropriate configuration
  // TODO: Configure the VideoDecoder codec and supported configurations

  // TODO: Step 3 - Handle WebSocket messages
  // TODO: Set 'onmessage' handler to decode and display video frames
  // TODO: Create an EncodedVideoChunk instance using the received data and timestamp
  // TODO: Decode the encoded chunk using the VideoDecoder

  // TODO: Step 4 - Keep the WebSocket alive
  // TODO: Call the 'keepWebSocketAlive' function to maintain WebSocket connection


  keepWebSocketAlive(websocket);
}

function stop() {
  websocket.close();
  disconnectFromBluetoothDevice(device);
}

async function connectToBluetoothDevice(deviceNamePrefix) {
  const options = {
    filters: [
      { services: [UART_SERVICE_UUID] },
    ].filter(Boolean),
  };

  try {
    // TODO: Step 1 - Search for a Bluetooth device with a specific service UUID
    // TODO: Use the 'navigator.bluetooth.requestDevice' function with the 'options' to find a device
    // TODO: Store the selected device in a variable named 'device'

    // TODO: Step 2 - Establish a GATT connection
    // TODO: Use the 'device.gatt?.connect()' function to establish a GATT connection
    // TODO: Handle any errors that might occur during the connection process

    // TODO: Step 3 - Return the connected device
    // TODO: Return the 'device' object after successfully connecting
  } catch (error) {
    // TODO: Handle any errors that occur during the device discovery or connection
    console.error(error);
  }
}

function disconnectFromBluetoothDevice(device) {
  // TODO: Check if the Bluetooth device is connected
  // TODO: Use the 'device.gatt?.connected' property to determine if the device is currently connected

  // TODO: If the device is connected, initiate the disconnection process
  // TODO: Use the 'device.gatt.disconnect()' function to disconnect from the Bluetooth server

  // TODO: If the device is not connected, handle the case
  // TODO: Log a message to the console indicating that the device is already disconnected
}

async function sendMessageToDeviceOverBluetooth(message, device) {
  const MAX_MESSAGE_LENGTH = 15;
  
  // TODO: Step 1 - Prepare the message chunks
  // TODO: Split the 'message' into smaller chunks of length 'MAX_MESSAGE_LENGTH'
  // TODO: Store each chunk in the 'messageArray' array

  // TODO: Step 2 - Add length information to the first chunk
  // TODO: Modify the first chunk in 'messageArray' to include the length information

  // TODO: Step 3 - Add special characters to other chunks
  // TODO: Modify the remaining chunks in 'messageArray' to include special characters

  // TODO: Step 4 - Establish GATT connection and get required objects
  // TODO: Connect to the GATT server of the 'device'
  // TODO: Get the UART service from the server
  // TODO: Get the UART RX characteristic from the service

  // TODO: Step 5 - Send the message chunks
  // TODO: Check if the 'rxCharacteristic' properties support writing
  // TODO: Use a loop to send each chunk to the device
  // TODO: Encode each chunk using 'TextEncoder' before sending
  // TODO: Handle errors that may occur during the write operation
}

async function receiveVideo() {
  // const canvasElement = document.getElementById("canvasElement");

  // const mime = ...; // TODO: Set the MIME type and codec for the video
  
  // const handleChunk = ...; // TODO: Define the function to handle video frames
  // const videoDecoder = ...; // TODO: Create a new VideoDecoder instance with output and error handlers
  
  // await VideoDecoder.isConfigSupported({...}); // TODO: Check if the codec configuration is supported
  // videoDecoder.configure({...}); // TODO: Configure the VideoDecoder with the codec

  // TODO: Step 1 - Handle WebSocket messages
  // TODO: Set 'onmessage' handler to decode and display video frames
  // TODO: Create an EncodedVideoChunk instance using the received data and timestamp
  // TODO: Decode the encoded chunk using the VideoDecoder
  
  // TODO: Step 2 - Handle decoding errors
  // TODO: Catch any errors that occur during video decoding
  // TODO: Log the error using 'console.error'
}

function drawVideoFrameOnCanvas(canvas, frame) {
  console.log("drawing video frame on canvas");
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = frame.displayWidth;
  tempCanvas.height = frame.displayHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  console.log("drawVideoFrameOnCanvas", frame);
}

async function handleKeyDown(e) {
  // TODO: Step 1 - Determine the control command direction
  // TODO: Set 'direction' based on the key event or any other logic
  
  // TODO: Step 2 - Check if the direction has changed
  // TODO: Compare the direction to 'lastDirection', return if they are the same
  
  // TODO: Step 3 - Create and send the control command
  // TODO: Create a control command object with type 'control' and 'direction'
  // TODO: Use 'JSON.stringify' to convert the control command to a JSON string
  
  // TODO: Step 4 - Send the control command over WebSocket
  // TODO: Check if 'websocket' is open and send the control command using 'websocket.send()'
  // TODO: Display a message using 'displayMessage()'
}

async function handleKeyUp(e) {
  const direction = "STOP";
  if (direction === lastDirection) return;
  lastDirection = direction;

  const controlCommand = {
    type: "control",
    direction,
  };

  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(controlCommand));
    displayMessage(direction);
  }
}

function displayMessage(messageContent) {
  const messageView = document.getElementById("messageView");

  if (typeof messageContent == "object") {
    messageContent = JSON.stringify(messageContent);
  }
  messageView.innerHTML += `${messageContent}\n`;
  messageView.scrollTop = messageView.scrollHeight;
}

function keepWebSocketAlive(webSocket, interval) {
  const pingInterval = interval ?? 10000;
  let pingTimer;

  function sendPing() {
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.send("ping");
    }
  }

  function schedulePing() {
    pingTimer = setInterval(sendPing, pingInterval);
  }

  function handlePong() {}

  function handleWebSocketClose() {
    clearInterval(pingTimer);
  }

  webSocket.addEventListener("open", () => {
    schedulePing();
  });

  webSocket.addEventListener("message", (event) => {
    if (event.data === "pong") {
      handlePong();
    }
  });

  webSocket.addEventListener("close", () => {
    handleWebSocketClose();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  pairButton.addEventListener("click", bluetoothPairing);
  sendMediaServerInfoButton.addEventListener("click", sendMediaServerInfo);
  openWebSocketButton.addEventListener("click", openWebSocket);
  stopButton.addEventListener("click", stop);
});
