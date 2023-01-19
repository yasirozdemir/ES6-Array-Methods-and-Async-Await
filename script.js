window.onload = () => {
  getBookData();
};

let bookDataArray = [];

const getBookData = async () => {
  try {
    const responseFromAPI = await fetch(
      "https://striveschool-api.herokuapp.com/books"
    );
    const bookData = await responseFromAPI.json();
    renderBooks(bookData);
    bookData.forEach((book) => {
      bookDataArray.push(book);
    });
  } catch (error) {
    // TODO; error alerts could be added
    console.error(error);
  }
};

let shoppingCartArray = [];

let booksPlace = document.querySelector("#books-container > .row");
const renderBooks = (booksArray) => {
  booksPlace.innerHTML = "";
  const booksHTML = booksArray
    .map(({ asin, title, img, price, category }) => {
      return `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="d-flex card mb-4 shadow-sm">
                    <img class="card-img-top w-100" src="${img}" alt="book image"/>
                    <div class="card-body p-2">
                        <div
                        class="d-flex flex-column justify-content-between align-items-center"
                        >
                            <strong class="card-title text-center">${title}</strong>
                            <p class="text-secondary">${category}</p>
                            <p class="text-info">$${price}</p>
                            <div class="btn-group mx-auto">
                                <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary"
                                onclick="add('${asin}', this)"
                                >
                                Add To Cart
                                </button>
                                <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary"
                                onclick="skip('${asin}', this)"
                                >
                                Skip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    })
    .join("");
  booksPlace.innerHTML = booksHTML;
};

const add = (ID, button) => {
  const bookToAdd = bookDataArray.find((book) => book.asin === ID);
  if (!shoppingCartArray.includes(bookToAdd)) shoppingCartArray.push(bookToAdd);
  button.closest(".card").classList.toggle("buy");
};

let shoppingCart = document.querySelector("#shoppingCart .modal-body ul");
let numberOfBooksToBuy = document.querySelector(
  "#shoppingCart .modal-body ol li .text-success"
);
const createShoppingCart = () => {
  shoppingCart.innerHTML = "";

  shoppingCartArray.forEach((bookToBuy) => {
    shoppingCart.innerHTML += `<li class="list-group-item d-flex">
                                        <span class="user-select-none">${bookToBuy.title}</span>
                                        <span class="ml-auto text-info">${bookToBuy.price}</span>
                                    </li>`;
  });
};

const skip = (ID, button) => {
  const bookToSkip = bookDataArray.find((book) => book.asin === ID);
  // todo remove it from the bookDataArray array
  button.closest(".col-12").remove();
};

let foundedBooks = [];
const search = (searchQuery) => {
  if (searchQuery.length >= 3) {
    foundedBooks = bookDataArray.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    renderBooks(foundedBooks);
    return;
  } else {
    renderBooks(bookDataArray);
  }
  foundedBooks = [];
};
