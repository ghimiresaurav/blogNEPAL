const MongoClient = require("mongodb").MongoClient

module.exports = (req, res) => {
    const {id} = req.body;
    MongoClient.connect(process.env.DB_URL,
        {useNewUrlParser:true, useUnifiedTopology:true},
        async (err,client)=>{
            if(err) throw err;
            const db= client.db(process.env.DB_NAME)
            const query = { 'author.id' : id } ;
            const blogs = await db.collection("blogs").find(query).toArray();
            console.log(blogs)
            return res.json(blogs)
        }
    )
}