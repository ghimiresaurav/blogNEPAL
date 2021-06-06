const { MongoClient, ObjectID } = require("mongodb");
require("dotenv").config();

module.exports = (req, res) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectID(res.locals.id) });
      //send user's name and link to the avatar to client
      return res.json({ name: user.name, avatarLink: user.avatarLink });
    }
  );
};
