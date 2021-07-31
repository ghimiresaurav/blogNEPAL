const express = require("express");
const router = express.Router();

//import routes
const update = require("./update");

//import authorization middleware
const verifyToken = require("../auth/verify");

//import controllers
const logout = require("../controllers/logout");
const { initiatePost, postBlog } = require("../controllers/postBlog");
const postComment = require("../controllers/postComment");
const { searchByTag, searchByTitle } = require("../controllers/searchBlogs");
const deleteBlog = require("../controllers/deleteBlog");
const {
  getAllBlogs,
  getOwnBlogs,
  getSpecificBlog,
} = require("../controllers/getBlogs");

//setup and use static directory
const staticDir = __dirname.replace("routes", "public");
router.use(express.static(staticDir));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//use authorization middleware
router.use(verifyToken);

//use update route for update requests
router.use("/update", update);

//handle requests
router.get("/profile", (req, res) => {
  res.sendFile(staticDir + "/profile.html");
});

router.get("/dashboard", (req, res) => {
  res.sendFile(staticDir + "/dashboard.html");
});

router.get("/post", (req, res) => {
  res.sendFile(staticDir + "/post.html");
});

router.get("/blog", (req, res) => {
  res.sendFile(staticDir + "/BlogPost.html");
});

const like = require("../controllers/likeBlog");

router.get("/get-blogs", getAllBlogs);
router.get("/blog/:id", getSpecificBlog);
router.post("/getblogbyid", getOwnBlogs);
router.post("/searchblog", searchByTitle);
router.post("/search", searchByTag);
router.post("/like", like);
router.post("/post-comment", postComment);
router.post("/post-blog", initiatePost, postBlog);
router.delete("/deleteBlog", deleteBlog);
router.delete("/logout", logout);

module.exports = router;
