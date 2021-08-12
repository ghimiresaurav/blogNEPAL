const MongoClient = require("mongodb").MongoClient;

const searchByTag = (req, res) => {
  const { name } = req.body;
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { category: name };
      //search tag
      const posts = await db.collection("blogs").find(query).toArray();
      return res.json(posts);
    }
  );
};

const searchByCategory = (req, res) => {
  const { name } = req.body;
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { category: name };
      //search tag
      const posts = await db.collection("blogs").find(query).toArray();
      return res.json(posts);
    }
  );
};

const searchByTitle = (req, res) => {
  const { name } = req.body;
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      //search blog
      db.collection("blogs").createIndex({ title: "text" });
      const posts = await db
        .collection("blogs")
        .find({ $text: { $search: name } })
        .toArray();
      return res.json(posts);
    }
  );
};

module.exports = {
  searchByTag,
  searchByTitle,
  searchByCategory,
};
