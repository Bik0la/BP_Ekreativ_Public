/*
Modelový předpis pro kurzy
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const courseSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    mainText: {
        type: String,
        required: true
    },

    thumbnailUrl: {
        type: String,
        ref: 'thumbnailUrl',
        required: true
    },
    categoryName: {
        type: String,
        ref: 'thumbnailUrl',
        required: true
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }


})

module.exports = mongoose.model('Course', courseSchema)