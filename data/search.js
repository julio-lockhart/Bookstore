const axios = require('axios');
const constants = require('../utilities/constants');

const searchForBooks = async(bookTitle) => {
    if (!bookTitle) throw "Must provide a book title to search for."

    let searchUrl = constants.URLS.SEARCH_URL + encodeURIComponent(bookTitle);

    try {
        const response = await axios.get(searchUrl);
        const data = response.data.items;
        const formattedBookInfo = await extractBookInformation(data);
        return formattedBookInfo;
    } catch (error) {
        throw error;
    }
};

const searchByCategory = async(category) => {
    if (!category) throw "Must provide a category.";

    let searchUrl = constants.URLS.CATEGORY_URL + category;

    try {
        const response = await axios.get(searchUrl);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

const searchByISBN = async(isbn) => {
    if (!isbn) throw "Could not searchByISBN. It was null";

    let searchUrl = constants.URLS.ISBN_URL + isbn;

    try {
        const response = await axios.get(searchUrl);
        const data = response.data.items;
        const formattedBookInfo = await extractBookInformation(data);
        return formattedBookInfo[0];
    } catch (error) {
        throw error;
    }
};

const extractBookInformation = async(books) => {
    if (!books) throw "Books is null";

    let formattedBookInfoList = [];

    for (let i = 0; i < books.length; i++) {
        let bookInfo = {};

        // Checking for the Title
        if ('title' in books[i].volumeInfo) {
            if (books[i].volumeInfo.title !== "" || books[i].volumeInfo.title !== undefined) {
                bookInfo.title = books[i].volumeInfo.title;
            } else {
                bookInfo.title = "";
            }
        }

        // Checking for the Book's Description
        if ('description' in books[i].volumeInfo) {
            let description = books[i].volumeInfo.description;
            bookInfo.description = description;
        } else {
            bookInfo.description = "";
        }

        // Checking Text Snippet
        if ('searchInfo' in books[i].volumeInfo) {
            bookInfo.textSnippet = books[i].volumeInfo.textSnippet;
        } else {
            if (bookInfo.description !== "") {
                let description = bookInfo.description;
                bookInfo.textSnippet = description.substring(0, 79) + "...";
            }
        }

        // Checking for the Book's Image
        if ('imageLinks' in books[i].volumeInfo) {
            bookInfo.imageURL = books[i].volumeInfo.imageLinks.thumbnail;
        } else {
            bookInfo.imageURL = "";
        }

        // Checking for the Author(s)
        if ('authors' in books[i].volumeInfo) {
            if (books[i].volumeInfo.authors.length > 0) {
                bookInfo.authors = books[i].volumeInfo.authors.join();
            } else {
                bookInfo.authors = "";
            }
        }

        // Checking for the Price
        if ('retailPrice' in books[i].saleInfo) {
            bookInfo.price = books[i].saleInfo.retailPrice.amount;
        } else {
            bookInfo.price = 20.00;
        }

        // Checking for Publisher
        if ('publisher' in books[i].volumeInfo) {
            bookInfo.publisher = books[i].volumeInfo.publisher;
        } else {
            bookInfo.publisher = "";
        }

        // Checking for Published Data
        if ('publishedDate' in books[i].volumeInfo) {
            bookInfo.publishedDate = books[i].volumeInfo.publishedDate;
        } else {
            bookInfo.publishedDate = "";
        }

        // Checking for Page Count
        if ('pageCount' in books[i].volumeInfo) {
            bookInfo.pageCount = books[i].volumeInfo.pageCount;
        } else {
            bookInfo.pageCount = "";
        }

        // Checking for Categories
        if ('categories' in books[i].volumeInfo) {
            bookInfo.categories = books[i].volumeInfo.categories;
        } else {
            bookInfo.categories = [];
        }

        // Checking for Average Rating
        if ('averageRating' in books[i].volumeInfo) {
            bookInfo.averageRating = books[i].volumeInfo.averageRating;
        } else {
            bookInfo.averageRating = Math.floor(Math.random() * 6); // returns a number between 0 and 5
        }

        // Checking for Average Rating
        if ('ratingsCount' in books[i].volumeInfo) {
            bookInfo.ratingsCount = books[i].volumeInfo.ratingsCount;
        } else {
            bookInfo.ratingsCount = Math.floor(Math.random() * 10000); // returns a number between 0 and 5
        }

        // Check for the ISBN
        if ('industryIdentifiers' in books[i].volumeInfo) {
            bookInfo.isbn = books[i].volumeInfo.industryIdentifiers[0].identifier;
        } else {
            continue;
        }

        formattedBookInfoList.push(bookInfo);
    }

    return formattedBookInfoList;
};

module.exports = {
    searchForBooks: searchForBooks,
    searchByCategory: searchByCategory,
    searchByISBN: searchByISBN
};