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

const extractBookInformation = async(books) => {
    if (!books) throw "Books is null";

    let formattedBookInfoList = [];

    for (let i = 0; i < books.length; i++) {
        let bookInfo = {};

        // Checking for the Title
        if (books[i].volumeInfo.title !== "" || books[i].volumeInfo.title !== undefined) {
            bookInfo.title = books[i].volumeInfo.title;
        } else {
            bookInfo.title = "";
        }

        // Checking for the Book's Image
        if ('imageLinks' in books[i].volumeInfo) {
            bookInfo.imageURL = books[i].volumeInfo.imageLinks.thumbnail;
        } else {
            bookInfo.imageURL = "";
        }

        // Checking for the Author(s)
        if (books[i].volumeInfo.authors.length > 0) {
            bookInfo.authors = books[i].volumeInfo.authors.join();
        } else {
            bookInfo.authors = "";
        }

        // Checking for the Price
        if ('retailPrice' in books[i].saleInfo) {
            bookInfo.price = books[i].saleInfo.retailPrice.amount;
        } else {
            bookInfo.price = 20.00;
        }

        formattedBookInfoList.push(bookInfo);
    }

    return formattedBookInfoList;
};

module.exports = {
    searchForBooks: searchForBooks,
    searchByCategory: searchByCategory
};