const express = require("express");
const router = express.Router();

//import routes
const update = require("./update");

//import controllers
const logout = require("../controllers/logout");
const getUserDetails = require("../controllers/profile");
const { initiatePost, postBlog } = require("../controllers/postBlog");
const getBlogs = require("../controllers/getBlogs");
const postComment = require("../controllers/postComment");

//import authorization middleware
const verifyToken = require("../auth/verify");

//setup and use static directory
const staticDir = __dirname.replace("routes", "public");
router.use(express.static(staticDir));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//use authorization middleware
router.use(verifyToken);
router.use("/update", update);

//handle requests
router.get("/profile", (req, res) => {
  res.sendFile(staticDir + "/profile.html");
});

router.get("/dashboard", (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

//like section
const like = require("../controllers/likeBlog");
router.post("/like", like);

router.get("/user-details", getUserDetails);
router.delete("/logout", logout);

router.get("/get-blogs", getBlogs);
router.post("/post-blog", initiatePost, postBlog);
router.post("/post-comment", postComment);

router.get("/post", (req, res) => {
  res.sendFile(staticDir + "/post.html");
});
module.exports = router;
