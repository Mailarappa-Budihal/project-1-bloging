const jwt = require("jsonwebtoken");
const BlogsModel = require("../Models/BlogsModel");



//---------------------------------------------AUTHENTICATION------------------------------//

const authentication = async function(req, res, next) {
    try {


        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }


        jwt.verify(token, "project1-secrete-key", function(err, decodedToken) {

            if (err) {

                return res.status(401).send({ status: false, msg: "Token is invalid" })

            } else {
                req.token = decodedToken
                console.log(req.token)

                next()

            }
        })

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }
}





//---------------------------------------------Authorization------------------------------//

const authorization = async function(req, res, next) {
    try {
        //------------------------------------------- AuthorisationByparam-----------------------------------------------//


        let BlogId = req.params.blogId;

        const isblog = await BlogsModel.findOne({ _id: BlogId, isDeleted: false })
        if (!isblog) {
            return res.status(404).send({ status: false, message: "blog are not found" })
        }

        if (isblog.authorId.toString() !== req.token.authorId) {

            return res.status(403).send({ status: false, message: "you have not access for authorization" });
        }

        next()

    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports = { authentication, authorization }