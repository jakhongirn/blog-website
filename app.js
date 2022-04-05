//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const dotenv = require("dotenv");
const { response } = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();

dbPassword = process.env.DB_PASSWORD;
mongoose.connect(`mongodb+srv://admin-jaha:${dbPassword}@jay-cluster.dx6ei.mongodb.net/blogDB`, { useNewUrlParser: true });

const postsSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: Date
});



const Post = new mongoose.model("Post", postsSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, post) {
    res.render("home");
  });
});

app.get("/blog", function (req, res) {
  Post.find({}, function (err, post) {
    res.render("posts", {
      posts: post,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/create", function (req, res) {
  res.render("create");
});


app.post("/create", function (req, res) {
  let postDB = new Post({
    title: req.body.blogTitle,
    content: req.body.blogBody,
    date: req.body.blogDate,
    author: req.body.blogAuthor
  });

  postDB.save();

  res.redirect("/blog");
});

app.get("/update/:id", function (req, res) {
  let requestedPostId = req.params.id;

  Post.findById(requestedPostId, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("update", {
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.date
      });
    }
  });
});

app.post("/update/:id", function (req, res) {
  let requestedPostId = req.params.id;
  Post.findByIdAndUpdate(
    { _id: requestedPostId },
    { title: req.body.blogTitle, content: req.body.blogBody, date: req.body.blogDate, author: req.body.blogAuthor },
    function (err) {
      if (!err) {
        console.log("Successfully updated the blog.");
      } else {
        console.log(err);
      }
    }
  );
  res.redirect("/blog");
});

app.post("/delete", function (req, res) {
  Post.deleteMany({}, function (err) {
    if (!err) {
      res.write("Successfully deleted all blogs.");
    }
  });
  res.redirect("/blog");
});

app.get("/blog/:title", function (req, res) {
  let requestedPostTitle = req.params.title;
  Post.findOne({ title: requestedPostTitle }, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.date
      });
    }
  });
});
app.post("/delete/:id", function (req, res) {
  let requestedPostId = req.params.id;
  Post.findByIdAndRemove(requestedPostId, function (err) {
    if (!err) {
      res.write(`Successfully deleted the post`);
    } else {
      res.write("No post is found.");
    }
  });
  res.redirect("/blog");
});


app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
