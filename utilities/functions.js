let isUserAuthenticated = (user) => {

    let authData = {
        isLoggedIn: false,
    };

    if (user) {
        authData.isLoggedIn = true;
    }

    return authData;
}

module.exports = {
    isUserAuthenticated: isUserAuthenticated
};