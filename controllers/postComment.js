const { MongoClient, ObjectID } = require("mongodb");
const date = require("../utils/getTime");

module.exports = (req, res) => {
  const { postId, comment } = req.body;
  MongoClient.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectID(res.locals.id) });
      const query = { _id: new ObjectID(postId) };
      const newComment = {
        body: comment,
        user: {
          id: user._id,
          name: user.name,
          avatar: user.avatarLink,
        },
        date,
      };
      await db.collection("blogs").updateOne(query, {
        $push: { comments: newComment },
      });
      client.close();
    }
  );
};
