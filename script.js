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

function renderCards(items, containerId, isArtist = false) {
  const container = document.getElementById(containerId);

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="img-container">
    <img src="${item.image}" alt="${item.title || item.name}">
    <div class="play-btn">
      <img src="assets/icons8-play-30.png" alt="Play">
    </div>
  </div>
  <h3>${item.title || item.name}</h3>
  ${isArtist ? '' : `<p>${item.artist || ''}</p>`}
    `;

    container.appendChild(card);
  });
}
