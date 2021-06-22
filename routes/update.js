const express = require("express");
const router = express.Router();

//import auth middleware
const verifyPassword = require("../auth/verifyPassword");

//import controllers
const updateAvatar = require("../controllers/updateAvatar");
const updateUsername = require("../controllers/updateUsername");
const updateBioAndHobbies = require("../controllers/updateBioAndHobbies");

router.put("/avatar", updateAvatar);
router.put("/bio-and-hobbies", updateBioAndHobbies);
router.put("/username", verifyPassword, updateUsername);

module.exports = router;
//<i class="fas fa-check-square"></i>
