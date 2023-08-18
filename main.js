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

function handleSearch() {
  const searchQuery = document.getElementById('search-bar').value.trim().toLowerCase();
  const bookList = document.getElementById('book-list');
  if (searchQuery === '') {
    // If the search query is empty, reset the displayed books to all books
    filteredBooks = [...books];
  } else {
    console.log(searchQuery)
    // Filter the books based on the search query
    filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.category.toLowerCase().includes(searchQuery)
    );
    console.log(filteredBooks)
    // Modify the function to include the "Buy" button
    filteredBooks.forEach((book) => {
      const bookCard = `
    <div class="col-lg-4 mb-4">
      <div class="card">
        <img src="${book.image}" >
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Price: SEK ${book.price}</p>
          <button class="btn btn-primary" onclick="handleBuy(${book.id})">Buy</button>
        </div>
      </div>
    </div>
  `;
      bookList.innerHTML += bookCard;
    });

  }
  displayBooks(filteredBooks);
}


function sortBooks(books) {
  console.log(sortOption)
  console.log(sortDirection)
  return books.sort((a, b) => {
    if (sortOption === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortOption === 'title') {
      return sortDirection === 'asc' ? a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }) : b.title.localeCompare(a.title, undefined, { sensitivity: 'base' });
    } else if (sortOption === 'author') {
      return sortDirection === 'asc' ? a.author.localeCompare(b.author, undefined, { sensitivity: 'base' }) : b.author.localeCompare(a.author, undefined, { sensitivity: 'base' });
    } else {
      // Default to sort by title 
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    }
  });
}

// Modify the displayBooks function to use the sortBooks function
function displayBooks(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';
  console.log(sortDirection)

  // Filter the books based on the selected filters
  let filteredBooks = books.filter((book) => {
    const categoryMatch = selectedCategory === 'All' || book.category === selectedCategory;
    const authorMatch = selectedAuthor === 'All' || book.author === selectedAuthor;
    const priceMatch = selectedPriceRange === 'All' || (book.price >= Number(selectedPriceRange.split('-')[0]) && book.price <= Number(selectedPriceRange.split('-')[1]));

    return categoryMatch && authorMatch && priceMatch;
  });
  console.log(filteredBooks)
  // Sort the filtered books
  filteredBooks = sortBooks(filteredBooks);
  console.log(filteredBooks)


  // Render the filtered and sorted books
  filteredBooks.forEach((book) => {
    const bookCard = `
      <div class="col-lg-4 mb-4">
        <div class="card" onclick="displayBookDetails(${book.id})">
          <img src="${book.image}" >  
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Price: SEK ${book.price}</p>
            <p class="card-text">Author: ${book.author}</p>
          </div>
        </div>
        <div class="button-container">
  <div class="details-button">
    <button class="btn btn-primary" onclick="displayBookDetails(${book.id})">Details</button>
  </div>
  <div class="buy-button">
    <button class="btn btn-primary" onclick="handleBuy(${book.id})">Buy</button>
  </div>
</div>

      </div>
    `;
    bookList.innerHTML += bookCard;
  });
}

function handleFilterChange() {
  selectedCategory = document.getElementById('category-filter').value;
  selectedAuthor = document.getElementById('author-filter').value;
  selectedPriceRange = document.getElementById('price-filter').value;
  displayBooks(books);
}

function handleSortOptionChange() {
  const sortOptionSelect = document.getElementById('sort-option');
  const selectedValue = sortOptionSelect.value;

  // Extract sortOption and sortDirection from the selected value
  const [option, direction] = selectedValue.split('-');
  sortOption = option;
  sortDirection = direction;

  // Re-render the books with the new sorting settings
  displayBooks(books);
}

