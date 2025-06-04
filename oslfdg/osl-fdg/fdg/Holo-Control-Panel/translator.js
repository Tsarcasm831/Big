// translator.js
// Simple Skree translation via Caesar shift (+1) on all text.

function caesarShift(str, shift = 1) {
  return str.replace(/[A-Za-z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
}

function translateDOM() {
  document.querySelectorAll('*').forEach(el => {
    [...el.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text) {
          node.nodeValue = node.nodeValue.replace(text, caesarShift(text));
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Patch dynamic messages
  if (typeof window.addMessage === 'function') {
    const orig = window.addMessage;
    window.addMessage = msg => orig(caesarShift(msg));
  }
  translateDOM();
});
