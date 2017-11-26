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
            let status = await updateQuantity(user, bookItem.isbn, 1);
            if (status.result.ok === 1) {
                return true;
            } else {
                throw "Unable to update shopping cart";
            }
        }
    }
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
        $inc: {
            "shoppingCart.$.quantity": 1
        }
    });
};

module.exports = {
    findByEmail: findByEmail,
    findUserByID: findUserByID,
    insertNewUser: insertNewUser,
    addToCart: addToCart
};