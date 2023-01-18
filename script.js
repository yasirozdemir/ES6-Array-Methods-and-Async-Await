const getBookData = async () => {
  try {
    const responseFromAPI = await fetch(
      "https://striveschool-api.herokuapp.com/books"
    );
    const bookData = await responseFromAPI.json();
    renderBooks(bookData);
  } catch (error) {
    // TODO; error alerts could be added
    console.error(error);
  }
};

let booksPlace = document.querySelector("#books-container > .row");
const renderBooks = (booksArray) => {
  const booksHTML = booksArray
    .map(({ asin, title, img, price, category }) => {
      return `<div class="col-md-2">
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
                                >
                                Add To Cart
                                </button>
                                <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary"
                                >
                                Skip
                                </button>
                            </div>
                            <small class="text-muted">${asin}</small>
                        </div>
                    </div>
                </div>
            </div>`;
    })
    .join("");
  booksPlace.innerHTML = booksHTML;
  functionalButtonsForBooks();
  search();
};

const functionalButtonsForBooks = () => {
  let addToCartButtonNode = document.querySelectorAll(
    "#books-container .card-body .btn-group > button:nth-of-type(1)"
  );
  addToCartButtonNode.forEach((button) => {
    button.addEventListener("click", (eventData) => {
      let { target } = eventData;
      let bookToBuy = target.closest(".card");
      bookToBuy.classList.add("buy");
    });
  });

  let skipButtonNode = document.querySelectorAll(
    "#books-container .card-body .btn-group > button:nth-of-type(2)"
  );
  skipButtonNode.forEach((button) => {
    button.addEventListener("click", (eventData) => {
      let { target } = eventData;
      let bookToBeRemoved = target.closest(".card").parentNode;
      bookToBeRemoved.classList.remove("buy");
      bookToBeRemoved.remove();
    });
  });
};

let numBooks = document.querySelector(
  "#shoppingCart .modal-body ol li span.text-success"
);
const createShoppingCart = () => {
  let shoppingCart = document.querySelector("#shoppingCart .modal-body ul");

  let shoppingCartArray = [];
  let bookToBuy = document.getElementsByClassName("buy");
  for (book of bookToBuy) {
    let bookToBuyFeatures = {
      title: book.childNodes[3].childNodes[1].childNodes[1].innerText,
      price: book.childNodes[3].childNodes[1].childNodes[5].innerText,
    };
    shoppingCartArray.push(bookToBuyFeatures);
  }

  let numberOfBooks = shoppingCartArray.reduce((number) => number + 1, 0);
  numBooks.innerText = numberOfBooks;

  shoppingCart.innerHTML = "";
  for (item of shoppingCartArray) {
    shoppingCart.innerHTML += `<li class="list-group-item d-flex">
                                       <span>${item.title}</span>
                                       <span class="ml-auto text-info">${item.price}</span>
                                   </li>`;
  }
};

const clearCart = () => {
  let itemsToDelete = document.querySelectorAll(
    "#shoppingCart .modal-body ul li"
  );
  for (item of itemsToDelete) {
    item.remove();
  }
  numBooks.innerText = "0";
};

const search = () => {
  let allBooksTitlesNode = document.querySelectorAll(
    "#books-container .card .card-title"
  );

  titleArray = [];
  for (titleHTML of allBooksTitlesNode) {
    titleArray.push({
      titleText: titleHTML.innerText.toLowerCase(),
      titleNode: titleHTML,
    });
  }

  let searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", () => {
    if (searchInput.value.length >= 3) {
      let searchQuery = searchInput.value;
      let founded = titleArray.filter((title) =>
        title.titleText.includes(searchQuery)
      );

      for (item of founded) {
        console.log(item.titleNode.closest(".card").classList.add("founded"));
      }
    }
  });
};

window.onload = () => {
  getBookData();
};
