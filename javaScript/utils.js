// GET DATA
export const getVolumes = async (searchTerm, searchParameter) => {
  const google_url = `https://www.googleapis.com/books/v1/volumes?q=${searchParameter}${searchTerm}&printType=books&maxResults=40`;
  const response = await fetch(google_url); 
  const data = await response.json(); //convert to objects
  console.log(data); //delete later
  console.log(`result is: ${data}`); //delte later
  return data;
}