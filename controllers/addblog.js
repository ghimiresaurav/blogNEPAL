const MongoClient = require("mongodb").MongoClient;
require("dotenv").config;

module.exports = async (req, res) => {
    const { content, title } = req.body;
    const id="12345";
    let date= new Date();

    MongoClient.connect(
        process.env.DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        async (err, client) => {
            if (err) throwerr;

            const db = client.db(process.env.DB_NAME);

            //add blog to the database 
            db.collection("blogs").insertOne(
                { title, content, id, date },
                (err, result) => {
                    if (err) throw err;
                    res.json({ sucess: true, message: "Blog Sucessfully Added!" })
                }
            )
        }
    )
}