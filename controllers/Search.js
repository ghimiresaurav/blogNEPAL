const MongoClient = require("mongodb").MongoClient;

module.exports = (req, res) => {
    const { name } = req.body;
    MongoClient.connect(
        process.env.DB_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            if (err) throw err;
            const db = client.db(process.env.DB_NAME);
            const query = { tags: name };
            //search tag
            const posts = await db.collection("blogs").find(query).toArray();
            return res.json(posts);
        }
    );
};