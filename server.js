const express = require("express");
const chalk = require("chalk");
const path = require("path");
const cors = require('cors')
require("dotenv").config();

const loginController = require("./controllers/login");
const registerController = require("./controllers/register");
const verifyToken = require("./auth/verify");
const addblogcontroller = require("./controllers/addblog");
const getblogcontroller = require("./controllers/idblog")

const app = express();
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

//cors
var corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

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
app.post("/addblog", addblogcontroller);
app.get("/getblog", getblogcontroller);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
