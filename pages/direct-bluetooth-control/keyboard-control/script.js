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

const { pairButton, sendButton, stopButton } = initializeDOMElements();
let { device, controlCommandMap, lastDirection } = initializeVariables();

function initializeDOMElements() {
  const pairButton = document.getElementById("pairButton");
  const sendButton = document.getElementById("sendButton");
  const stopButton = document.getElementById("stopButton");

  return {
    pairButton,
    sendButton,
    stopButton,
  };
}

function initializeVariables() {
  let device;
  let controlCommandMap = {
    KeyW: "N",
    KeyA: "CCW",
    KeyS: "S",
    KeyD: "CW",
    KeyM: "STOP",
  };
  let lastDirection;

  return {
    device,
    controlCommandMap,
    lastDirection,
  };
}

async function bluetoothPairing() {
  device = await connectToBluetoothDevice(
    deviceNamePrefixMap[robotSelect.value] ?? undefined
  );
  robotNameInput.value = device.name;
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

async function sendCommand() {
  // TODO: Step 1 - Check if 'device' exists
  // TODO: Return early from the function if 'device' is not provided

  // TODO: Step 2 - Connect to the GATT server
  // TODO: Use 'device.gatt?.connect()' to establish a connection to the GATT server

  // TODO: Step 3 - Get the UART service and RX characteristic
  // TODO: Get the primary service with UUID 'UART_SERVICE_UUID' from the server
  // TODO: Get the characteristic with UUID 'UART_RX_CHARACTERISTIC_UUID' from the service
  
  // TODO: Step 4 - Register event listeners for keydown and keyup events
  // TODO: Use 'document.addEventListener' to listen for 'keydown' events
  // TODO: Call 'handleKeyDown' function with the event and 'rxCharacteristic'
  // TODO: Use 'document.addEventListener' to listen for 'keyup' events
  // TODO: Call 'handleKeyUp' function with the event and 'rxCharacteristic'

}

function stop() {
  // TODO: Step 1 - Check if the device is connected
  // TODO: Use 'device.gatt?.connected' to determine if the device is currently connected

  // TODO: Step 2 - Disconnect the device if connected
  // TODO: If the device is connected, use 'device.gatt.disconnect()' to disconnect
  // TODO: If the device is not connected, log a message indicating it is already disconnected
}

async function handleKeyDown(e, rxCharacteristic) {
  const direction = controlCommandMap[e.code];
  if (direction === lastDirection) return;
  lastDirection = direction;

  const controlCommand = {
    type: "control",
    direction,
  };

  // TODO: Step 1 - Try to send the control command
  // TODO: Use 'rxCharacteristic?.writeValueWithoutResponse()' to send the encoded data
  // TODO: Wrap this code in a 'try' block to catch any errors that may occur

  // TODO: Step 2 - Handle errors
  // TODO: Catch the error object if an error occurs during the write operation
  // TODO: Log an error message using 'console.error'

  displayMessage(direction);
}

async function handleKeyUp(e, rxCharacteristic) {
  const direction = "STOP";
  if (direction === lastDirection) return;
  lastDirection = direction;

  const controlCommand = {
    type: "control",
    direction,
  };

  // TODO: Step 1 - Try to send the control command
  // TODO: Use 'rxCharacteristic?.writeValueWithoutResponse()' to send the encoded data
  // TODO: Wrap this code in a 'try' block to catch any errors that may occur

  // TODO: Step 2 - Handle errors
  // TODO: Catch the error object if an error occurs during the write operation
  // TODO: Log an error message using 'console.error'
  
  displayMessage(direction);
}

function displayMessage(messageContent) {
  if (typeof messageContent == "object") {
    messageContent = JSON.stringify(messageContent);
  }
  messageView.innerHTML += `${messageContent}\n`;
  messageView.scrollTop = messageView.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  pairButton.addEventListener("click", bluetoothPairing);
  sendButton.addEventListener("click", sendCommand);
  stopButton.addEventListener("click", stop);
});
