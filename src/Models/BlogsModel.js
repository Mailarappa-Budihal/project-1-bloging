const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "author"
    },
    tags: {
        type: [String],
        trim: true
    },
    category: {
        type: [String],
        required: true,
        trim: true
    },
    subcategory: { type: [String] },
    deletedAt: { type: Date, default: null },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false }


}, { timestamps: true });



module.exports = mongoose.model("blog", BlogSchema)