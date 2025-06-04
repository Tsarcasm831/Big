document.addEventListener('DOMContentLoaded', function() {
  // Create a floating credits element at the bottom right of the page
  var credits = document.createElement('div');
  credits.style.position = 'fixed';
  credits.style.bottom = '0';
  credits.style.right = '0';
  credits.style.background = 'rgba(0, 0, 0, 0.6)';
  credits.style.color = 'white';
  credits.style.padding = '5px 10px';
  credits.style.fontSize = '12px';
  credits.style.borderRadius = '4px';
  credits.style.zIndex = '3000';
  credits.textContent = 'Built by Lord Tsarcasm';
  document.body.appendChild(credits);
});