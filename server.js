const express = require("express");
const chalk = require("chalk");
const path = require("path");
require("dotenv").config();

const loginController = require("./controllers/login");
const registerController = require("./controllers/register");
const verifyToken = require("./auth/verify");
const updateAvatar = require("./controllers/updateAvatar");

const app = express();
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

//use json
app.use(express.json({ limit: "1mb" }));

//serve html files from the static folder
app.get("/register", (req, res) => {
  res.sendFile(staticDir + "/register.html");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

app.post("/register", registerController);
app.post("/login", loginController);
app.post("/avatar-update", updateAvatar);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
