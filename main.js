async function fetchBooks() {
  try {
    const response = await fetch('books.json');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}
let books = await fetchBooks();

const shoppingCart = [];
const categories = ['All', 'UX', 'HTML', 'CSS', 'JavaScript'];

let filteredBooks = [...books];
let selectedCategory = 'All';
let selectedAuthor = 'All';
let selectedPriceRange = 'All';
let sortOption = 'title'; // Default sort option
let selectedSortOption = 'title'; 
let sortDirection = 'asc'; // Default sort direction


function updateFilterOptions() {
  const categoryFilter = document.getElementById('category-filter');
  const authorFilter = document.getElementById('author-filter');
  const priceFilter = document.getElementById('price-filter');

  const allCategories = ['All', ...new Set(books.map((book) => book.category))];
  const allAuthors = ['All', ...new Set(books.map((book) => book.author))];

  categoryFilter.innerHTML = allCategories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join('');

  authorFilter.innerHTML = allAuthors
    .map((author) => `<option value="${author}">${author}</option>`)
    .join('');

  priceFilter.innerHTML = `
    <option value="All">All</option>
    <option value="0-200">0 - 200</option>
    <option value="200-400">200 - 400</option>
    <option value="400-600">400 - 600</option>
    <option value="600+">600+</option>
  `;
}
