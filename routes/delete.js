const express = require("express");
const router = express.Router();

//import authentication middleware
const verifyLoggedIn = require("../auth/verify");

//use authentication middleware
router.use(verifyLoggedIn);

//import controllers
const deleteBlog = require("../controllers/deleteBlog");
const deleteAccount = require("../controllers/deleteAccount");

router.delete("/blog", deleteBlog);
router.delete("/account", deleteAccount);

module.exports = router;
