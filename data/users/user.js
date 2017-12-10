const mongoCollection = require('../../config/mongo/mongoCollections');
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
        let isBookInCart = lodash.filter(user.shoppingCart, x => x.book.isbn === bookItem.isbn);
        let book = bookItem[0];

        // If the book exists, update the quantity, otherwise, add it to the cart
        if (!Array.isArray(isBookInCart) || isBookInCart.length > 0) {
            let status = await incrementQuantity(user, book.isbn, 1);
            if (status.result.ok === 1) {
                return true;
            } else {
                throw "Unable to update shopping cart";
            }
        } else {
            // Adding some extra attributes
            book.quantity = 1;

            let status = await userCollection.update({
                email: user.email
            }, {
                $addToSet: {
                    "shoppingCart": {
                        book
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
        "shoppingCart.book.isbn": isbn
    }, {
        $inc: {
            "shoppingCart.$.book.quantity": parseInt(incrementAmount)
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
        "shoppingCart.book.isbn": isbn
    }, {
        $set: {
            "shoppingCart.$.book.quantity": updateQuantity
        }
    });
};

const removeBookFromCart = async(user, isbn) => {
    if (!user) throw "removeBookFromCart expected a user";
    if (!isbn) throw "removeBookFromCart expected an isbn";

    const userCollection = await usersCollection();
    return await userCollection.update({
        email: user.email,
        "shoppingCart.book.isbn": isbn
    }, {
        $pull: {
            "shoppingCart": {
                "book.isbn": isbn
            }
        }
    });
}

const getCartInformation = async(user) => {
    if (!user) throw "UpdateQuanity expected a user";

    // Get the number of items plus the total amount of the user's shopping cart
    let numOfItems = 0;
    let totalAmount = 0;

    lodash.forEach(user.shoppingCart, function (item) {
        numOfItems += Number(item.book.quantity);
        totalAmount += (item.book.quantity * item.book.price);
    });

    return {
        numOfItems: numOfItems,
        totalAmount: totalAmount,
        cart: user.shoppingCart
    };
}

const completePurchaseOrder = async(user) => {
    if (!user) throw "UpdateQuanity expected a user";
    const userCollection = await usersCollection();

    for (let i = 0; i < user.shoppingCart.length; i++) {
        let book = user.shoppingCart[i].book;
        await removeBookFromCart(user, book.isbn);

        await userCollection.update({
            email: user.email
        }, {
            $addToSet: {
                "purchases": {
                    book
                }
            }
        });
    }

    lodash.forEach(user.shoppingCart, function (item) {
        let test = item;


        // await userCollection.update({
        //     email: user.email
        // }, {
        //     $addToSet: {
        //         "purchases": {
        //             item
        //         }
        //     }
        // });
    });
};

module.exports = {
    findByEmail: findByEmail,
    insertNewUser: insertNewUser,
    addToCart: addToCart,
    incrementQuantity: incrementQuantity,
    updateQuantity: updateQuantity,
    removeBookFromCart: removeBookFromCart,
    getCartInformation: getCartInformation,
    completePurchaseOrder: completePurchaseOrder
};