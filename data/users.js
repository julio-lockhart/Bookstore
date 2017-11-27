const mongoCollection = require('../config/mongo/mongoCollections');
const usersCollection = mongoCollection.users;
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');
const lodash = require('lodash');

const findByEmail = async(userEmail, callback) => {
    const users = await usersCollection();
    const user = await users.findOne({
        email: userEmail
    });

    if (user) {
        callback(null, user);
    } else {
        callback("User does not exist", null);
    }
};

const findUserByID = async(id) => {
    const users = await usersCollection();
    const userItem = await users.findOne({
        _id: id
    });

    if (!userItem) {
        return null;
    } else {
        return userItem;
    }
};

const insertNewUser = async(userData) => {
    const users = await usersCollection();
    const newUser = {
        _id: uuidv4(),
        firstName: userData.firstNameInput,
        lastName: userData.lastNameInput,
        email: userData.emailInput,
        password: bcrypt.hashSync(userData.passwordInput),
        shoppingCart: [],
        purchases: []
    };

    const insertInfo = await users.insertOne(newUser);
    if (insertInfo.insertedCount == 0) throw "Could not add new user";

    const item = await findUserByID(insertInfo.insertedId);
    return item;
};

const addToCart = async(userEmail, bookItem) => {
    const userCollection = await usersCollection();
    const user = await userCollection.findOne({
        email: userEmail
    });

    if (user) {
        // Check if the book added to the cart is already in their shopping cart.
        let isBookInCart = lodash.filter(user.shoppingCart, x => x.isbn === bookItem.isbn);

        // If the book exists, update the quantity, otherwise, add it to the cart
        if (!Array.isArray(isBookInCart) || isBookInCart.length > 0) {
            let status = await incrementQuantity(user, bookItem.isbn, 1);
            if (status.result.ok === 1) {
                return true;
            } else {
                throw "Unable to update shopping cart";
            }
        } else {
            let status = await userCollection.update({
                email: user.email
            }, {
                $addToSet: {
                    "shoppingCart": {
                        "isbn": bookItem.isbn,
                        "title": bookItem.title,
                        "authors": bookItem.author,
                        "description": bookItem.description,
                        "imageURL": bookItem.imageURL,
                        "publisher": bookItem.publisher,
                        "publishedDate": bookItem.publishedDate,
                        "pageCount": bookItem.pageCount,
                        "price": bookItem.price,
                        "categories": bookItem.categories,
                        "averageRating": bookItem.averageRating,
                        "ratingsCount": bookItem.ratingsCount,
                        "quantity": 1
                    }
                }
            });

            if (status.result.ok === 1) {
                return true;
            } else {
                throw "Unable to update shopping cart";
            }
        }
    }
};

const incrementQuantity = async(user, isbn, incrementAmount) => {

    if (!user) throw "incrementQuantity expected a user";
    if (!isbn) throw "incrementQuantity expected an isbn";
    if (!incrementAmount) throw "UpdateQuanity expected a incrementAmount";

    const userCollection = await usersCollection();

    return await userCollection.update({
        email: user.email,
        "shoppingCart.isbn": isbn
    }, {
        $inc: {
            "shoppingCart.$.quantity": incrementAmount
        }
    });
};

const updateQuantity = async(user, isbn, updateQuantity) => {
    if (!user) throw "UpdateQuanity expected a user";
    if (!isbn) throw "UpdateQuanity expected an isbn";
    if (!updateQuantity) throw "UpdateQuanity expected a updateQuantity";

    const userCollection = await usersCollection();

    return await userCollection.update({
        email: user.email,
        "shoppingCart.isbn": isbn
    }, {
        $set: {
            "shoppingCart.$.quantity": updateQuantity
        }
    });
};

const removeBookFromCart = async(user, isbn) => {
    if (!user) throw "UpdateQuanity expected a user";
    if (!isbn) throw "UpdateQuanity expected an isbn";

    const userCollection = await usersCollection();
    return await userCollection.update({
        email: user.email,
        "shoppingCart.isbn": isbn
    }, {
        $pull: {
            "shoppingCart": {
                "isbn": isbn
            }
        }
    });
}

module.exports = {
    findByEmail: findByEmail,
    findUserByID: findUserByID,
    insertNewUser: insertNewUser,
    addToCart: addToCart,
    incrementQuantity: incrementQuantity,
    updateQuantity: updateQuantity,
    removeBookFromCart: removeBookFromCart
};