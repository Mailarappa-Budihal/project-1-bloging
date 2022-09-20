const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        trim: true,
        required: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: { type: String, trim: true, required: true },


}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)