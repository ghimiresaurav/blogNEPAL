const { MongoClient, ObjectID } = require("mongodb");
const fs = require("fs");
const { constants } = require("buffer");

module.exports = (req, res) => {
  const { blogId } = req.body;
  const userId = res.locals.id;
  const query = { _id: new ObjectID(blogId) };
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const blogToDelete = await db.collection("blogs").findOne(query);
      if (!blogToDelete)
        //if the blog doesn't exist i.e. the blogId is invalid
        return res.json({
          success: false,
          message: "Unable to delete. Such blog does not exist",
        });

      if (blogToDelete.author.id !== userId) {
        //if blog exists but belongs to someone else
        return res.json({
          success: false,
          message:
            "Unable to delete. You do not have permission to delete this blog",
        });
      } else {
        //if the blog exists and belongs to the requesting user
        //delete the blog from the database
        const message = await db.collection("blogs").deleteOne(query);
        if (message.result.ok)
          res.json({ success: true, message: "Blog Deleted" });
        const dir = `${__dirname.replace(
          "controllers",
          "public"
        )}/assets/blog_images/post-${blogId}`;
        //check and delete if the blog had images
        fs.access(dir, constants.F_OK, (err) => {
          if (!err) {
            fs.rmdir(dir, { recursive: true }, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    }
  );
};
