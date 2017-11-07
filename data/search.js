const axios = require('axios');
const constants = require('../utilities/constants');

const searchForBooks = async(bookTitle) => {
    if (!bookTitle) throw "Must provide a book title to search for."

    let searchUrl = constants.URLS.SEARCH_URL + bookTitle;
    let response = await axios.get(searchUrl)
        .catch(function (error) {
            throw error;
        });

    return response.data;
};

module.exports = {
    searchForBooks: searchForBooks
};