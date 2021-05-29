const express = require("express");
const chalk = require("chalk");
const path = require("path");

const loginController = require("./controllers/login");
const registerController = require("./controllers/register");
const verifyToken = require("./auth/verify");
const updateAvatarController = require("./controllers/updateAvatar");
const profileController = require("./controllers/profile");

const app = express();
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

//use json
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

//serve html files from the static folder
app.get("/register", (req, res) => {
  res.sendFile(staticDir + "/register.html");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

app.get("/profile", verifyToken, (req, res) => {
  res.sendFile(staticDir + "/profile.html");
});

app.get("/user-details", verifyToken, profileController);

app.post("/register", registerController);
app.post("/login", loginController);
app.post("/update-avatar", verifyToken, updateAvatarController);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
