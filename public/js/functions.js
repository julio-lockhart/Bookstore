(function ($) {
    // Variables for Book searchs
    var searchForm = document.getElementById('searchForm');
    var searchBookTitle = document.getElementById('searchBookTitle');

    // Validation for book title search
    if (searchForm !== null) {
        searchForm.addEventListener('submit', function (event) {
            if (searchBookTitle.value === "" || searchBookTitle.value === undefined) {
                event.preventDefault();
            }
        });
    }
})(jQuery); // jQuery is exported as $ and jQuery