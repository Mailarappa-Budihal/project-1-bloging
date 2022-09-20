const jwt = require("jsonwebtoken");
const BlogsModel = require("../Models/BlogsModel");



//---------------------------------------------AUTHENTICATION------------------------------//

const authenticate = async function(req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        jwt.verify(token, "project1-secrete-key", function(err, decodedToken) {

            if (err) {
                return res.status(401).send({ status: false, msg: "Token is invalid" })

            } else {
                req.token = decodedToken.authorId
                console.log(req.token)

                next()

            }
        })

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }
}





//---------------------------------------------Authorization------------------------------//

const auth = async function(req, res, next) {
    try {

        let Query = req.query
        if (Object.keys(Query).length !== 0) {
            const Blog = await BlogsModel.findOne({ authorId: req.token, ...Query })
            if (!Blog) {
                return res.status(404).send({ status: false, message: "blog are not found" })

            }

            if (Blog.authorId.toString() !== req.token) {
                return res.status(400).send({ status: false, message: "you are not authorised" });
            }

            return next()
        }



        //------------------------------------------- AuthorisationByparam-----------------------------------------------//


        let BlogId = req.params.blogId;

        const isblog = await BlogsModel.findOne({ _id: BlogId, isDeleted: false })
        if (!isblog) {
            return res.status(404).send({ status: false, message: "blog are not found" })
        }

        if (isblog.authorId.toString() !== req.token) {

            return res.status(400).send({ status: false, message: "you have not access for authorization" });
        }

        next()

    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports = { authenticate, auth }