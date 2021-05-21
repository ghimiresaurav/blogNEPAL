const express = require("express");
const chalk = require("chalk");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");

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

app.get("/dashboard", (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

io.on("connection", (socket) => {
  socket.on("new-user", (stringifiedData) => {
    const { name, email, password } = JSON.parse(stringifiedData);

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
            socket.emit(
              "register-response",
              JSON.stringify({
                success: true,
                message: "User Registered Successfully!",
              })
            );
          }
        );
      } else {
        //email is already registered
        socket.emit(
          "register-response",
          JSON.stringify({
            success: false,
            message:
              "Email already registered. Try a different email or reset password.",
          })
        );
      }
      setTimeout(() => client.close(), 10);
    });
  });
});

// const getUser = (query) => {
//   MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
//     if (err) throw err;
//     const db = client.db(dbName);
//     const users = await db.collection("users").findOne(query);
//     console.log(users);
//     return users;
//   });
//   console.log("helrejr");
// };

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const query = { email };
    const user = await db.collection("users").findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    } else {
      const correctPassword = await bcrypt.compare(password, user.password);
      client.close();
      if (!correctPassword) {
        {
          return res.status(401).json({
            success: false,
            message: "Incorrect Password",
          });
        }
      } else {
        // return res.redirect("dashboard");
        // res.sendFile(staticDir + "/dashboard.html");
        // console.log("ehre");
        // res.sendFile("dashboard.html", {
        //   root: path.join(__dirname, "/public"),
        // });
        const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        });
        // return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
        return res.json({
          success: true,
          token,
        });
      }
    }
    client.close();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
