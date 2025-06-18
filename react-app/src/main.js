import './components/quote-form.js';
import './components/quote-list.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => { /* ... */ });