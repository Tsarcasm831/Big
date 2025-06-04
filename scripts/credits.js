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
  credits.style.cursor = 'pointer';
  credits.textContent = 'Built by Lord Tsarcasm';
  
  // Create modal elements
  var modal = document.createElement('div');
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = '3001';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.overflow = 'auto';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  
  var modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#1e1e1e';
  modalContent.style.margin = '15% auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #444';
  modalContent.style.borderRadius = '8px';
  modalContent.style.width = '80%';
  modalContent.style.maxWidth = '500px';
  modalContent.style.color = 'white';
  modalContent.style.textAlign = 'center';
  
  var closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.color = '#aaa';
  closeBtn.style.float = 'right';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.cursor = 'pointer';
  
  var title = document.createElement('h2');
  title.textContent = 'Built by Lord Tsarcasm';
  title.style.marginBottom = '20px';
  title.style.color = '#f9f9f9';
  
  var socialLinks = document.createElement('div');
  socialLinks.innerHTML = `
    <div style="margin-bottom: 15px;">
      <a href="https://facebook.com/lordtsarcasm" target="_blank" style="color: #4267B2; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">Facebook</a>
      <a href="https://open.spotify.com/artist/0tIXtsoLoRKrNEMiwvIkdw?si=ic8AFkIARtSQIQWOhYOWKg" target="_blank" style="color: #1DB954; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">Spotify</a>
      <a href="https://music.apple.com/us/artist/lord-tsarcasm/1719674552" target="_blank" style="color: #FB5BC5; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">Apple Music</a>
      <a href="https://www.youtube.com/@lordtsarcasm" target="_blank" style="color: #FF0000; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">YouTube</a>
      <a href="https://www.youtube.com/channel/UC-YkUOcaLChCEQcp3UlCViA" target="_blank" style="color: #FF0000; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">YouTube Music</a>
      <a href="https://suno.com/@lordtsarcasm" target="_blank" style="color: #7F5AF0; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;">Suno</a>
      <a href="https://websim.ai/@lordtsarcasm/8-bit-apocalypse-woodcutter/" target="_blank" style="color: #00B2FF; text-decoration: none; font-weight: bold; display: block; margin-bottom: 20px;">WebSim</a>
    </div>
    <p style="line-height: 1.6; margin-bottom: 20px;">
      Special thanks to suno.ai, websim.ai, Claude, Claude-desktop, Windsurf, and ChatGPT for being the tools I used to build this project.
    </p>
  `;
  
  // Build the modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(socialLinks);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  document.body.appendChild(credits);
  
  // Event listeners
  credits.addEventListener('click', function() {
    modal.style.display = 'block';
  });
  
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
});