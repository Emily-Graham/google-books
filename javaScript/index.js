import {getVolumes} from "./utils.js";

//GLOBAL VARIABLES
const form = document.querySelector(".searchBar__form");
const parameterType = document.querySelector("select");
const userInput = document.querySelector(".searchBar__textInput");
const resultsContainer = document.querySelector(".resultsDisplay__bookContainer");

//RESET
const resetSearchBar = () => {
  userInput.value = ""; 
}

//CONVERT USER INPUT TO SEARCH STRING
const convertToSearchString = (userInput, searchParameter) => {
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
  }
}

// CREATE LIST, ATTACH TO DOM
const createList = async (searchTerm, searchParameter) => {
  resultsContainer.innerHTML = ``;
 
  //extract data
  await getVolumes(searchTerm, searchParameter)
    .then((n) => { 
      console.log(n.items[0])
      n.items.forEach(item => {
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
        //passed conditions
        } else {
        
          image = item.volumeInfo.imageLinks.thumbnail;

          resultsContainer.innerHTML +=
          `<div id="${id}" class="resultsDisplay__card">
            <div class="resultsDisplay__cardContent">
              <img class ="resultsDisplay__bookCover" src="${image}" alt="book cover">
              <div class="resultsDisplay__bookText">
                <button class="resultsDisplay__add">
                  <img class="icon__save" src="./../media/Add.svg" alt="Add">
                  <img class="icon__save icon__save--hover icon__save--hidden" src="./../media/add--hover.svg" alt="Add">
                  <img class="icon__save icon__save--hidden icon__save--saved" src="./../media/add--saved.svg" alt="Saved">
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

  console.log('end of current createList function'); //delete later
}

//EVENT LISTENER
form.addEventListener("submit", (event) => {
  event.preventDefault();
  convertToSearchString(userInput.value, parameterType.value);
  resetSearchBar();
}); 


// You should separate DOM functions and non-DOM functions in different modules Example: https://github.com/chillcaw/el-salvador-code-alongs/tree/master/js-modules
// Write as many non-DOM functions as you can
// Functions should do 1 thing, and should be as pure and reusable as possible
// Always use iterators over loops
// Always parametrize and abstract large pieces of duplicate code.
// Bonus (optional, but highly recommended):
// Give feedback to the user when no book results can be found for the query.