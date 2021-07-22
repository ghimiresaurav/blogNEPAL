const MongoClient = require("mongodb").MongoClient;

module.exports = (req, res) => {
    const { name } = req.body;
    MongoClient.connect(
        process.env.DB_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            if (err) throw err;
            const db = client.db(process.env.DB_NAME);
            //search blog
            db.collection("blogs").createIndex({title:"text"})
            const posts = await db.collection("blogs").find({$text:{$search: name}}).toArray()
            console.log(posts);
            return res.json(posts);
        }
    );
};