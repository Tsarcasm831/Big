import { setStateValue } from './state.js';

const rawSongsData = [
  { title: "Watch Out", plays: 2, dailyListeners: 1, purchases: 0, shazams: 0, radio: 0 },
  { title: "Don't Pretend You Care!", plays: 1, dailyListeners: 1, purchases: 0, shazams: 0, radio: 0 },
  { title: "Grey Matter Tavern", plays: 1, dailyListeners: 1, purchases: 0, shazams: 0, radio: 0 },
  { title: "...but so Do I!", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "98 Percent", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Ain't Love the Shit (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Another Me (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Bad Day (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Barely There", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Behind the Mirror", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Burn the Bridges", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Bury It Twice (Translation Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Cacophony Divine (feat. Julia Reilly)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Candles in the Dark", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Carapace", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Citizen of the World", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "City of Shadows", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Completely", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Creepy Thing", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Cursed (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Danger Rises", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Dangerous Discovery", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Disapointing Again", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Done with Me (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Empty Little Soul (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "End of a Chapter", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Everywhere You Go", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Feel It in My Veins", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Flashback", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Fool's Mate", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Funeral", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Glad You're Mine", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Grateful", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Harmonious Complexity.", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Hold on Tight.", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "I Can Go Anywhere!", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "I Could... I Could... (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "I Will Rise", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "I'm the Captain Now (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Infinity", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Intro", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Is It Better out There?", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "It's Not About the Weather (2024 Remaster)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "It's Not About the Weather (feat. Alexi Dimitriou)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Just an Update...", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Just Older Now", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Lord Tsarcasm Emerges", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "M.W.Y.M.I. (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Memories", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Minion", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Moral Compass", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Moral Compass (Radio Edit)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "No! Anything but That!", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Paper Walls", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Patterns and Atoms", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Play This When I'm Gone (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Princess and the Fool", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Prozac Shine (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Puppet on a Wire (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Quantum Foam", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Regrets of a Grown Teenager (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Riddle Me", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Routine", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "S.V.T (Out in the Cold)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "S.V.T (Out in the Cold) (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Sadboi (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Sands of Time", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Seeds and Stones (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Shoot Me Down (feat. Alexi Dimitriou)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Shred World", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Solitude (feat. Julia Reilly)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Stars and Scars", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Stay Here", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Step into Forever (feat. Julia Reilly) (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Success the Obsession (Concept Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Sunken World.", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Supernova", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Team of One", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Tear Down the Walls (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "The Journey of Six Strings", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "The Script", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "The Sound of Violence", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "The Stand", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "The Story Grows Old (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Thirty - Five Candles", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "This Ain't Paradise (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Timeline", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Too Late - It Rises", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Truth in the Mute (feat. Julia Reilly)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Vengeance", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Watch Me Bleed (feat. Julia Reilly)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Watch Me Bleed (feat. Julia Reilly) (2024 Version)", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Watch Out.", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "What Happened", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Wretch", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Yes, I Really Can", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 },
  { title: "Zhilu Kala Sona", plays: 0, dailyListeners: 0, purchases: 0, shazams: 0, radio: 0 }
];

const songCount = rawSongsData.length;

const genres = [
  'Pop', 'Rock', 'Hip-hop', 'Electronic',
  'Folk', 'R&B', 'Indie', 'Experimental', 'Other'
];

function pickGenre(i) {
  return genres[i % genres.length];
}

function pickArtist(i, title) {
  return "Lord Tsarcasm";
}

function fakeLyrics(idx, genre, title) {
  const randomVerses = [
    "Verse 1: In the city's heart, where shadows play,",
    "Verse 1: Sunlight paints the morning gold,",
    "Verse 1: Underneath a sky of gray,",
    "Verse 1: A secret story starts to unfold,",
    "Verse 1: Echoes of a distant yesterday,"
  ];
  const randomChoruses = [
    "Chorus: We're chasing dreams along the way,",
    "Chorus: Feel the rhythm, let it take control,",
    "Chorus: This melody will light our soul,",
    "Chorus: United by the music's sway,",
    "Chorus: In this moment, we are whole."
  ];
  const randomBridges = [
    "Bridge: Stars align, the future's bright,",
    "Bridge: Through the darkness, find the light,",
    "Bridge: Every note a guiding sign,",
    "Bridge: A symphony of yours and mine,",
    "Bridge: Time stands still, in perfect flight."
  ];

  let generatedLyrics = `${title.toUpperCase()}\n\n`;
  generatedLyrics += `(Artist: ${pickArtist(idx, title)})\n`;
  generatedLyrics += `(Genre: ${genre} / Track ID: ${idx + 1})\n\n`;
  
  generatedLyrics += `${randomVerses[idx % randomVerses.length]}\n`;
  generatedLyrics += `The world keeps spinning, ${title.toLowerCase()}.\n\n`;
  generatedLyrics += `${randomChoruses[(idx + 1) % randomChoruses.length]}\n`;
  generatedLyrics += `Oh, ${title.toLowerCase()}, it's true.\n\n`;
  generatedLyrics += `${randomBridges[(idx + 2) % randomBridges.length]}\n`;
  generatedLyrics += `Leading us to something new, with ${title.toLowerCase()}.\n\n`;
  generatedLyrics += `Outro: Yeah, the story of ${title}...\n(End of placeholder lyrics)`;
  
  return generatedLyrics;
}

function randomLinks(idx) {
  const uniqueId = `track_${idx}_${Math.random().toString(36).substring(2,8)}`;
  return [
    { label: 'Spotify', url: `https://open.spotify.com/track/${uniqueId}`, icon: 'fab fa-spotify' },
    { label: 'Apple Music', url: `https://music.apple.com/album/song/${uniqueId}`, icon: 'fab fa-apple' },
    { label: 'YouTube', url: `https://youtube.com/watch?v=${uniqueId}`, icon: 'fab fa-youtube' }
  ];
}

function randomDateInLastYear(i) {
  const now = Date.now();
  const lastYear = now - 365 * 24 * 60 * 60 * 1000;
  return new Date(lastYear + ((i / songCount) * (now - lastYear)));
}

export function initializeData() {
  const processedSongs = rawSongsData.map((row, i) => {
    const songId = i + 1;
    const genre = pickGenre(i);
    const songTitle = row.title;
    const artist = pickArtist(i, songTitle);

    const imagePath = `/generated_song_covers/song_${songId}_cover.png`;

    return {
      id: songId,
      title: songTitle,
      artist: artist,
      genre,
      image: imagePath, 
      audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${((i % 16) + 1)}.mp3`, 
      added: randomDateInLastYear(i),
      lyrics: fakeLyrics(i, genre, songTitle),
      links: randomLinks(i + 17), 
      likes: Math.floor(Math.random() * 100) + row.plays, 
      thumbs: [imagePath, imagePath, imagePath], 
      plays: row.plays,
      dailyListeners: row.dailyListeners,
      purchases: row.purchases,
      shazams: row.shazams,
      radio: row.radio
    };
  });
  setStateValue('songsMasterList', processedSongs);
}