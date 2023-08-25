import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

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
  gestureRecognizer,
  runningMode,
  controlCommandMap,
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
  let gestureRecognizer;
  let runningMode = "IMAGE";
  let controlCommandMap = {
    Closed_Fist: "N",
   //TODO: Define more gesture by yourself
    Victory: "STOP",
  };
  let lastDirection;

  return {
    device,
    websocket,
    networkConfig,
    gestureRecognizer,
    runningMode,
    controlCommandMap,
    lastDirection,
  };
}

async function bluetoothPairing() {
  const robotSelect = document.getElementById("robotSelect");
  const robotNameInput = document.getElementById("robotNameInput");

  device = await connectToBluetoothDevice(
    deviceNamePrefixMap[robotSelect.value] ?? undefined
  );
  robotNameInput.value = device.name;
}

function sendMediaServerInfo() {
  const ssidInput = document.getElementById("ssidInput");
  const passwordInput = document.getElementById("passwordInput");
  const hostInput = document.getElementById("hostInput");
  const portInput = document.getElementById("portInput");
  const channelInput = document.getElementById("channelInput");
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
  const videoElement = document.getElementById("videoElement");

  const path = `pang/ws/sub?channel=instant&name=${networkConfig.channel_name}&track=video&mode=bundle`;
  const serverURL = `${
    window.location.protocol.replace(/:$/, "") === "https" ? "wss" : "ws"
  }://${networkConfig.host}:${networkConfig.port}/${path}`;

  websocket = new WebSocket(serverURL);
  websocket.binaryType = "arraybuffer";
  websocket.onopen = async () => {
    if (device) {
      await getVideoStream({
        deviceId: device.id,
      }).then(async (stream) => {
        videoElement.srcObject = stream;

        await createGestureRecognizer().then(() => {
          detectHandGestureFromVideo(gestureRecognizer, stream);
        });
      });
    }
  };
  displayMessage("Open Video WebSocket");
  keepWebSocketAlive(websocket);
}

function stop() {
  websocket.close();
  disconnectFromBluetoothDevice(device);
}

async function createGestureRecognizer() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
}

async function detectHandGestureFromVideo(gestureRecognizer, stream) {
  if (!gestureRecognizer) return;

  const videoTrack = stream.getVideoTracks()[0];
  const capturedImage = new ImageCapture(videoTrack);
  while (true) {
    await capturedImage.grabFrame().then((imageBitmap) => {
      const detectedGestures = gestureRecognizer.recognize(imageBitmap);

      const {
        landmarks,
        worldLandmarks,
        handednesses,
        gestures,
      } = detectedGestures;

      if (gestures[0]) {
        const gesture = gestures[0][0].categoryName;

        if (Object.keys(controlCommandMap).includes(gesture)) {
          const direction = controlCommandMap[gesture];
          if (direction !== lastDirection) {
            lastDirection = direction;

            const controlCommand = {
              type: "control",
              direction,
            };
            if (websocket && websocket.readyState === WebSocket.OPEN) {
              websocket.send(JSON.stringify(controlCommand));
              displayMessage(`Send '${direction}' command`);
            }
          }
        }
      }
    });
  }
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

async function getVideoStream({
  deviceId,
  idealWidth,
  idealHeight,
  idealFrameRate,
}) {
  return navigator.mediaDevices.getUserMedia({
    video: deviceId
      ? {
          deviceId,
          width: { min: 640, ideal: idealWidth },
          height: { min: 400, ideal: idealHeight },
          frameRate: { ideal: idealFrameRate, max: 120 },
        }
      : true,
  });
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
