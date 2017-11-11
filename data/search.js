const axios = require('axios');
const constants = require('../utilities/constants');

const searchForBooks = async(bookTitle) => {
    if (!bookTitle) throw "Must provide a book title to search for."

    let searchUrl = constants.URLS.SEARCH_URL + encodeURIComponent(bookTitle);

    try {
        const response = await axios.get(searchUrl);
        const data = response.data.items;
        return data;
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

module.exports = {
    searchForBooks: searchForBooks,
    searchByCategory: searchByCategory
};