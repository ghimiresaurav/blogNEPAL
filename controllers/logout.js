module.exports = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("id", { path: "/" });
  return res.json({ success: true });
};
