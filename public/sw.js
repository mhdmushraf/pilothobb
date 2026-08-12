// PilotHobb service worker — minimal & safe.
// Registers a fetch handler (required for PWA installability / PWABuilder)
// but does NOT cache responses, so the app always loads the latest version
// and updates are never served stale.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { /* pass-through: let the network handle every request */ });
