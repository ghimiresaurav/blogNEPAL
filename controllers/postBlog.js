const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectID } = require("mongodb");
const date = require("../utils/getTime");

//insert a document into database with the time and the user_id of the user posting the blog
const initiatePost = (req, res, next) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const author = await db
        .collection("users")
        .findOne({ _id: new ObjectID(res.locals.id) });
      const blog = {
        author: {
          id: res.locals.id,
          name: author.name,
        },
        postedOn: date,
      };
      const result = await db.collection("blogs").insertOne(blog);
      res.locals.blogID = result.insertedId;
      client.close();
      next();
    }
  );
};

//save images to disk and update the document (add text content and links to images)
const postBlog = (req, res) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (err, file, cb) => {
        //create separate folders for each posts dynamically
        const dir = path.join(
          __dirname.replace("controllers", "public"),
          `assets/blog_images/post-${res.locals.blogID}`
        );
        fs.access(dir, (err) => {
          if (err) {
            return fs.mkdir(dir, (err) => cb(err, dir));
          }
          return cb(null, dir);
        });
      },
      filename: (req, file, cb) =>
        cb(null, `img-${Date.now()}${path.extname(file.originalname)}`),
    }),
  }).array("images");

  upload(req, res, (err) => {
    if (err) console.error(err);
    const { content } = req.body;
    const { files } = req;
    let links = ``;

    if (files.length) {
      links = files.reduce(
        (paths, elem) =>
          `${paths}, .${elem.path.replaceAll("\\", "/").split("public")[1]}`,
        ``
      );
    }

    const query = { _id: new ObjectID(res.locals.blogID) };
    const update = { $set: { content, links } };

    MongoClient.connect(
      process.env.DB_URL,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err, client) => {
        if (err) throw err;
        const db = client.db(process.env.DB_NAME);
        db.collection("blogs").updateOne(query, update);
      }
    );
  });
};

module.exports = { initiatePost, postBlog };
