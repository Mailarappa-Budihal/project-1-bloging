const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

const BlogsModel = require("../Models/BlogsModel");



//---------------------------------------------AUTHENTICATION------------------------------//

const authentication = async function(req, res, next) {
        try {
            let token = req.headers["x-api-key"];

            //If no token is present in the request header return error. This means the user is not logged in.
            if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

            jwt.verify(token, 'project1-secrete-key', function(err, decode) {
                if (err) {
                    return res.status(401).send({ status: false, message: err.message })
                } else {
                    req.decodedToken = decode;
                    next()
                }
            })
        } catch (err) {
            res.status(500).send({ msg: "Error", error: err.message })
        }
    }
    //---------------------------------------------Authorization------------------------------//
const authorization = async function(req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "project1-secrete-key"); //verify token with secret key 
        let loginInUser = decodedToken.payload.authorId; //log in by token
        console.log(loginInUser)
        let blogId = req.params.blogId
        if (!mongoose.isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${blogId} blogId  is not valid` });
        }

        let checkBlogId = await BlogsModel.findById({ _id: blogId })
        if (!checkBlogId)
            return res.status(404).send({ status: false, msg: "No blog exists, Enter a valid Object Id" });
        console.log(checkBlogId.authorId)
        if (checkBlogId.authorId.toString() != loginInUser) {
            return res.status(403).send({ status: false, msg: "Authorization failed, You are unauthorized!!" })
        }
        next(); //if auther is same then go to your page

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports = { authentication, authorization }