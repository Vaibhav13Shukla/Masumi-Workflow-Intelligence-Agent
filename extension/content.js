// Masumi Content Recorder
console.log("Masumi Recorder Active");

let sessionID = Date.now().toString();

function sanitizeMetadata(obj) {
  try {
    // Remove circular references and non-serializable data
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return {};
  }
}

function getSelector(element) {
  if (!element || !element.tagName) return 'UNKNOWN';
  
  const tag = element.tagName;
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className && typeof element.className === 'string' ? 
    `.${element.className.split(' ').filter(c => c).join('.')}` : '';
  
  // Limit length to 200 characters
  return `${tag}${id}${classes}`.substring(0, 200);
}

function recordAction(type, target, metadata = {}) {
  const action = {
    user_id: "demo_user", // In real app, sync from storage
    type: type,
    target: getSelector(target),
    url: window.location.href,
    timestamp: Math.floor(Date.now()), // Ensure integer
    metadata: sanitizeMetadata(metadata)
  };

  // Send to background
  chrome.runtime.sendMessage({ type: "RECORD_ACTION", payload: action });
}

// Listeners
document.addEventListener('click', (e) => {
  recordAction('click', e.target, { text: e.target.innerText });
}, true);

document.addEventListener('submit', (e) => {
  recordAction('submit', e.target);
}, true);

document.addEventListener('change', (e) => {
  recordAction('input', e.target, { value: e.target.value });
}, true);
