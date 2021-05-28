const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split("=")[1];

    console.log(token);
    console.log(typeof token);
    // req.token = req.headers["authorization"].split(" ")[1];
    next();
  } else {
    return res
      .status(403)
      .json({ message: "You need to login to complete the action" });
  }
};
