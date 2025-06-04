import { songsData, setStateValue, toggleLikeState } from './state.js';
import { renderSongsGrid, updateSongModalContent, observeGridChangesForLazyLoad } from './ui.js';

let songModalInstance = null; // To store Bootstrap modal instance

// --- SEARCH, FILTER, SORT --- //
export function doFilterSort() {
  let newFilteredSongs = songsData.selectedGenre === "all"
    ? songsData.songsMasterList.slice()
    : songsData.songsMasterList.filter(s => s.genre === songsData.selectedGenre);

  if (songsData.searchTerm) {
    const term = songsData.searchTerm.toLowerCase();
    newFilteredSongs = newFilteredSongs.filter(s =>
      s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term)
    );
  }

  newFilteredSongs.sort((a, b) => {
    if (songsData.sortType === "artist") {
      return a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title);
    } else if (songsData.sortType === "recent") {
      return b.added - a.added;
    }
    return a.title.localeCompare(b.title) || a.artist.localeCompare(b.artist);
  });

  setStateValue('filteredSongs', newFilteredSongs);
  setStateValue('currentPage', 1);
  renderSongsGrid();
}


// --- MODAL --- //
export function openSongModal(song, idx) {
  setStateValue('modalSongIdx', idx);
  updateSongModalContent(song);

  const modalEl = document.getElementById('songModal');
  if (!songModalInstance) {
    // Ensure bootstrap is available or handle error
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        songModalInstance = new bootstrap.Modal(modalEl);
    } else {
        console.error("Bootstrap Modal is not available.");
        // Fallback or alert user, though this should ideally not happen with correct setup
        modalEl.style.display = 'block'; // crude fallback
        modalEl.classList.add('show');
        return; // cannot proceed with bootstrap modal logic
    }
  }
  songModalInstance.show();
}

function showPrevSongInModal() {
  if (songsData.modalSongIdx > 0) {
    openSongModal(songsData.filteredSongs[songsData.modalSongIdx - 1], songsData.modalSongIdx - 1);
  }
}

function showNextSongInModal() {
  if (songsData.modalSongIdx < songsData.filteredSongs.length - 1) {
    openSongModal(songsData.filteredSongs[songsData.modalSongIdx + 1], songsData.modalSongIdx + 1);
  }
}


// --- EVENT LISTENERS INITIALIZATION --- //
export function initEventListeners() {
  // Search
  document.getElementById('searchInput').addEventListener('input', (ev) => {
    setStateValue('searchTerm', ev.target.value.trim());
    doFilterSort();
  });
  document.getElementById('searchForm').addEventListener('submit', ev => ev.preventDefault());

  // Sort
  document.getElementById('sortSelect').addEventListener('change', (ev) => {
    setStateValue('sortType', ev.target.value);
    doFilterSort();
  });

  // Filter
  document.getElementById('filterSelect').addEventListener('change', (ev) => {
    setStateValue('selectedGenre', ev.target.value);
    doFilterSort();
  });

  // Grid clicks (details & like)
  document.getElementById('songsGrid').addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.open-like-btn');
    if (likeBtn) {
      e.stopPropagation(); // Important to prevent card click logic if like is clicked
      const songId = parseInt(likeBtn.getAttribute('data-like-song-id'));
      toggleLikeState(songId);
      renderSongsGrid(); // Re-render to update like count on card
      // If modal is open for this song, update it too
      if (songModalInstance && songsData.filteredSongs[songsData.modalSongIdx]?.id === songId) {
         updateSongModalContent(songsData.filteredSongs[songsData.modalSongIdx]);
      }
      return; // Like action handled, do nothing more.
    }

    // If the click was not on the like button, check if it was on the card.
    // This will make the entire card (except the like button area handled above)
    // trigger the modal, including the original "Play & Details" button.
    const card = e.target.closest('.song-card');
    if (card) {
      const songId = parseInt(card.getAttribute('data-song-id'));
      const songIdx = songsData.filteredSongs.findIndex(s => s.id === songId);
      if (songIdx !== -1) {
        openSongModal(songsData.filteredSongs[songIdx], songIdx);
      }
    }
  });

  // Pagination
  document.getElementById('pagination').addEventListener('click', (e) => {
    const pbtn = e.target.closest('.page-link');
    if (pbtn && pbtn.dataset.page) {
      setStateValue('currentPage', Number(pbtn.dataset.page));
      renderSongsGrid();
    }
  });

  // Modal controls
  document.getElementById('prevSongBtn').addEventListener('click', showPrevSongInModal);
  document.getElementById('nextSongBtn').addEventListener('click', showNextSongInModal);
  
  document.getElementById('likeBtn').addEventListener('click', function () {
    const song = songsData.filteredSongs[songsData.modalSongIdx];
    if (song) {
        toggleLikeState(song.id);
        updateSongModalContent(song); // Update modal's like button and count
        renderSongsGrid(); // Re-render grid to reflect change if card is visible
    }
  });

  document.getElementById('modalThumbnailList').addEventListener('click', function (e) {
    const img = e.target.closest('img[data-thumb-src]');
    if (!img) return;
    const newImageSrc = img.dataset.thumbSrc;
    const song = songsData.filteredSongs[songsData.modalSongIdx];
    if (song) {
        song.image = newImageSrc; // Update the current song's main image for the modal view
        document.getElementById('modalSongImage').src = newImageSrc;
        Array.from(document.getElementById('modalThumbnailList').children)
             .forEach(tn => tn.classList.toggle('active', tn.dataset.thumbSrc === newImageSrc));
    }
  });
  
  // Audio player progress
  const audioPlayer = document.getElementById('modalAudioPlayer');
  audioPlayer.addEventListener('timeupdate', () => {
    const percent = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration * 100) : 0;
    document.getElementById('audioProgressBar').style.width = percent + '%';
  });

  // Modal keyboard navigation
  const modalEl = document.getElementById('songModal');
  modalEl.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") showPrevSongInModal();
    if (e.key === "ArrowRight") showNextSongInModal();
  });
  
  // Close modal on escape key if bootstrap is not fully handling it (e.g. crude fallback)
  modalEl.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && modalEl.classList.contains('show')) {
        if (songModalInstance && typeof songModalInstance.hide === 'function') {
            songModalInstance.hide();
        } else {
            // Crude fallback hide
            modalEl.style.display = 'none';
            modalEl.classList.remove('show');
            const backdrop = document.querySelector('.modal-backdrop');
            if(backdrop) backdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    }
  });
  
  // Handle modal close button if bootstrap is not fully handling it
  const closeButton = modalEl.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (songModalInstance && typeof songModalInstance.hide === 'function') {
                songModalInstance.hide();
            } else {
                // Crude fallback hide
                modalEl.style.display = 'none';
                modalEl.classList.remove('show');
                const backdrop = document.querySelector('.modal-backdrop');
                if(backdrop) backdrop.remove();
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
        });
    }


  // Observe grid for image lazy loading updates
  observeGridChangesForLazyLoad();
}