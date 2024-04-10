// Your code here
// Base URL(which is a global variable) for API
const baseUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
 // This function fetches all movies from the API
  async function fetchMovies() {
      const response = await fetch(`${baseUrl}/films`);
      const data = await response.json();
      return data;
    
  }

  // This function fetches a single movie by its ID from the API
  async function fetchMovieById(id) {
      const response = await fetch(`${baseUrl}/films/${id}`);
      const data = await response.json();
      return data;
  }

  // This function updates the number of tickets sold for a movie
  async function updateTicketsSold(id, ticketsSold) {
      await fetch(`${baseUrl}/films/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: ticketsSold }),
      });
  }

  // This function takes a movie object and renders its details on the page
  async function renderMovieDetails(movie) {
      const poster = document.getElementById('poster');
      const title = document.getElementById('title');
      const runtime = document.getElementById('runtime');
      const filmInfo = document.getElementById('film-info');
      const showtime = document.getElementById('showtime');
      const ticketNum = document.getElementById('ticket-num');
      const buyTicketBtn = document.getElementById('buy-ticket');

      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = `${movie.runtime} minutes`;
      filmInfo.textContent = movie.description;
      showtime.textContent = movie.showtime;

      const remainingTickets = movie.capacity - movie.tickets_sold;
      ticketNum.textContent = `${remainingTickets} remaining tickets`;

      if (remainingTickets <= 0) {
          buyTicketBtn.disabled = true;
          buyTicketBtn.textContent = 'Sold Out';
      } else {
          buyTicketBtn.disabled = false;
          buyTicketBtn.textContent = 'Buy Ticket';
      }

      buyTicketBtn.onclick = async () => {
          if (remainingTickets <= 0) {
              alert('This showing is sold out.');
              return;
          }

          const newTicketsSold = movie.tickets_sold + 1;
          await updateTicketsSold(movie.id, newTicketsSold);
          const updatedRemainingTickets = movie.capacity - newTicketsSold;
          ticketNum.textContent = `${updatedRemainingTickets} remaining tickets`;

          if (updatedRemainingTickets <= 0) {
              buyTicketBtn.disabled = true;
              buyTicketBtn.textContent = 'Sold Out';
          }
      };
  }

  // This function fetches all movies and renders them in the menu
  async function renderMoviesMenu() {
      const movies = await fetchMovies();
      const filmsList = document.getElementById('films');

      filmsList.innerHTML = '';
      movies.forEach((movie) => {
          const li = document.createElement('li');
          li.classList.add('film', 'item');
          li.textContent = movie.title;
          li.addEventListener('click', async () => {
              const movieDetails = await fetchMovieById(movie.id);
              renderMovieDetails(movieDetails);
          });
          filmsList.appendChild(li);
      });
  }

  // Finally, call the renderMoviesMenu function to render the movies menu
  renderMoviesMenu();
  fetchMovieById(1).then(renderMovieDetails);
});