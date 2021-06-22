const express = require("express");
const router = express.Router();

//import auth middleware
const verifyPassword = require("../auth/verifyPassword");

//import controllers
const updateUsername = require("../controllers/updateUsername");

router.put("/username", verifyPassword, updateUsername);

module.exports = router;
//<i class="fas fa-check-square"></i>
