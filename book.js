
https://next.tech/projects/5c9f20e8-27ad-4b63-bf10-4b28c387adbe?access_token=A6465F0DF328AF918B52A9454E2FEE82&internal=false
export class Book {
    constructor(title, author, description, pages, currentPage, read)
      { 
        this.title = title;
        this.author = author;
        this.description = description;
        this.pages = pages;
        this.currentPage = currentPage;
        this.read = read;      
      }
    readBook(page) {
      if (page <=0 || page > this.pages) {
        return 0;
      }
      else if (page>0 && page < this.pages) {
        this.currentPage = page;
        return 1;
      }
      else if (page == this.pages) {
        this.currentPage = page;
        this.read = true;
        return 1;
      }
    }
  }
  
  let firstBook = new Book ("Le rouge et le noir", "Stendhal", "Roman", 354, 12, false);
  let secondBook = new Book ("Histoire de la Hollande", "Bernard", "Ouvrage historique", 512, pages, true);
  let thirdBook = new Book ("Dictionnaire", "Larousse", "Dictionnaire", 2354, 0, false);
  let fourthBook = new Book ("Belle du seigneur", "Cohen", "Roman", 657, 435, false);

  
  export const books = [firstBook, secondBook, thirdBook, fourthBook];
  