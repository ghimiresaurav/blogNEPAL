const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const date = require("../utils/getTime");
require("dotenv").config();

module.exports = (req, res) => {
  const { email, name, password } = req.body;

  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;

      const db = client.db(process.env.DB_NAME);
      const query = { email };

      //Check whether the email is unique or already exists in the database
      const registeredUsersWithSameEmail = await db
        .collection("users")
        .find(query)
        .toArray();
      const emailIsUnique = !registeredUsersWithSameEmail.length;

      if (emailIsUnique) {
        //add the user to database
        db.collection("users").insertOne(
          {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            avatarLink: "./assets/avatars/default-avatar.png",
            joinedOn: date,
          },
          (err, result) => {
            if (err) throw err;
            res.json({
              success: true,
              message: "User Registered Successfully!",
            });
          }
        );
      } else {
        //email is already registered
        res.json({
          success: false,
          message:
            "Email already registered. Try a different email or reset password.",
        });
      }
      setTimeout(() => client.close(), 10);
    }
  );
};
