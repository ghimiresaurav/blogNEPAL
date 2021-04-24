const express = require("express");
const chalk = require("chalk");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const { isObject } = require("util");

const dbUrl = "mongodb://localhost/27017";
const dbName = "blognepal";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.use(express.json({ limit: "1mb" }));

app.get("/register", (req, res) => {
  res.sendFile(staticDir + "/register.html");
});

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("new-user", (string) => {
    const { name, email, password } = JSON.parse(string);

    MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
      if (err) throw err;

      const db = client.db(dbName);
      const query = { email };

      const registeredUsersWithSameEmail = await db
        .collection("users")
        .find(query)
        .toArray();
      const emailIsUnique = !registeredUsersWithSameEmail.length;

      console.log("is unique: ", emailIsUnique);
      if (emailIsUnique) {
        db.collection("users").insertOne(
          { name, email, password: await bcrypt.hash(password, 10) },
          (err, result) => {
            if (err) throw err;
            console.log("user registered");
            socket.emit("response", "user registered successfully");
          }
        );
      } else {
        //email is already registered
        socket.emit("response", "email already registered");
      }
    });

    console.log("new register request");
    console.log(name, email, password);
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
