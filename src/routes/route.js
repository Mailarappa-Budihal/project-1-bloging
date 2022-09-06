const express = require('express');
const Router = express.Router();

const AuthorController = require("../Controllers/AuthorController")
const BlogController = require("../Controllers/BlogsController")





Router.post("/authors", AuthorController.createAuthor)
Router.post("/blogs", BlogController.createBlog)





module.exports = Router