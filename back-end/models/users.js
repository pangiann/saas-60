const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb://localhost:27017";
const fs = require('fs')
var json_data;
try {
    const data = fs.readFileSync('/home/pangiann/Documents/TL20-17/back-end/JSON_Data/car.json', 'utf8')
    json_data = JSON.parse(data);
} catch (err) {
    console.error(err);
}
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

let hasher = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        hashedpassword: value
    };
}

let hash = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    return hasher(password, salt);
};
let compare = (password, hash) => {

    if (password == null || hash == null) {
        throw new Error('password and hash is required to compare');
    }
    if (typeof password !== 'string' || typeof hash !== 'object') {
        throw new Error('password must be a String and hash must be an Object');
    }
    let passwordData = hasher(password, hash.salt);
    console.log(passwordData.hashedpassword);
    return passwordData.hashedpassword === hash.password;

};
module.exports = {
    insertUser: async function (username, password, email) {
        await client.connect();
        const users_collection = client.db('q&a').collection('Users');
        const salt = crypto.randomBytes(32).toString('hex');
        console.log(username);
        console.log(password);
        const json_pass = hash(password, salt);
        const user_doc = {
            username: username,
            password: json_pass.hashedpassword,
            salt: json_pass.salt,
            email: email
        };
        try {

            const result = await users_collection.insertOne(user_doc);
            console.log(result);
            return result;

        } finally {
            await client.close();
        }


    },
    checkUserCreds: async function (username, password) {
        await client.connect();
        const users_collection = client.db('q&a').collection('Users');
        const query = {username: username};
        console.log(username);
        console.log(password);
        const projection = { projection: {password: 1, salt:1, _id:0}};
        try {
            const hash = await users_collection.findOne(query, projection);
            console.log(hash);
            const result = compare(password, hash);
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            await client.close();
        }

    },
    insertUsers: function () {
        client.db('test_db').createCollection('users');
        const cursor = client.db('test_db').collection('users');

        const users = [
            {
                username: "michalakos",
                password: "1234",
                car_id: "606f1bfce4a0238c4ae6432c",
                email: "michalis@gmail.com"
            },
            {
                username: "pangiann",
                password: "1234",
                car_id: "606f1bfce4a0238c4ae642eb",
                email: "pangiann@gmail.com"
            }
        ];

        cursor.insertMany(users);
    },

    findUser : async function(name) {
        await client.connect();
        const query = { username: name };

        try {
            const result = await client.db('q&a').collection('Users').findOne(query);
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error("something went wrong");
        } finally {
            await client.close();
        }



    }
};
