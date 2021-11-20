const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const { render } = require("ejs");

// express app
const app = express();

// Connect to mongodb
const dbURI =
  "mongodb+srv://hendrickl:bobXulhiszOgh65G@cluster0.i9q6o.mongodb.net/node-template?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");
// app.set('views', 'myviews');

// Middleware & static files : wich we want to make public
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Opt for accepting form data
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Blog routes
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
