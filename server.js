const express = require("express");
const chalk = require("chalk");
const path = require("path");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost/27017";
const dbName = "blognepal";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();
//set up a static folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.use(express.json({ limit: "1mb" }));

app.get("/register", (req, res) => {
  res.sendFile(staticDir + "/register.html");
});

app.post("/register/new-user", (req, res) => {
  const { name, email, password } = req.body;
  let message = "";

  MongoClient.connect(dbUrl, dbOptions, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    const query = { email };
    const usersWithSameEmail = await db
      .collection("users")
      .find(query)
      .toArray();
    if (usersWithSameEmail.length === 0) {
      db.collection("users").insertOne({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });
    } else {
      message = "email already registered";
    }

    client.close();
    console.log(usersWithSameEmail.length);
  });

  // console.log(`
  // Name: ${user.name}
  // Email: ${user.email}
  // Password: ${user.password}`);
  // console.log(req.body);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(chalk.magenta(`SERVER STARTED ON PORT ${PORT}`))
);
