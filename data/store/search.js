const axios = require('axios');
const uuidv4 = require('uuid/v4');
const constants = require('../../utilities/constants');
const lodash = require('lodash');

const mongoCollection = require('../../config/mongo/mongoCollections');
const categoryCollection = mongoCollection.categories;

const searchForBooks = async(bookTitle) => {
    if (!bookTitle) throw {
        "function": "searchForBooks",
        "error": "Missing Book title"
    };

    let searchUrl = constants.URLS.SEARCH_URL + encodeURIComponent(bookTitle);

    try {
        const response = await axios.get(searchUrl);
        const responseItems = response.data.items;

        if (responseItems) {
            let data = extractBookInformation(responseItems);
            return data;
        } else {
            throw {
                "function": "searchForBooks",
                "error": "No data was returned",
                "url": searchUrl
            };
        }

    } catch (error) {
        throw {
            "function": "searchForBooks",
            "error": error.message,
            "url": searchUrl
        };
    }
};

const searchByISBN = async(isbn) => {
    if (!isbn) throw {
        "function": "searchByISBN",
        "error": "Missing ISBN."
    };

    let searchUrl = constants.URLS.ISBN_URL + isbn;

    try {
        const response = await axios.get(searchUrl);
        const responseItems = response.data.items;

        if (responseItems) {
            let data = extractBookInformation(responseItems);
            return data;
        } else {
            throw {
                "function": "searchByISBN",
                "error": "No data was returned",
                "url": searchUrl
            };
        }
    } catch (error) {
        throw {
            "function": "searchByISBN",
            "error": error.message,
            "url": searchUrl
        };
    }
};

const searchByCategory = async(category) => {
    if (!category) throw {
        "function": "searchByCategory",
        "error": "Missing Category"
    };;

    let searchUrl = constants.URLS.CATEGORY_URL + encodeURIComponent(category);

    try {
        const response = await axios.get(searchUrl);
        const responseItems = response.data.items;

        if (responseItems) {
            let data = extractBookInformation(responseItems);
            return data;
        } else {
            throw {
                "function": "searchByCategory",
                "error": "No data was returned",
                "url": searchUrl
            };
        }
    } catch (error) {
        throw {
            "function": "searchByCategory",
            "error": error.message,
            "url": searchUrl
        };
    }
};

const getCategories = async() => {
    const collection = await categoryCollection();
    const collectionData = await collection.find().toArray();
    let categories = collectionData[0].categories;

    return categories;
};

const extractBookInformation = (books) => {
    if (books) {
        let formattedBookInfoList = [];
        for (let i = 0; i < books.length; i++) {
            let bookInfo = {};

            // At a minimum, we need both the ISBN and book's title
            if ('industryIdentifiers' in books[i].volumeInfo) {
                // Trying to get the ISBN 13 value since other types exist
                bookInfo.isbn = "";
                lodash.forEach(books[i].volumeInfo.industryIdentifiers, function (value) {
                    if (value.type === "ISBN_13") {
                        bookInfo.isbn = value.identifier;
                    }
                });

                // No ISBN found
                if (bookInfo.isbn === "") {
                    continue;
                }
            } else {
                continue;
            }

            // Checking for the Title
            if ('title' in books[i].volumeInfo) {
                bookInfo.title = books[i].volumeInfo.title;
            } else {
                continue;
            }

            // Used for the CSS IDs
            bookInfo._uuid = uuidv4();

            // Checking for the Book's Description
            if ('description' in books[i].volumeInfo) {
                let description = books[i].volumeInfo.description;
                bookInfo.description = description;
            } else {
                bookInfo.description = "Desciption not found.";
            }

            // Checking Text Snippet
            if ('searchInfo' in books[i]) {
                bookInfo.textSnippet = books[i].searchInfo.textSnippet;
            } else {
                if (bookInfo.description !== "") {
                    let description = bookInfo.description;
                    bookInfo.textSnippet = description.substring(0, 79) + "...";
                }
            }

            // Checking for the Book's Image
            if ('imageLinks' in books[i].volumeInfo) {
                bookInfo.imageURL = books[i].volumeInfo.imageLinks;
            } else {
                bookInfo.imageURL = "";
            }

            // Checking for the Author(s)
            if ('authors' in books[i].volumeInfo) {
                if (books[i].volumeInfo.authors.length > 0) {
                    bookInfo.authors = books[i].volumeInfo.authors.join();
                } else {
                    bookInfo.authors = "N/A";
                }
            }

            // Checking for the Price
            if ('retailPrice' in books[i].saleInfo) {
                bookInfo.price = books[i].saleInfo.retailPrice.amount;
            } else {
                bookInfo.price = Math.floor(Math.random() * 100) + 10;
            }

            // Checking for Publisher
            if ('publisher' in books[i].volumeInfo) {
                bookInfo.publisher = books[i].volumeInfo.publisher;
            } else {
                bookInfo.publisher = "N/A";
            }

            // Checking for Published Data
            if ('publishedDate' in books[i].volumeInfo) {
                bookInfo.publishedDate = books[i].volumeInfo.publishedDate;
            } else {
                bookInfo.publishedDate = "N/A";
            }

            // Checking for Page Count
            if ('pageCount' in books[i].volumeInfo) {
                bookInfo.pageCount = books[i].volumeInfo.pageCount;
            } else {
                bookInfo.pageCount = "N/A";
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
                bookInfo.ratingsCount = Math.floor(Math.random() * 10000);
            }

            formattedBookInfoList.push(bookInfo);
        }

        return formattedBookInfoList;
    }
};

module.exports = {
    searchForBooks: searchForBooks,
    searchByISBN: searchByISBN,
    searchByCategory: searchByCategory,
    getCategories: getCategories
};