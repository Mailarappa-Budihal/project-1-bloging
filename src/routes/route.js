const express = require('express');
const router = express.Router();

const AuthorController = require("../Controllers/AuthorController")
const BlogController = require("../Controllers/BlogsController")
const { authentication, authorization } = require("../middleware/auth")

//--------------------------------This is authors api-----------------------------//

router.post("/authors", AuthorController.createAuthor)


//--------------------------------This is login api-----------------------------//

router.post("/login", AuthorController.loginAuthor)


//--------------------------------This is CreateBlog api-----------------------------//

router.post("/blogs", authentication,BlogController.createBlog)


//--------------------------------This is getBlog api-----------------------------//

router.get("/blogs", authentication, BlogController.getBlogs)


//--------------------------------This is updateBlog api-----------------------------//

router.put("/blogs/:blogId", authentication, authorization, BlogController.updateBlog)


//--------------------------------This is deleteBlogs api-----------------------------//

router.delete("/blogs/:blogId", authentication, authorization, BlogController.deleteBlogs)


//--------------------------------This is deleteByquery api-----------------------------//

router.delete("/blogs", authentication, BlogController.deleteByquery)

router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })

module.exports = router;
