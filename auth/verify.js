module.exports = (req, res, next) => {
  console.log(`req.headers.authorization:`, req.headers.authorization);
  if (req.headers.authorization) {
    console.log(req.headers.authorization);
    req.token = req.headers.authorization.token;
    next();
  } else {
    res.sendStatus(403);
  }
};
