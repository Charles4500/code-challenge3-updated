// Import the function to be tested
const { renderMovieDetails } = require('./index');

// Mock the necessary DOM elements
document.body.innerHTML = `
  <div>
    <img id="poster" />
    <h1 id="title"></h1>
    <p id="runtime"></p>
    <p id="film-info"></p>
    <p id="showtime"></p>
    <p id="ticket-num"></p>
    <button id="buy-ticket"></button>
  </div>
`;

// Mock the necessary data
const movie = {
  id: 1,
  poster: 'https://example.com/poster.jpg',
  title: 'Movie Title',
  runtime: 120,
  description: 'Movie description',
  showtime: '8:00 PM',
  capacity: 100,
  tickets_sold: 50,
};

// Test the renderMovieDetails function
describe('renderMovieDetails', () => {
  beforeEach(() => {
    // Clear the DOM elements before each test
    document.getElementById('poster').src = '';
    document.getElementById('title').textContent = '';
    document.getElementById('runtime').textContent = '';
    document.getElementById('film-info').textContent = '';
    document.getElementById('showtime').textContent = '';
    document.getElementById('ticket-num').textContent = '';
    document.getElementById('buy-ticket').disabled = false;
    document.getElementById('buy-ticket').textContent = 'Buy Ticket';
  });

  it('should render movie details correctly', () => {
    renderMovieDetails(movie);

    // Assert that the DOM elements have been updated correctly
    expect(document.getElementById('poster').src).toBe(movie.poster);
    expect(document.getElementById('title').textContent).toBe(movie.title);
    expect(document.getElementById('runtime').textContent).toBe(`${movie.runtime} minutes`);
    expect(document.getElementById('film-info').textContent).toBe(movie.description);
    expect(document.getElementById('showtime').textContent).toBe(movie.showtime);
    expect(document.getElementById('ticket-num').textContent).toBe(`${50} remaining tickets`);
    expect(document.getElementById('buy-ticket').disabled).toBe(false);
    expect(document.getElementById('buy-ticket').textContent).toBe('Buy Ticket');
  });

  it('should disable buy ticket button and update ticket count when remaining tickets is 0', () => {
    movie.tickets_sold = 100;
    renderMovieDetails(movie);

    // Assert that the buy ticket button is disabled and the ticket count is updated
    expect(document.getElementById('ticket-num').textContent).toBe(`${0} remaining tickets`);
    expect(document.getElementById('buy-ticket').disabled).toBe(true);
    expect(document.getElementById('buy-ticket').textContent).toBe('Sold Out');
  });

  it('should increment tickets sold and update ticket count when buy ticket button is clicked', async () => {
    renderMovieDetails(movie);

    // Simulate a click on the buy ticket button
    document.getElementById('buy-ticket').click();

    // Wait for the async updateTicketsSold function to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert that the tickets sold and ticket count are updated
    expect(movie.tickets_sold).toBe(51);
    expect(document.getElementById('ticket-num').textContent).toBe(`${49} remaining tickets`);
  });

  it('should show an alert when buy ticket button is clicked and remaining tickets is 0', async () => {
    movie.tickets_sold = 100;
    renderMovieDetails(movie);

    // Spy on the window.alert function
    const alertSpy = jest.spyOn(window, 'alert');

    // Simulate a click on the buy ticket button
    document.getElementById('buy-ticket').click();

    // Wait for the async updateTicketsSold function to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert that the alert is shown
    expect(alertSpy).toHaveBeenCalledWith('This showing is sold out.');
  });
});