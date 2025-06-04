import { songs } from './data.js';
import { state } from './state.js';
import { renderSongsGrid, renderPagination, createSongCard, formatDate, highlightSearch } from './ui.js';
import { gridEventsInit, controlsInit, modalEventsInit } from './events.js';

document.addEventListener('DOMContentLoaded', ()=>{
  renderSongsGrid();
  gridEventsInit();
  controlsInit();
  modalEventsInit();

  // On grid changes, re-lazyload grid images
  const gridObs = new MutationObserver(()=>lazyLoadImages());
  gridObs.observe(document.getElementById('songsGrid'),{childList:true,subtree:false});
});

function lazyLoadImages() {
  if ("loading" in HTMLImageElement.prototype) {
    document.querySelectorAll('.song-card img.card-img-top').forEach(img =>{
      img.setAttribute('loading','lazy');
    });
  }
}