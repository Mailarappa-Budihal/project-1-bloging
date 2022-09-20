const BlogsModel = require("../Models/BlogsModel");
const AuthorModel = require("../Models/AuthorModel");
const { default: mongoose } = require("mongoose");

const isValid = function(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "String " && value.trim().length === 0) return false;
    return true;
};

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

//==================================================createBlog==========================================//

const createBlog = async function(req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                msg: " Please provide the author details",
            });
        }
        const { title, body, authorId, tags, category, subcategory } = data;

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the title" });
        }
        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(title)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "please provide title in Alphabets",
                });
        }

        if (!isValid(body)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the body" });
        }
        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(body)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "please provide the body in alphabets",
                });
        }

        if (!isValid(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the authorId" });
        }

        if (!isValidObjectId(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${authorId}  authorId is not valid` });
        }

        if (!isValid(tags)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the tags" });
        }
        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(tags)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "please provide tags in alphabets only",
                });
        }

        if (!isValid(category)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the category" });
        }
        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(category)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "please provide the category in alphabets",
                });
        }
        if (!isValid(subcategory)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the category" });
        }
        if (!/^[A-Z][a-z]{0,20}[A-Za-z]$/.test(subcategory)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "please provide subcategory in Alphabets",
                });
        }
        let authorid = await AuthorModel.findById({ _id: authorId });

        if (!authorid) {
            return res
                .status(400)
                .send({ status: false, msg: "this authorId is not valid " });
        }

        let savedata = await BlogsModel.create(data);

        res.status(201).send({ status: true, msg: savedata });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};
//=================================================getblog==================================================//
const getBlog = async function(req, res) {
    try {
        const Query = req.query;
        if (Object.keys(Query).length == 0) {
            let blogs = await BlogsModel.find({
                isDeleted: false,
                isPublished: true,
            });
            return res.status(200).send({ status: true, data: blogs });
        }

        let { authorId, tags, category, subcategory } = Query;

        let Obj = { isDeleted: false };

        if (authorId) {
            Obj.authorId = authorId;
        }
        if (category) {
            Obj.category = category;
        }
        if (tags) {
            Obj.tags = tags;
        }

        if (subcategory) {
            Obj.subcategory = subcategory;
        }

        let blogDoc = await BlogsModel.find(Obj);
        if (!blogDoc) {
            return res
                .status(404)
                .send({ status: false, msg: "blogdoc are not found" });
        } else {
            res.status(200).send({ status: true, msg: "data fetched successfully", data: blogDoc });
        }
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};
//=================================================putblog==========================================//

const updateBlog = async function(req, res) {
    try {
        let blogId = req.params.blogId;
        let data = req.body;
        if (!isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${blogId} blogId  is not valid` });
        }
        if (Object.keys(data).length == 0) {
            res.status(400).send({
                status: false,
                msg: "please provide the details to be updated",
            });
            return;
        }

        const { title, body, tags, subcategory } = data;
        if (!title) return res.status(400).send({ status: false, msg: "please provide title" })

        if (!body) return res.status(400).send({ status: false, msg: "please provide body" })

        if (!tags) return res.status(400).send({ status: false, msg: "please provide tags" })

        if (!subcategory) return res.status(400).send({ status: false, msg: "please provide title" })

        const dataBlog = await BlogsModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, {
            $set: {
                title: title,
                body: body,
                isPublished: true,
                publishedAt: Date.now(),
            },
            $push: { tags: tags, subcategory: subcategory },
        }, { new: true });
        if (!dataBlog)
            return res
                .status(404)
                .send({ status: false, msg: "dataBlog is not exist" });

        res.status(200).send({
            status: true,
            msg: "Document Updated Successfully",
            data: dataBlog,
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error });
    }
};

//======================================================deletedblog==================================//

const deleteBlogs = async function(req, res) {
    try {
        let blogId = req.params.blogId;
        if (!isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${blogId} blogId  is not valid` });
        }
        let RemovedBlogs = await BlogsModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        if (!RemovedBlogs) {
            return res
                .status(404)
                .send({ status: false, msg: "document not found or already deleted" });
        }
        res.status(200).send({ status: true, msg: "Blog deleted succesfully", data: RemovedBlogs });
    } catch (error) {
        res.status(500).send({ status: false, msg: error });
    }
};

//=====================================================deletebyquery======================================//
const deleteByquery = async function(req, res) {
    try {
        let data = req.query;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                msg: " please provide the query",
            });

        }

        let { authorId, tags, category, subcategory, isPublished } = data;

        Obj = { isDeleted: false };
        if (!isValidObjectId(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${authorId}  authorId is not valid` });
        }
        if (authorId) {
            Obj.authorId = authorId;
        }

        if (category) {
            Obj.category = category;
        }

        if (tags) {
            Obj.tags = tags;
        }

        if (subcategory) {
            Obj.subcategory = subcategory;
        }

        if (isPublished) {
            obj.isPublished = isPublished;
        }

        let blogDoc = await BlogsModel.findOneAndUpdate(
            Obj, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true }
        );

        if (!blogDoc) {
            return res
                .status(404)
                .send({ status: false, msg: "blogdoc are not found" });
        } else {
            res.status(200).send({ status: true, msg: "blogs deleted by query", data: blogDoc });
        }
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

module.exports = {
    getBlog,
    updateBlog,
    createBlog,
    deleteBlogs,
    deleteByquery,
};