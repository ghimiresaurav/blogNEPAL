const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res) => {
  const { email, password } = req.body;

  MongoClient.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { email };
      const user = await db.collection("users").findOne(query);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      } else {
        const correctPassword = await bcrypt.compare(password, user.password);
        client.close();
        if (!correctPassword) {
          {
            return res.status(401).json({
              success: false,
              message: "Incorrect Password",
            });
          }
        } else {
          const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "3s",
            }
          );
          req.headers.authorization = token;
          return res.json({
            success: true,
            token,
          });
        }
      }
    }
  );
};
