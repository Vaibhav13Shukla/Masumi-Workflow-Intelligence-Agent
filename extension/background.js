// Background Service Worker

// Buffer to batch requests
let actionBuffer = [];
const FLUSH_INTERVAL = 5000;
const API_URL = "http://localhost:8000/api/track";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RECORD_ACTION") {
    actionBuffer.push(message.payload);
    console.log("Action buffered:", message.payload.type);
  }
});

// Flush buffer periodically
setInterval(() => {
  if (actionBuffer.length > 0) {
    const action = actionBuffer.shift(); // Send one by one for simple demo, or batch
    
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action)
    })
    .then(res => res.json())
    .then(data => console.log("Synced to Masumi:", data))
    .catch(err => console.error("Sync failed:", err));
  }
}, 1000);
