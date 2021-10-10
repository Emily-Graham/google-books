import {getVolumes} from "./utils.js";

//GLOBAL VARIABLES
const form = document.querySelector(".searchBar__form");
const parameterType = document.querySelector("select");
const userInput = document.querySelector(".searchBar__textInput");
const resultsContainer = document.querySelector(".resultsDisplay__bookContainer");
const resultTitle = document.querySelector(".resultsDisplay__title");

//RESET
const resetSearchBar = () => {
  userInput.value = ""; 
}

// GET BOOK DATA
const getBook = async (bookId) => {
  const google_url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
  const response = await fetch(google_url); 
  const data = await response.json(); //convert to objects
  return data;
}

//CONVERT USER INPUT TO SEARCH STRING
const convertToSearchString = (userInput, searchParameter) => {
  let display = "";
  if (!userInput) {
    return;
  } else if (!/[^ +]/g.test(userInput)) {
    return;
  } else {
    const searchTerm = 
      userInput.trim()
      .replace(/[^a-z A-Z\d\&\!\#]/g, "") //delete special characters?
      .replace(/ +/g, "+"); //replace spaces with +
    createList(searchTerm, searchParameter);
    switch (searchParameter) {
      case "intitle:":
        display = "&nbsp;<u>Titles</u>:"
        break;
      case "inauthor:":
        display = "&nbsp;<u>Authors</u>:";
        break;
      case "subject:":
        display = "&nbsp;<u>Subject</u>:";
        break;
      case "inpublisher:":
        display = "&nbsp;<u>Publishers</u>:";
      default:
        display = ":";
    }
    resultTitle.innerHTML = `Results for${display} ${userInput.trim()}`;
  }
}

// CREATE LIST, ATTACH TO DOM
const createList = async (searchTerm, searchParameter) => {
  resultsContainer.innerHTML = ``;
 
  //extract data
  await getVolumes(searchTerm, searchParameter)
    .then((data) => { 
      data.items.forEach(item => {
        //card inputs
        let image = ``;
        const id = item.id;
        let title = item.volumeInfo.title;
        let author =  ``;
        let subtitle = ``;
        let description = ``;

        if (/\(/.test(title)) {
          subtitle = title.slice(title.search(/\(/));
          title = title.slice(0, title.search(/\(/));
        }
        if (item.volumeInfo.authors) {
          author = item.volumeInfo.authors.join(", "); 
        }
        if (item.volumeInfo.description) {
          description = item.volumeInfo.description;
        } else if (item.volumeInfo.searchInfo) {
          description = item.volumeInfo.searchInfo.textSnippet;
        }
        if (/\<p\>/.test(description)) {
          description = description.replace(/\<(.|..)\>/g, "");
        }
  
        //display conditions
        //no image - reject  
        if (!item.volumeInfo.hasOwnProperty("imageLinks")) {
          console.log(`lack of thumnail triggered!`);
          return;
        //no description - reject
        } else if (!item.volumeInfo.description) {
          console.log(`lack of description triggered!`);
          return;
        //boxed sets - reject
        } else if (item.volumeInfo.description.match(/boxed set/)
        || item.volumeInfo.description.match(/complete series/)) { 
          console.log(`box set triggered!`);
          return; 
        //passed conditions!
        } else {
          item.volumeInfo.imageLinks.large ? image = item.volumeInfo.imageLinks.large : image = item.volumeInfo.imageLinks.thumbnail;

          resultsContainer.innerHTML +=
          `<div id="${id}" class="resultsDisplay__card">
            <div class="resultsDisplay__cardContent">
              <img class ="resultsDisplay__bookCover" src="${image}" alt="book cover">
              <div class="resultsDisplay__bookText">
                <button class="resultsDisplay__add">
                  <img class="icon--default" src="./../media/Add.svg" alt="Add">
                  <img class="icon--hover icon--hidden" src="./../media/add--hover.svg" alt="Add">
                  <img class="icon--actived icon--hidden" src="./../media/add--saved.svg" alt="Saved">
                </button>
                <div class="resultsDisplay__titleContainer">
                  <h3 class="resultsDisplay__bookTitle">${title}</h3>
                  <h4 class="resultsDisplay__booksubtitle">${subtitle}</h4>
                  <h4 class="resultsDisplay__bookAuthor">${author}</h4>
                </div>
                <p class="resultsDisplay__bookDescription">${description}</p>
              </div>
            </div>
          </div>`; 
        }
      })
    })
    .catch((n) => {
      resultsContainer.innerHTML = `<h3 class="resultsDisplay__searchFail" >No results found</h3>`;
      console.log(n);
    })
  if (!resultsContainer.innerHTML) {
    resultsContainer.innerHTML = `<h3 class="resultsDisplay__searchFail" >No results found</h3>`;
  }
  //event listeners for cards
  document.querySelectorAll(".resultsDisplay__card").forEach((card) => card.addEventListener("click", (event) => {
    console.log(`Clicked! ${event.currentTarget.id}`);
    openModal(event.currentTarget.id);
  }));
}

// OPEN MODAL 
const openModal = async (bookId) => {
  const id = bookId;
  
  //get book data
  await getBook(id)
  .then((data) => {
    const info = data.volumeInfo;
    let image = info.imageLinks.thumbnail;
    let title = info.title;
    let author =  ``;
    let subtitle = ``;
    let description = info.description;
    console.log(image);
    if (info.imageLinks.hasOwnProperty("large")) {
      image = info.imageLinks.large;
    } else if (info.imageLinks.hasOwnProperty("extraLarge")) {
      image = info.imageLinks.extraLarge;
    }
    if (/\(/.test(title)) {
      subtitle = title.slice(title.search(/\(/));
      title = title.slice(0, title.search(/\(/));
    }
    if (info.authors) {
      author = info.authors.join(", "); 
    }

    console.log(image);
    document.querySelector(".modal__background").innerHTML = 
      `<div class="modal">
        <div class="modal__topContainer">
          <img id="return" class="icon--return" src="./../media/left-arrow.svg" alt="return">
          <div class="modal__iconContainer">
            <img  class="icon--default" src="./../media/Add.svg" alt="add">
            <img class="icon--activated icon--hidden" src="./../media/add--saved.svg" alt="saved">
            <img class="icon--hover icon--hidden" src="./../media/add--hover.svg" alt="add">
            <img class="icon--default" src="./../media/remove.svg" alt="remove">
            <img class="icon--hover icon--hidden" src="./../media/remove--hover.svg" alt="remove">
          </div>
          <div class="modal__titleContainer">
            <h3 class="modal__bookTitle">${title}</h3>
            ${subtitle ? `<h4 class="modal__booksubtitle">${subtitle}</h4>` : ``}
            <h4 class="modal__bookAuthor">${author}</h4>
          </div>
          <img class="modal__bookCover" src="${image}" alt="book cover">
        </div>
        <div class="modal__informationContainer">
          <div class="modal__tab modal__tab--1 modal__tab--selected">Description</div>
          <div class="modal__tab modal__tab--2">More</div>
          <div class="modal__displayBlock modal__displayBlock--1 modal__displayBlock--selected">
            <div class="modal__descriptionContainer">${description}</div>
          </div>
          <div class="modal__displayBlock modal__displayBlock--2">
          </div>
        </div>
      </div>`;
    document.querySelector(".modal__background").classList.remove("modal__background--hidden");
  })
  .catch((n) => {
    throw new Error(`something went wrong: ${n}`);
  })

  document.querySelector("#return").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".modal__background").innerHTML = ``;
    document.querySelector(".modal__background").classList.add("modal__background--hidden");
  })
}

//EVENT LISTENER
form.addEventListener("submit", (event) => {
  event.preventDefault();
  convertToSearchString(userInput.value, parameterType.value);
  resetSearchBar();
}); 


// You should separate DOM functions and non-DOM functions in different modules Example: https://github.com/chillcaw/el-salvador-code-alongs/tree/master/js-modules
// Always parametrize and abstract large pieces of duplicate code.