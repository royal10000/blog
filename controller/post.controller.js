const Post = require("../models/post.model");
const fs = require("fs");
const path = require("path");
const { generateCsrfToken } = require("../config/csrf.config");
const { post } = require("../routes/auth.routes");
require("../routes/post.routes");

exports.allPost = async (req, res) => {
  const posts = await Post.aggregate([
    {
      $match: { status: "published" },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $project: {
        "author.password": 0,
        "author._id": 0,
      },
    },
  ]);
  res.status(200).json({ posts });
};

exports.singlePost = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const post = await Post.aggregate([
      {
        $match: { _id: id },
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "author" },
      {
        $project: { "author.password": 0, "author._id": 0, "author.email": 0 },
      },
    ]);

    if (post.slug !== slug) {
      return res.redirect(`posts/${post._id}/${post.slug}`);
    }

    res.status(200).json({ message: "post fetched successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.postForm = async (req, res) => {
  try {
    res.status(200).json({ csrfToken: generateCsrfToken(req, res) });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
exports.createPost = async (req, res) => {
  const { userId } = req.token;
  const { title, content, status } = req.body;
  const image = req.file;

  try {
    const post = new Post({
      title,
      content,
      author: userId,
      status,
      image: image.path,
    });
    await post.save();

    res.status(200).json({ message: "post created successfully", data: post });
  } catch (error) {
    if (image && image.path) {
      const filepath = path.join(__dirname, image.path);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath, (error) => {
          if (error) console.log("File delete failed", error);
        });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

exports.editPostForm = async (req, res) => {
  const id = req.params.id;
  const existingPost = await Post.findById(id);
  if (!existingPost) {
    return res.status(404).json({ message: "post not found" });
  }
  res
    .status(200)
    .json({ csrfToken: generateCsrfToken(req, res), data: existingPost });
};

exports.UpdatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content, status } = req.body;
  const image = req.file;
  try {
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).json({ message: "post not found" });
    }
    existingPost.title = title;
    existingPost.content = content;
    existingPost.status = status;
    if (image && image.path) {
      const oldimagepath = path.join(__dirname, existingPost.image);
      if (fs.existsSync(oldimagepath)) {
        fs.unlinkSync(oldimagepath);
      }

      existingPost.image = image.path;
    }

    await existingPost.save();
    res
      .status(200)
      .json({ message: "post updated successfully ", data: existingPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image) {
      const imagePath = path.resolve(__dirname, post.image);

      try {
        await fs.unlink(imagePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          return res.status(500).json({
            message: "Error deleting image",
            error: err.message,
          });
        }
      }
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" }).select("-image");
    if (posts.length < 1) {
      return res.status(200).json({ message: "No posts available" });
    }
    res
      .status(200)
      .json({ message: "posts fetched successfully", data: posts });
  } catch (error) {
    res.status(500).json({ message: `error in getAllPost ${error.message}` });
  }
};

exports.getPostByWriterOrAdmin=async(req,res)=>{
  try {
    const {userId,role}=req.token
    if(role==="admin"){
      
    }
    
  } catch (error) {
    res.status(500).json({message: `error in getpostbywriteoradmin ${error.message}`})
  }
}