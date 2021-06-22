const { MongoClient, ObjectID } = require("mongodb");

module.exports = (req, res) => {
  const { bio, hobbies } = req.body;
  const query = { _id: ObjectID(res.locals.id) };
  const update = { $set: { bio, hobbies } };
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);

      db.collection("users").updateOne(query, update);
      return res.json({ success: true, bio, hobbies });
    }
  );
};
