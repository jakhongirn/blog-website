//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require("dotenv")
const PORT = process.env.PORT || 3000
const app = express();
dotenv.config();

dbPassword = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://admin-jay:${dbPassword}@jaycluster.dx6ei.mongodb.net/blogDB`, {useNewUrlParser: true});


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeContent,
    posts: posts,
  });
});



app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
let posts = [];

app.post("/compose", function (req, res) {
  let post = {
    title: req.body.blogTitle,
    content: req.body.blogBody,
  };
  posts.push(post);

  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  posts.forEach(function (post) {
    let requestedTitle = _.lowerCase(req.params.postName);
    let storedTitle = _.lowerCase(post.title);
    if (requestedTitle === storedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }
  });
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
