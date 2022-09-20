const AuthorModel = require("../Models/AuthorModel");
const jwt = require("jsonwebtoken");

const isValid = function(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "String " && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0;
};





const createAuthor = async function(req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) {
            res
                .status(400)
                .send({
                    status: false,
                    msg: " in valid request parameters please provide author details",
                });
            return;
        }
        //extract params
        // Validation starts//

        const { fname, lname, title, email, password } = data;

        //------------fname&lname validation------------------------//

        if (!fname) {
            return res
                .status(400)
                .send({ status: false, msg: " fname must be required !" });
        }

        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(fname)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "fname should start with Uppercase:- Fname",
                });
        }

        if (!lname) {
            return res
                .status(400)
                .send({ status: false, msg: " lname must be required !" });
        }

        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(lname)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "lname should start with Uppercase:- Lname",
                });
        }

        //----------title validation---------------------------//

        if (!title) {
            return res
                .status(400)
                .send({ status: false, msg: "Title must be required !" });
        }

        if (!/^Mr|Mrs|Miss+$/.test(title)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "Please Use Valid Title.like this: Mr/Mrs/Miss",
                });
        }

        //------------email validation------------------------//

        if (!email) {
            return res
                .status(400)
                .send({ status: false, msg: "Email should be mandatory" });
        }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide valid email" });
        }

        let emailVerify = await AuthorModel.findOne({ email: email });

        if (emailVerify) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "this email already exists please provide another email",
                });
        }

        //------------password validation------------------------//
        if (!password) {
            return res
                .status(400)
                .send({ status: false, msg: "password must be required !" });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,}$/.test(password)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "password contain at least 8 chracter like: aQ1@asd5",
                });
        }

        //validation ends

        let savedata = await AuthorModel.create(data);

        res.status(201).send({ status: true, msg: savedata });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

//=========================================loginAuthor=================================================//

const loginAuthor = async function(req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) {
            res
                .status(400)
                .send({
                    status: false,
                    msg: " in valid request parameters please provide author details",
                });
            return;
        }
        const { email, password } = data;
        if (!email) {
            return res
                .status(400)
                .send({ status: false, msg: "Email should be mandatory" });
        }
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide valid email" });
        }
        if (!password) {
            return res
                .status(400)
                .send({ status: false, msg: "password must be required !" });
        }

        let author = await AuthorModel.findOne({ email, password });

        if (!author) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "username or the password is not correct",
                });
        }

        //--------------------------------token creation-------------------------------------------------------//
        let payload = {
            authorId: author._id.toString(),
            group: "project1",
            organisation: "group46",
        };

        let token = jwt.sign({ payload }, "project1-secrete-key");

        res.setHeader("x-api-key", token);

        res.status(201).send({ status: true, data: token });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

module.exports = { createAuthor, loginAuthor };