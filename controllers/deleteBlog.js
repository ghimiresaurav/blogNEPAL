const { MongoClient, ObjectID } = require("mongodb");
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  console.log("delete request");
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
      if (blogToDelete.author.id === userId) {
        const message = await db.collection("blogs").deleteOne(query);
        if (message.result.ok) res.json({ message: "Blog Deleted" });
        const dir = `${__dirname.replace(
          "controllers",
          "public"
        )}/assets/blog_images/post-${blogId}`;
        fs.rmdir(dir, { recursive: true }, (err) => {
          if (err) throw err;
        });
      } else {
        console.log("cannot delete");
        return res.json({
          message:
            "Unable to delete. You do not have permission to delete this blog",
        });
      }
    }
  );
};
