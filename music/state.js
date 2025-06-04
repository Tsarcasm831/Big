export const songsData = {
  songsMasterList: [],
  filteredSongs: [],
  searchTerm: '',
  selectedGenre: 'all',
  sortType: 'title',
  currentPage: 1,
  pageSize: 16,
  likeStatus: JSON.parse(localStorage.getItem('songLikes') || '{}'),
  modalSongIdx: 0,
};

export function setStateValue(key, value) {
  if (key in songsData) {
    songsData[key] = value;
    if (key === 'likeStatus') {
      localStorage.setItem('songLikes', JSON.stringify(value));
    }
  } else {
    console.warn(`Attempted to set unknown state key: ${key}`);
  }
}

export function toggleLikeState(songId) {
  songsData.likeStatus[songId] = !songsData.likeStatus[songId];
  localStorage.setItem('songLikes', JSON.stringify(songsData.likeStatus));
}