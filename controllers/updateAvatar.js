const multer = require("multer");
const { MongoClient, ObjectID } = require("mongodb");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = (req, res) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        //save the image to file in separate folders for each user dynamically
        const dir = path.join(
          __dirname.replace("controllers", "public"),
          `/assets/avatars/uploads/user-${res.locals.id}`
        );

        fs.access(dir, (err) => {
          if (err) {
            return fs.mkdir(dir, (err) => cb(err, dir));
          } else return cb(null, dir);
        });
      },
      filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
      },
    }),
  }).single("avatar");

  upload(req, res, (err) => {
    if (err) console.error(err);
    const { file } = req;

    //get a relative link for the image
    const avatarLink = `.${file.path.replace(/\\/g, "/").split("public")[1]}`;

    MongoClient.connect(
      process.env.DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, client) => {
        if (err) throw err;
        const db = client.db(process.env.DB_NAME);
        const query = { _id: new ObjectID(res.locals.id) };
        const update = { $set: { avatarLink } };

        //update the old link with new one in database
        db.collection("users").updateOne(query, update);
        return res.json({
          success: true,
          avatarLink,
        });
      }
    );
  });
};
