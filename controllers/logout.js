module.exports = (req, res) => {
  //clear cookie and send response
  res.clearCookie("token", { path: "/" });
  res.clearCookie("id", { path: "/" });
  return res.json({ success: true });
};
