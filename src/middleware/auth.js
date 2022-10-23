const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const validator = require("../validator/validator")
const BlogsModel = require("../Models/BlogsModel");



//---------------------------------------------AUTHENTICATION------------------------------//

const authentication = function(req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });


        jwt.verify(token, "project1-secrete-key", function(err, decodedToken) {
            if (err) {
                let message =
                    err.message === "jwt expired" ? "Token is expired" : "Token is invalid";
                return res.status(401).send({ status: false, msg: message })
            }

            req.decodedToken = decodedToken //setting an attribute in req so that we can access it everywhere

            //console.log(decodedToken)
            next()
        });


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

//---------------------------------------------Authorization------------------------------//

const authorization = async(req, res, next) => {
    try {
        let userLoggedIn = req.decodedToken
        console.log(userLoggedIn)
        let blogId = req.params.blogId;

        if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "Please enter valid Book Id,it should be of 24 digits" })

        let checkBlog = await BlogsModel.findById(blogId)
        if (!checkBlog) return res.status(404).send({ status: false, msg: "No book present with this book Id " })
            // console.log(checkBlog)

        let userToBeModified = checkBlog.authorId.toString();

        //console.log(userToBeModified)

        if (userToBeModified !== userLoggedIn.authorId) return res.status(403).send({ status: false, msg: 'User not authorized to perform this action' })

        if (checkBlog.isDeleted == true) return res.status(400).send({ status: false, msg: "Book with the given id is already deleted!!" })

        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { authentication, authorization }