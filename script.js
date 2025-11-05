document.addEventListener('DOMContentLoaded', () => {
  fetch('./mock.json')
    .then(response => response.json())
    .then(data => {
      renderCards(data.trendingSongs, 'trending-cards');
      renderCards(data.popularArtists, 'artist-cards', true);
      renderCards(data.albums, 'album-cards');
      renderCards(data.radio, 'radio-cards');
    })
    .catch(err => console.error('Error loading mock data:', err));
});

// Create ONE global audio element
const audio = new Audio('assets/Nippulaa-Swasa-Ga-MassTamilan.io.mp3');
let currentPlaying = null; // Track which card is currently playing
let isPlaying = false; // Global state for player bar

function renderCards(items, containerId, isArtist = false) {
  const container = document.getElementById(containerId);

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="img-container">
        <img src="${item.image}" alt="${item.title || item.name}">
        <div class="play-btn" data-index="${index}" data-audio="${item.audio || 'assets/Nippulaa-Swasa-Ga-MassTamilan.io.mp3'}">
          <img src="assets/icons8-play-30.png" alt="Play">
        </div>
      </div>
      <h3>${item.title || item.name}</h3>
      ${isArtist ? '' : `<p>${item.artist || ''}</p>`}
    `;

    container.appendChild(card);
  });

  // Add event listeners after all cards are added
  container.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => handlePlayButtonClick(btn));
  });
}

function handlePlayButtonClick(button) {
  const playIcon = button.querySelector('img');
  const newAudioSrc = button.dataset.audio;

  // If same button clicked again → toggle pause/play
  if (currentPlaying === button) {
    if (audio.paused) {
      audio.play();
      playIcon.src = 'assets/icons8-pause-30.png';
    } else {
      audio.pause();
      playIcon.src = 'assets/icons8-play-30.png';
    }
    isPlaying = !audio.paused;
    updateMainPlayButton();
    return;
  }

  // Reset all play icons
  document.querySelectorAll('.play-btn img').forEach(img => {
    img.src = 'assets/icons8-play-30.png';
  });

  // Update audio source and start new song
  currentPlaying = button;
  audio.src = newAudioSrc;
  audio.currentTime = 0;
  audio.play();
  playIcon.src = 'assets/icons8-pause-30.png';
  isPlaying = true;
  updateMainPlayButton();
}

// Reset icon when song ends
audio.addEventListener('ended', () => {
  if (currentPlaying) {
    currentPlaying.querySelector('img').src = 'assets/icons8-play-30.png';
    currentPlaying = null;
  }
  isPlaying = false;
  updateMainPlayButton();
});

// Player bar controls
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

seekBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value;
});

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }
  updateMainPlayButton();
});

function updateMainPlayButton() {
  const img = playPauseBtn.querySelector('img');
  img.src = isPlaying ? 'assets/icons8-pause-30.png' : 'assets/icons8-play-30.png';
}
