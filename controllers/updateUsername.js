const { MongoClient, ObjectID } = require("mongodb");

module.exports = (req, res) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { _id: new ObjectID(res.locals.id) };
      const success = await db.collection("users").updateOne(query, {
        $set: { name: req.body.newUsername },
      });
      const user = await db.collection("users").findOne(query);
      if (success.result.ok) {
        res.json({
          success: true,
          message: `Username updated <i class="fas fa-check-square"></i>`,
          extraMile: true,
          username: user.name,
          bio: user.bio,
          hobbies: user.hobbies,
        });
      }
    }
  );
};
