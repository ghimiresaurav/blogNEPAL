const { MongoClient, ObjectID } = require("mongodb");
const fs = require("fs");
const { constants } = require("buffer");

module.exports = (req, res) => {
  const query = { _id: new ObjectID(res.locals.id) };
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const user = await db.collection("users").findOne(query);

      if (!user)
        return res.json({ success: false, message: "User does not exist" });

      const blogsByThisUser = await db
        .collection("blogs")
        .find({ "author.id": res.locals.id }, { projection: { _id: 1 } })
        .toArray();

      if (blogsByThisUser.length) {
        blogsByThisUser.forEach(async (blog) => {
          const result = await db
            .collection("blogs")
            .deleteOne({ _id: new ObjectID(blog._id) });

          const blogImagesDir = `${__dirname.replace(
            "controllers",
            "public"
          )}/assets/blog_images/post-${blog._id}`;

          fs.access(blogImagesDir, constants.F_OK, (err) => {
            if (!err) {
              fs.rmdir(blogImagesDir, { recursive: true }, (err) => {
                if (err) throw err;
              });
            }
          });
        });
      }
      const avatarDir = `${__dirname.replace(
        "controllers",
        "public"
      )}/assets/avatars/uploads/user-${res.locals.id}`;

      fs.access(avatarDir, constants.F_OK, (err) => {
        if (!err) {
          fs.rmdir(avatarDir, { recursive: true }, (err) => {
            if (err) throw err;
          });
        }
      });

      let result = await db.collection("users").deleteOne(query);
      if (result.message.documents[0].ok) {
        res.clearCookie("token", { path: "/" });
        res.clearCookie("id", { path: "/" });
        return res.json({ success: true, message: "Account Deleted" });
      }
    }
  );
};
