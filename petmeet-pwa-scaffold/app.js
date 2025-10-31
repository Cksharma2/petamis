const logEl = document.getElementById('log');
const installBtn = document.getElementById('installBtn');
let deferredPrompt;

function log(msg){ 
  const time = new Date().toLocaleTimeString();
  logEl.textContent = `[${time}] ${msg}\n` + logEl.textContent;
}

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
  log('beforeinstallprompt fired');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  log('User response to install: ' + outcome);
  deferredPrompt = null;
  installBtn.style.display = 'none';
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      log('Service worker registered, scope: ' + reg.scope);
    } catch (err) {
      log('Service worker register failed: ' + err);
    }
  });
}

// sample UI actions
document.getElementById('refreshBtn').addEventListener('click', () => {
  log('Refreshing data (demo)');
  // placeholder for API call
  fetch('/api/pets').then(r=>r.json()).then(d=>log('Fetched: ' + JSON.stringify(d))).catch(e=>log('Fetch failed: ' + e));
});
document.getElementById('sampleAdd').addEventListener('click', () => {
  log('Added sample meetup (local only)');
});
