const { MongoClient, ObjectID } = require("mongodb");

module.exports = (req, res) => {
  const { bio, hobbies } = req.body;
  const query = { _id: ObjectID(res.locals.id) };
  const update = { $set: { bio, hobbies } };
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);

      const success = await db.collection("users").updateOne(query, update);
      const user = await db.collection("users").findOne(query);
      if (success.result.ok) {
        return res.json({
          success: true,
          message: `Update Saved <i class="fas fa-check-square"></i>`,
          extraMile: true,
          username: user.name,
          bio: user.bio,
          hobbies: user.hobbies,
        });
      }
    }
  );
};
