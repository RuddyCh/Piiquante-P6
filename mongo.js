const mongoose = require('mongoose');
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;
const uri = `mongodb+srv://${username}:${password}@cluster.q5ipc.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then((() => console.log("Connected to mongo !")))
    .catch(err => console.error("Error connecting to Mongo: ", err));

module.exports = { mongoose };