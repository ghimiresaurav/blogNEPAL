const { MongoClient, ObjectID } = require("mongodb");

//returns all the blogs in the database
const getAllBlogs = (req, res) => {
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const posts = await db.collection("blogs").find().toArray();
      return res.json(posts);
    }
  );
};

//returns the blogs posted the requesting user
//i.e. if a user "Saurav Ghimire" calls this function, only their blogs are returned
const getOwnBlogs = (req, res) => {
  const { id } = req.body;
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const query = { "author.id": id };
      const blogs = await db.collection("blogs").find(query).toArray();
      return res.json(blogs);
    }
  );
};

const getSpecificBlog = (req, res) => {
  const blogId = req.params.id;
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;
      const db = client.db(process.env.DB_NAME);
      const blog = await db
        .collection("blogs")
        .findOne({ _id: new ObjectID(blogId) });
      res.json(blog);
    }
  );
};

module.exports = {
  getAllBlogs,
  getOwnBlogs,
  getSpecificBlog,
};
