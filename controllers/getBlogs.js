const MongoClient = require("mongodb").MongoClient;
require("dotenv").config;

module.exports = async (req, res) => {
  const id = "12345";

  MongoClient.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, client) => {
      if (err) throwerr;

      const db = client.db(process.env.DB_NAME);
      const query = { id };
      await db
        .collection("blogs")
        .find(query)
        .toArray(function (err, result) {
          if (err) throw err;
          return res.json({
            success: true,
            data: result,
          });
        });
    }
  );
};
