//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require("dotenv");
const { response } = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();

dbPassword = process.env.DB_PASSWORD;
mongoose.connect(`mongodb://127.0.0.1:27017/blogDB`, { useNewUrlParser: true });

const postsSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: Date
});

const homeContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const Post = new mongoose.model("Post", postsSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, post) {
    res.render("home", {
      homeStartingContent: homeContent,
    });
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
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/create", function (req, res) {
  res.render("create");
});


app.post("/create", function (req, res) {
  let postDB = new Post({
    title: req.body.blogTitle,
    content: req.body.blogBody,
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
      });
    }
  });
});

app.post("/update/:id", function (req, res) {
  let requestedPostId = req.params.id;
  Post.findByIdAndUpdate(
    { _id: requestedPostId },
    { title: req.body.blogTitle, content: req.body.blogBody },
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
app.put("/update/:id", function (req, res) {
  let requestedPostId = req.params.id;
  Post.update(
    { title: requestedPostTitle },
    { title: req.body.title, content: req.body.content },
    function (err) {
      if (!err) {
        res.send("Successfully updated the data.");
      }
    }
  );
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
