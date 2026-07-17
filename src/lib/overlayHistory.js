// Minimal overlay history manager: lets the Android back button / browser
// swipe dismiss the topmost custom overlay (bottom sheet, select sheet, etc.)
// instead of navigating backward or closing the app.
//
// Each open overlay registers a dismiss callback and pushes one history entry.
// On a genuine popstate the topmost callback is invoked. When an overlay closes
// via its own UI, its entry is popped silently (guarded so it never dismisses
// a lower overlay — e.g. closing a select sheet won't close the form under it).

let dismissStack = [];
let internalPop = false;
let listenerAttached = false;

function onPopState() {
  if (internalPop) {
    internalPop = false;
    return;
  }
  if (dismissStack.length > 0) {
    const dismiss = dismissStack.pop();
    if (typeof dismiss === "function") dismiss();
  }
}

function ensureListener() {
  if (listenerAttached) return;
  listenerAttached = true;
  window.addEventListener("popstate", onPopState);
}

export function pushOverlay(dismiss) {
  dismissStack.push(dismiss);
  ensureListener();
  window.history.pushState({ phOverlay: true }, "");
}

export function popOverlay(dismiss) {
  const idx = dismissStack.lastIndexOf(dismiss);
  if (idx !== -1) dismissStack.splice(idx, 1);
  // Only pop the history entry if ours is still the current one.
  if (window.history.state && window.history.state.phOverlay) {
    internalPop = true;
    window.history.back();
  }
}