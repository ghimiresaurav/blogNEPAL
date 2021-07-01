const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const cookieInfo = req.headers.cookie.split("; ");
    const user = {
      [cookieInfo[0].split("=")[0]]: cookieInfo[0].split("=")[1],
      [cookieInfo[1].split("=")[0]]: cookieInfo[1].split("=")[1],
    };

    if (user.token) {
      const decodedToken = jwt.verify(user.token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.clearCookie("token", { path: "/" });
          res.clearCookie("id", { path: "/" });
          return res.redirect(307, '/')
        }
        const trueId = user.id.split("%22")[1];
        if (decoded.userId === trueId) {
          res.locals.id = trueId;
        }
      });

      return next();

    }
  }
  return res.redirect(307, '/error')
};
