const MongoClient = require("mongodb").MongoClient;

module.exports = (req, res) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const posts = await db.collection("blogs").find().toArray();
      return res.json(posts);
    }
  );
};
