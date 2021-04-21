const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost/27017";
const dbName = "blognepal";

//define collections required to run the website
const collections = ["users"];
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//create database
MongoClient.connect(`${url}${dbName}`, options, (err, db) => {
  if (err) throw err;
  console.log("Database Created!");
  db.close();
});

//create collections
MongoClient.connect(url, options, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  collections.forEach((collection) => {
    db.createCollection(collection, (err, msg) => {
      if (err) throw err;
      console.log(`Collection '${collection}' Created Successfully`);
    });
  });
  setTimeout(() => client.close(), 500);
});
