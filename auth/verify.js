const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const cookieInfo = req.headers.cookie.split("; ");
    const user = {
      [cookieInfo[0].split("=")[0]]: cookieInfo[0].split("=")[1],
      [cookieInfo[1].split("=")[0]]: cookieInfo[1].split("=")[1],
    };

    if (user.token) {
      jwt.verify(user.token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
          return res
            .cookie("id", "", { path: "/", sameSite: true })
            .cookie("token", "", { path: "/", sameSite: true })
            .redirect(307, "/");
        }
        const trueId = user.id.split("%22")[1];
        if (decodedToken.userId === trueId) {
          res.locals.id = trueId;
        }
      });

      return next();
    }
  }
  return res.redirect(307, "/error");
};
