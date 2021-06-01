const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const cookieInfo = req.headers.cookie.split("; ");
    const user = {
      [cookieInfo[0].split("=")[0]]: cookieInfo[0].split("=")[1],
      [cookieInfo[1].split("=")[0]]: cookieInfo[1].split("=")[1],
    };

    if (user.token) {
      const decodedToken = jwt.verify(user.token, process.env.TOKEN_SECRET);
      const trueId = user.id.split("%22")[1];
      if (decodedToken.userId === trueId) {
        res.locals.id = trueId;
        return next();
      }
    }
  }
  return res
    .status(403)
    .json({ message: "You need to login to complete the action" });
};
