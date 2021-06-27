const { MongoClient, ObjectID } = require("mongodb");
const bcrypt = require("bcrypt");

module.exports = (req, res, next) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectID(res.locals.id) });
      const correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!correctPassword)
        return res.json({
          success: false,
          message: `Incorrect Password <i class="fas fa-times-circle"></i>`,
        });
      next();
    }
  );
};
