import { songsData, setStateValue } from './state.js';
import { openSongModal } from './events.js';

// --- RENDER UTILITIES --- //
export function formatDate(dt) {
  return dt.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export function highlightSearch(text, term) {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  return text.replace(re, '<mark>$1</mark>');
}

// --- CARD & GRID RENDERING --- //
function createSongCard(song) {
  const imgSrc = song.image ? song.image : "https://placehold.co/300x300/2a2a3e/e0e0e0?text=No+Cover"; // Adjusted placeholder for dark theme
  const badges = `
    <div class="song-badges">
      <span class="song-genre-badge">${song.genre}</span>
    </div>
  `;

  const metricsTable = `
    <div class="small song-metrics-table text-center mt-2">
      <div>
        <span class="metric-label" title="Plays"><i class="fa fa-play"></i> ${song.plays}</span>
        <span class="metric-label" title="Avg. Daily Listeners"><i class="fa fa-users"></i> ${song.dailyListeners}</span>
        <span class="metric-label" title="Purchases"><i class="fa fa-shopping-cart"></i> ${song.purchases}</span>
      </div>
      <div>
        <span class="metric-label" title="Shazam Count"><i class="fa fa-music"></i> ${song.shazams}</span>
        <span class="metric-label" title="Radio Spins"><i class="fa fa-broadcast-tower"></i> ${song.radio}</span>
      </div>
    </div>
  `;

  return `
    <div class="col">
      <div class="card h-100 shadow song-card card-shadow position-relative" style="cursor:pointer;" data-song-id="${song.id}">
        <div style="position:relative;">
          <img src="${imgSrc}" class="card-img-top" alt="${song.title}" style="height:210px;object-fit:cover;" loading="lazy">
          <div class="cover-fade"></div>
          ${badges}
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${highlightSearch(song.title, songsData.searchTerm)}</h5>
          <p class="card-text text-muted mb-1" style="font-size:0.95em;">
            <i class="fa fa-user"></i>
            ${highlightSearch(song.artist, songsData.searchTerm)}
          </p>
          <span title="Added"
            class="badge rounded-pill text-bg-light-dark fw-medium mb-1"> 
            <i class="fa fa-clock"></i> ${formatDate(song.added)}
          </span>
          ${metricsTable}
          <div class="d-flex align-items-center gap-1 mt-auto">
            <button class="btn btn-primary mt-auto open-modal-btn btn-gradient flex-grow-1" tabindex="0" aria-label="Show details for ${song.title}">
              <i class="fa fa-music me-1"></i> Play & Details
            </button>
            <button class="btn btn-light btn-sm open-like-btn border" data-like-song-id="${song.id}" style="margin-left:0.25em;" tabindex="0">
              <i class="fa${songsData.likeStatus[song.id] ? '-solid' : '-regular'} fa-heart"></i>
              <small class="ms-1">${song.likes + (songsData.likeStatus[song.id] ? 1 : 0)}</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderSongsGrid() {
  const grid = document.getElementById('songsGrid');
  document.getElementById('loadingSpinner').style.display = "block";
  
  setTimeout(() => { // Simulate loading delay
    let totalPages = Math.ceil(songsData.filteredSongs.length / songsData.pageSize);
    let songsPage = songsData.filteredSongs.slice(
      (songsData.currentPage - 1) * songsData.pageSize,
      songsData.currentPage * songsData.pageSize
    );
    grid.innerHTML = songsPage.map(createSongCard).join('') || `
      <div class="col">
        <div class="alert alert-info text-center w-100 py-5" style="background-color: #2a2a3e; border-color: #3a3a4e; color: #e0e0e0;"> 
          <i class="fa fa-music fa-2x mb-2"></i> <br>
          No songs found for your filter or search.
        </div>
      </div>`;

    document.getElementById('songsCount').innerHTML =
      `Showing <strong>${songsData.filteredSongs.length}</strong> song${songsData.filteredSongs.length !== 1 ? 's' : ''}, page ${songsData.currentPage} of ${totalPages || 1}`;

    renderPagination(totalPages);
    lazyLoadGridImages();
    document.getElementById('loadingSpinner').style.display = "none";
  }, 125 + Math.random() * 150);
}

function renderPagination(totalPages) {
  const ul = document.getElementById('pagination');
  if (totalPages <= 1) {
    ul.innerHTML = '';
    return;
  }
  let html = '';
  for (let p = 1; p <= totalPages; ++p) {
    html += `
      <li class="page-item${songsData.currentPage === p ? ' active' : ''}">
        <button class="page-link" data-page="${p}">${p}</button>
      </li>
    `;
  }
  ul.innerHTML = html;
}

// --- MODAL DYNAMIC --- //
export function updateSongModalContent(song) {
  document.getElementById('songModalLabel').innerHTML =
    `<span>${highlightSearch(song.title, songsData.searchTerm)}</span>
     <span class="text-muted small ms-1">– ${highlightSearch(song.artist, songsData.searchTerm)}</span>`;

  document.getElementById('modalSongImage').src = song.image ? song.image : "https://placehold.co/300x300/2a2a3e/e0e0e0?text=No+Cover"; // Dark theme placeholder for modal
  document.getElementById('modalSongImage').alt = song.title;
  document.getElementById('modalLyrics').textContent = song.lyrics;
  document.getElementById('modalAudioSource').src = song.audio;
  document.getElementById('modalAudioPlayer').load();
  document.getElementById('audioProgressBar').style.width = '0%';

  document.getElementById('modalGenreBadge').className = 'badge ms-2 fs-6 align-middle'; // Reset class
  document.getElementById('modalGenreBadge').style.background = 'linear-gradient(90deg, #ff0055 27%, #e100ff 80%)'; // Apply dark fantasy genre badge style directly
  document.getElementById('modalGenreBadge').style.color = '#fff';
  document.getElementById('modalGenreBadge').textContent = song.genre;
  document.getElementById('songAddedDate').textContent = formatDate(song.added);

  document.getElementById('modalThumbnailList').innerHTML = song.thumbs
    .map((t, i) => `<img src="${t ? t : 'https://placehold.co/36x36/2a2a3e/e0e0e0?text=N/A'}" alt="cover choice" class="${song.thumbs.indexOf(song.image) === i || (song.image === t && i === 0) ? 'active':''}" data-thumb-src="${t}">`).join('');
    
  const likeBtn = document.getElementById('likeBtn');
  likeBtn.className = 'btn btn-light btn-sm border py-2 px-2' + (songsData.likeStatus[song.id] ? ' liked' : '');
  likeBtn.innerHTML = `<i class="fa${songsData.likeStatus[song.id] ? '-solid' : '-regular'} fa-heart"></i>`;
  document.getElementById('likeCount').textContent = song.likes + (songsData.likeStatus[song.id] ? 1 : 0);

  document.getElementById('modalLinks').innerHTML = song.links.map(
    l => `<a href="${l.url}" target="_blank" rel="noopener" class="btn btn-outline-secondary btn-sm me-2 mb-1"><i class="${l.icon}"></i> ${l.label}</a>`
  ).join('');
  
  const statsDiv = document.getElementById('modalMetricsStats');
  statsDiv.innerHTML = `
    <div class="song-metrics-table-modal mb-1">
      <div>
        <span class="metric-label"><i class="fa fa-play"></i> ${song.plays} <span class="text-muted">plays</span></span> &nbsp;
        <span class="metric-label"><i class="fa fa-users"></i> ${song.dailyListeners} <span class="text-muted">avg. daily</span></span>
      </div>
      <div>
        <span class="metric-label"><i class="fa fa-shopping-cart"></i> ${song.purchases} <span class="text-muted">purchases</span></span> &nbsp;
        <span class="metric-label"><i class="fa fa-music"></i> ${song.shazams} <span class="text-muted">Shazam</span></span> &nbsp;
        <span class="metric-label"><i class="fa fa-broadcast-tower"></i> ${song.radio} <span class="text-muted">radio</span></span>
      </div>
    </div>
  `;

  document.getElementById('prevSongBtn').disabled = (songsData.modalSongIdx <= 0);
  document.getElementById('nextSongBtn').disabled = (songsData.modalSongIdx >= songsData.filteredSongs.length - 1);
}


// --- LAZY IMAGES (faster professional load) --- //
// Note: Modern browsers handle loading="lazy" natively. This is a fallback/enhancement.
function lazyLoadGridImages() {
  const images = document.querySelectorAll('#songsGrid img.card-img-top[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          // No need to change src if browser handles loading="lazy"
          // Potentially add class or other logic if needed
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    images.forEach(img => lazyImageObserver.observe(img));
  }
}

// Call initially and on grid updates if not relying purely on loading="lazy"
let gridObserver;
export function observeGridChangesForLazyLoad() {
    if (gridObserver) gridObserver.disconnect(); // Disconnect previous observer if any
    
    gridObserver = new MutationObserver(() => lazyLoadGridImages());
    gridObserver.observe(document.getElementById('songsGrid'), { childList: true, subtree: false });
    lazyLoadGridImages(); // Initial call
}