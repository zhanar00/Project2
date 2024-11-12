const watchlistMovies = document.getElementById("watchlist-movies");
const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function displayWatchlist() {
  watchlistMovies.innerHTML = '';

  console.log('Watchlist:', watchlist);

  if (watchlist.length === 0) {
    watchlistMovies.innerHTML = "<p>No movies in your watchlist.</p>";
  } else {
    watchlist.forEach(movie => {
      const { title, poster_path, vote_average } = movie;
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getColor(vote_average)}">${roundVote(vote_average)}</span>
        </div>
      `;
      watchlistMovies.appendChild(movieElement);
    });
  }
}

function getColor(vote) {
  if(vote >= 7) {
    return 'green';
  } else if(vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

function roundVote(vote) {
  return Math.round(vote * 10) / 10;
}

document.getElementById('back-to-main').addEventListener('click', () => {
  window.location.href = 'index.html'; // Navigate back to the main page
});



document.addEventListener('DOMContentLoaded', function() {
  displayWatchlist();
});

