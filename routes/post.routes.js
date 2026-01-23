const { Router } = require("express");
const {
  allPost,
  postForm,
  createPost,
  UpdatePost,
  editPostForm,
  deletePost,
  singlePost,
  getPostByWriterOrAdmin,
} = require("../controller/post.controller");
const jwtVerify = require("../middleware/jwt.middleware");
const upload = require("../middleware/multer.middleware");
const { doubleCsrfProtection } = require("../config/csrf.config");
const authorize = require("../middleware/authorize.middleware");
const postRouter = Router();

postRouter.get("/", allPost);
postRouter.get("/:id/:slug", singlePost);
postRouter.get(
  "/createPost",
  jwtVerify,
  authorize("admin", "author"),
  postForm,
);
postRouter.post(
  "/createPost",
  jwtVerify,
  authorize("admin", "author"),
  doubleCsrfProtection,
  upload.single("image"),
  createPost,
);
postRouter.get(
  "/editPost/:id",
  jwtVerify,
  authorize("admin", "author"),
  editPostForm,
);

postRouter.patch(
  "/editPost/:id",
  jwtVerify,
  authorize("admin", "author"),
  doubleCsrfProtection,
  upload.single("image"),
  UpdatePost,
);
postRouter.delete("/deletepost/:id", jwtVerify, deletePost);
postRouter.get(
  "/:id/posts",
  jwtVerify,
  authorize("admin", "author"),
  getPostByWriterOrAdmin,
);
module.exports = postRouter;
