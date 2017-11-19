const mongoCollection = require('../config/mongo/mongoCollections');
const usersCollection = mongoCollection.users;
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');

const getUserByEmail = async(userEmail) => {
    const users = await usersCollection();
    const userItem = await users.findOne({
        email: userEmail
    });

    if (!userItem) {
        return null;
    } else {
        return userItem;
    }
};

const getUserByID = async(id) => {
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

    const item = await getUserByID(insertInfo.insertedId);
    return item;
};

module.exports = {
    getUserByEmail: getUserByEmail,
    getUserByID: getUserByID,
    insertNewUser: insertNewUser
};