const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

//define collections required to run the website
const collections = ["users", "images"];

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//create database
MongoClient.connect(
  `${process.env.DB_URL}${process.env.DB_NAME}`,
  options,
  (err, db) => {
    if (err) throw err;
    console.log("Database Created!");
    db.close();
  }
);

//create collections
MongoClient.connect(process.env.DB_URL, options, (err, client) => {
  if (err) throw err;
  const db = client.db(process.env.DB_NAME);
  collections.forEach((collection) => {
    db.createCollection(collection, (err, msg) => {
      if (err) throw err;
      console.log(`Collection '${collection}' Created Successfully`);
    });
  });
  setTimeout(() => client.close(), 500);
});
