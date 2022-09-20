const express = require('express');
const Router = express.Router();

const AuthorController = require("../Controllers/AuthorController")
const BlogController = require("../Controllers/BlogsController")
const commonMid = require("../middleware/auth")

//--------------------------------This is authors api-----------------------------//

Router.post("/authors", AuthorController.createAuthor)


//--------------------------------This is login api-----------------------------//

Router.post("/login", AuthorController.loginAuthor)


//--------------------------------This is CreateBlog api-----------------------------//

Router.post("/blogs", commonMid.authentication, BlogController.createBlog)


//--------------------------------This is getBlog api-----------------------------//

Router.get("/blogs", commonMid.authentication, BlogController.getBlog)


//--------------------------------This is updateBlog api-----------------------------//

Router.put("/blogs/:blogId", commonMid.authentication, commonMid.authorization, BlogController.updateBlog)


//--------------------------------This is deleteBlogs api-----------------------------//

Router.delete("/blogs/:blogId", commonMid.authentication, commonMid.authorization, BlogController.deleteBlogs)


//--------------------------------This is deleteByquery api-----------------------------//

Router.delete("/blogs", commonMid.authentication, BlogController.deleteByquery)

module.exports = Router;