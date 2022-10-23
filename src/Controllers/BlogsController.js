const BlogsModel = require("../Models/BlogsModel");
const AuthorModel = require("../Models/AuthorModel");
const mongoose = require("mongoose");
const {
    isValid,
    isValidRequestBody,
    isBoolean
} = require("../validator/validator");

//==================================================createBlog==========================================//

const createBlog = async function(req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({
                status: false,
                msg: " Please provide the Blog details",
            });
        }
        const { title, body, authorId, tags, category, subcategory } = data;

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the title" });
        }

        if (!isValid(body)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the body" });
        }

        if (!isValid(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the authorId" });
        }

        if (!mongoose.isValidObjectId(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${authorId}  authorId is not valid` });
        }

        if (!isValid(tags)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the tags" });
        }

        if (!isValid(category)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the category" });
        }

        if (!isValid(subcategory)) {
            return res
                .status(400)
                .send({ status: false, msg: "please provide the category" });
        }

        let author = await AuthorModel.findById({ _id: authorId });
        if (!author) {
            return res
                .status(404)
                .send({ status: false, msg: "The author is not found " });
        }

        let savedata = await BlogsModel.create(data);

        return res.status(201).send({
            status: true,
            msg: "Blog created Successfully",
            data: savedata,
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};
//=================================================getblog==================================================//

const getBlogs = async function(req, res) {
    try {
        let data = req.query;
        let { authorId, tags, category, subcategory } = data;
        let filterQuery = { isDeleted: false };

        if (Object.keys(data).length > 0) {
            if (authorId && authorId.trim() !== "") {
                if (!mongoose.isValidObjectId(authorId))
                    return res.status(400).send({
                        status: false,
                        msg: "authorId is not valid it should be of 24 digits",
                    });
                let author = await AuthorModel.findById({ _id: authorId });
                if (!author) {
                    return res
                        .status(404)
                        .send({ status: false, msg: "The author is not found " });
                }
                filterQuery.authorId = authorId.trim();
            }
            if (category && category.trim() !== "") {
                filterQuery.category = category.trim();
            }
            if (subcategory && subcategory.trim() !== "") {
                filterQuery.subcategory = subcategory.trim();
            }
            if (tags && tags.trim() !== "") {
                filterQuery.tags = tags.trim();
            }
            const result = await BlogsModel
                .find(filterQuery)
                .select({
                    deletedAt: 0,
                    publishedAt: 0
                })
            if (result.length === 0)
                return res
                    .status(404)
                    .send({ status: false, msg: "No books found for applied filter" });

            return res
                .status(200)
                .send({ status: true, message: `blogs list  ${result.length}`, data: result });
        } else {
            let result = await BlogsModel
                .find({ isDeleted: false })
                .select({
                    deletedAt: 0,
                    publishedAt: 0
                })
            if (result.length === 0)
                return res.status(404).send({ status: false, msg: "no books found" });

            return res
                .status(200)
                .send({ status: true, message: `Total blogs list  ${result.length}`, data: result });
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};
//=================================================putblog==========================================//

const updateBlog = async function(req, res) {
    try {
        let blogId = req.params.blogId;
        let data = req.body;
        if (!mongoose.isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${blogId} blogId  is not valid` });
        }
        const existigblog = await BlogsModel.findOne({ _id: blogId });
        if (!existigblog) {
            return res.status(404).send({
                status: false,
                msg: "The blog not found",
            });
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({
                status: false,
                msg: "please provide the details to be updated",
            });
        }

        const { title, body, tags, subcategory } = data;
        if (title) {
            if (!isValid(title)) {
                return res
                    .status(400)
                    .send({ status: false, msg: "please provide the title" });
            }
        }

        if (body) {
            if (!isValid(body)) {
                return res
                    .status(400)
                    .send({ status: false, msg: "please provide the body" });
            }
        }

        if (tags) {
            if (!isValid(tags)) {
                return res
                    .status(400)
                    .send({ status: false, msg: "please provide the tags" });
            }
        }

        if (subcategory) {
            if (!isValid(subcategory)) {
                return res
                    .status(400)
                    .send({ status: false, msg: "please provide the subcategory" });
            }
        }
        const UpdateBlogs = await BlogsModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, {
            $set: { title: title, body: body, isPublished: true, publishedAt: Date.now() },
            $push: { tags: tags, subcategory: subcategory }
        }, { new: true })
        return res.status(200).send({
            status: true,
            message: "Blog Updated successfully",
            data: UpdateBlogs,
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

//======================================================deletedblog==================================//

const deleteBlogs = async function(req, res) {
    try {
        let blogId = req.params.blogId;
        if (!mongoose.isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, msg: `the ${blogId} blogId  is not valid` });
        }
        const existigblog = await BlogsModel.findOne({
            _id: blogId,
            isDeleted: true,
        });
        if (existigblog) {
            return res.status(404).send({
                status: false,
                msg: "The blog not found",
            });
        }
        let RemovedBlogs = await BlogsModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true }); {
            return res.status(200).send({
                status: true,
                msg: "Blog deleted succesfully",
                data: RemovedBlogs,
            });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

//=====================================================deletebyquery======================================//
const deleteByquery = async function(req, res) {
    try {
        let data = req.query;
        let { authorId, tags, category, subcategory, isPublished } = data;
        let filterQuery = { isDeleted: false };
        if (Object.keys(data).length > 0) {
            if (authorId && authorId.trim() !== "") {
                if (!mongoose.isValidObjectId(authorId))
                    return res.status(400).send({
                        status: false,
                        msg: "authorId is not valid it should be of 24 digits",
                    });
                let author = await AuthorModel.findById({ _id: authorId });
                if (!author) {
                    return res
                        .status(404)
                        .send({ status: false, msg: "The author is not found " });
                }
                filterQuery.authorId = authorId.trim();
            }

            if (category && category.trim() !== "") {
                filterQuery.category = category.trim();
            }
            if (subcategory && subcategory.trim() !== "") {
                filterQuery.subcategory = subcategory.trim();
            }
            if (tags && tags.trim() !== "") {
                filterQuery.tags = tags.trim();
            }
            if (isPublished) {
                if (!isBoolean(isPublished)) {
                    return res.status(400).send({ status: false, message: "please provide isPublished Boolean " })
                }
            }
            const result = await BlogsModel
                .findOneAndUpdate(filterQuery, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
            if (!result) return res.status(400).send({ status: false, message: "the blogs are already deleted" })
            return res
                .status(200)
                .send({ status: true, message: `blogs list `, data: result })
        } else {
            if (Object.keys(data).length == 0) {
                return res.status(400).send({ status: false, message: "please provide query to delete" })
            }
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


module.exports = {
    getBlogs,
    updateBlog,
    createBlog,
    deleteBlogs,
    deleteByquery,
};