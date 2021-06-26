const express = require("express");
const router = express.Router();

//import auth middleware
const verifyLoggedIn = require("../auth/verify");
const verifyPassword = require("../auth/verifyPassword");

//import controllers
const updateAvatar = require("../controllers/updateAvatar");
const updateUsername = require("../controllers/updateUsername");
const updateBioAndHobbies = require("../controllers/updateBioAndHobbies");
const updatePassword = require("../controllers/updatePassword");

router.use(verifyLoggedIn);

router.put("/avatar", updateAvatar);
router.put("/bio-and-hobbies", updateBioAndHobbies);
router.put("/username", verifyPassword, updateUsername);
router.put("/password", verifyPassword, updatePassword);

module.exports = router;
