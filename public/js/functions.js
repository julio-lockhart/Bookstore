(function ($) {
    var searchForm = document.getElementById('searchForm');
    var searchBookTitle = document.getElementById('searchBookTitle');

    if (searchForm !== null) {
        searchForm.addEventListener('submit', function (event) {
            if (searchBookTitle.value === "" || searchBookTitle.value === undefined) {
                event.preventDefault();
            }
        });
    }

})(jQuery); // jQuery is exported as $ and jQuery