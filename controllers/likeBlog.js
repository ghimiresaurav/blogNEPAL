const { MongoClient, ObjectID } = require("mongodb");

//insert a document into database with the time and the user_id of the user posting the blog
module.exports = (req, res) => {
    const { postId, userId } = req.body;
    MongoClient.connect(
        process.env.DB_URL,
        { useUnifiedTopology: true, useNewUrlParser: true },
        async (err, client) => {
            if (err) throw err;
            const db = client.db(process.env.DB_NAME);
            const query = { _id: new ObjectID(postId), like:{ id: userId} };
            const query1 = { _id: new ObjectID(postId)};
            const checkLike=await db
                .collection("blogs").findOne(query)
            if(checkLike){
                const newLike = {
                    id: userId,
                };
  
              await db.collection("blogs").updateOne(query1, {
                  $pull: { like: newLike },
              });
              client.close();
              return res.json({message:"sucessfully disliked"})
            }
            const newLike = {
                  id: userId,
              };

            await db.collection("blogs").updateOne(query1, {
                $push: { like: newLike },
            });
            client.close();
            return res.json({message:"sucessfully liked"})
        }
    );
};