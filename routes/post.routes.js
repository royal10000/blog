const { Router } = require("express");
const {
  allPost,
  postForm,
  createPost,
  UpdatePost,
  editPostForm,
  deletePost,
  singlePost,
} = require("../controller/post.controller");
const jwtVerify = require("../middleware/jwt.middleware");
const upload = require("../middleware/multer.middleware");
const { doubleCsrfProtection } = require("../config/csrf.config");
const postRouter = Router();
postRouter.get("/", allPost);
postRouter.get("/:id/:slug", singlePost);
postRouter.get("/createPost", jwtVerify, postForm);
postRouter.post("/createPost", jwtVerify ,doubleCsrfProtection,upload.single("image"), createPost);
postRouter.get("/editPost/:id", jwtVerify , editPostForm);
postRouter.patch("/editPost/:id", jwtVerify,doubleCsrfProtection ,upload.single("image"), UpdatePost);
postRouter.delete("/deletepost/:id", jwtVerify , deletePost );

module.exports = postRouter;
