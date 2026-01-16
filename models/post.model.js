const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug must be required"],
      unique: [true, "slug must be unique"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    content: {
      type: String,
      required: [true, "content is requied"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      default: "en",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  const update = this.getupdate();
  if (update.title) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });
    slug = baseSlug;
    counter = 1;
  
    while (await mongoose.models.Post.exists({ slug })) {
      slug = `${baseSlug - counter}`;
      counter + 1;
    }
    update.slug = slug;
  }
  next();
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
