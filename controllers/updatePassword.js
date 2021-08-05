const { MongoClient, ObjectID } = require("mongodb");
const bcrypt = require("bcrypt");

module.exports = (req, res) => {
  MongoClient.connect(
    process.env.DB_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { _id: new ObjectID(res.locals.id) };
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const update = { $set: { password: hashedPassword } };
      const success = await db.collection("users").updateOne(query, update);
      if (success.result.ok) {
        res.json({
          success: true,
          message: `Password updated <i class="fas fa-check-square"></i>`,
          extraMile: false,
        });
      }
    }
  );
};
