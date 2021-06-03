const express = require("express");
const router = express.Router();

//import controllers
const updateAvatarController = require("../controllers/updateAvatar");
const logoutController = require("../controllers/logout");
const profileController = require("../controllers/profile");

//import authorization middleware
const verifyToken = require("../auth/verify");

//setup and use static directory
const staticDir = __dirname.replace("routes", "public");
router.use(express.static(staticDir));

//use authorization middleware
router.use(verifyToken);

router.get("/profile", (req, res) => {
  res.sendFile(staticDir + "/profile.html");
});

router.get("/dashboard", (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

router.get("/user-details", profileController);
router.post("/update-avatar", updateAvatarController);
router.delete("/logout", logoutController);

module.exports = router;
