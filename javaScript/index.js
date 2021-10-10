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
  console.log(`value= ${userInput}`);//delete later
  if (!userInput) {
    console.log(`string's empty!`); //delete later
    return;
  } else if (!/[^ +]/g.test(userInput)) {
    console.log(`there is only spaces!`); //delete later
    return;
  } else {
    const searchTerm = 
    userInput.trim()
    .replace(/[^a-z A-Z\d\&\!\#]/g, "") //delete special characters?
    .replace(/ +/g, "+"); //replace spaces with +
    console.log(`.${searchTerm}.`); //delete later
    createList(searchTerm, searchParameter);
    resetSearchBar();
    console.log("search beginning!");//delete later
  }
}

// GET DATA
const getVolumes = async (searchTerm, searchParameter) => {
  const google_url = `https://www.googleapis.com/books/v1/volumes?q=${searchParameter}${searchTerm}&printType=books`;
  console.log(google_url); //delete later
  const response = await fetch(google_url); 
  const data = await response.json(); //convert to objects
  console.log(data); //delete later
  console.log(`result is: ${data}`); //delte later
  return data;
}

// CREATE LIST, ATTACH TO DOM
const createList = async (searchTerm, searchParameter) => {
  console.log(searchTerm);
  console.log(searchParameter);
  resultsContainer.innerHTML = ``;
 
  //extract data
  await getVolumes(searchTerm, searchParameter)
    .then((n) => { 
      console.log(n.items[0])
      n.items.forEach(item => {
        //card inputs
        const image = item.volumeInfo.imageLinks.thumbnail;
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
        }
        
        console.log(`title: ${title}`);
        console.log(`subtitle: ${subtitle}`);
        console.log(`image src: ${image}`);
        console.log(`author: ${author}`);

        resultsContainer.innerHTML +=
        `<div>
          <div id="" class="resultsDisplay__card">
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
      })
    })

  //create book cards


  console.log('end of current createList function'); //delete later
  //attach book cards to DOM
}

//EVENT LISTENER
form.addEventListener("submit", (event) => {
  event.preventDefault();
  convertToSearchString(userInput.value, parameterType.value);
}); 

// You should separate DOM functions and non-DOM functions in different modules Example: https://github.com/chillcaw/el-salvador-code-alongs/tree/master/js-modules
// Write as many non-DOM functions as you can
// Functions should do 1 thing, and should be as pure and reusable as possible
// Always use iterators over loops
// Always parametrize and abstract large pieces of duplicate code.
// Bonus (optional, but highly recommended):
// Give feedback to the user when no book results can be found for the query.
// When a user clicks a book in the grid, a modal should appear with more book information, think about release, publish date, country, languages, etc.

//fetch
// https://www.googleapis.com/books/v1/volumes?q=search+terms 
//example of search term parameters:  GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey 
// example of printType specified: GET https://www.googleapis.com/books/v1/volumes?q=time&printType=magazines&key=yourAPIKey