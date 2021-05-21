const express = require("express");
const chalk = require("chalk");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const { send } = require("process");

//constant database-related variables
const dbUrl = "mongodb://localhost/27017";
const dbName = "blognepal";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();
//create server
const server = http.createServer(app);
const io = socketio(server);
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

//use json
app.use(express.json({ limit: "1mb" }));

//serve html files from the static folder
app.get("/register", (req, res) => {
  res.sendFile(staticDir + "/register.html");
});

io.on("connection", (socket) => {
  socket.on("new-user", (string) => {
    const { name, email, password } = JSON.parse(string);

    MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
      if (err) throw err;

      const db = client.db(dbName);
      const query = { email };

      //check whether the email entered is unique or already exists in the database
      const registeredUsersWithSameEmail = await db
        .collection("users")
        .find(query)
        .toArray();

      const emailIsUnique = !registeredUsersWithSameEmail.length;

      if (emailIsUnique) {
        //add the user to database
        db.collection("users").insertOne(
          { name, email, password: await bcrypt.hash(password, 10) },
          (err, result) => {
            if (err) throw err;
            socket.emit("response", JSON.stringify({ registered: true }));
          }
        );
      } else {
        //email is already registered
        socket.emit("response", JSON.stringify({ registered: false }));
      }
      setTimeout(() => client.close(), 10);
    });
  });
});

const sendResponse = (to, response) => {
  app.get(to, (req, res) => {
    res.json(response);
  });
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const query = { email };

    const regUser = await db.collection("users").findOne(query);
    if (!regUser) {
      sendResponse("/login/response", {
        success: false,
        cause: "user does not exist",
      });
      // res.send({ success: false, cause: "user does not exist" });
    } else {
      const correctCredentials = await bcrypt.compare(
        password,
        regUser.password
      );
      if (correctCredentials) {
        console.log("correct credentials");
        sendResponse("/login/response", { success: true });
        // res.json({ success: true });
      } else {
        sendResponse("/login/response", {
          success: false,
          cause: "wrong password",
        });
        // res.json({ success: false, cause: "wrong password" });
      }
    }
    // console.log(regUser);
    client.close();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
