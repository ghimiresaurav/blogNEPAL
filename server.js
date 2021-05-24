const express = require("express");
const chalk = require("chalk");
const path = require("path");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginController = require("./controllers/login");
const registerController = require("./controllers/register");

const app = express();
//create server
// const server = http.createServer(app);
// const io = socketio(server);
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

app.post("/register", registerController);
app.post("/login", loginController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
