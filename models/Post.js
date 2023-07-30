import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        // Types.ObjectId not Type.ObjectId !!
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
    },

    tags: {
        type: Array,
        default: []
    },

    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    }
},
    {
        timestamps: true
    }
)

const Post = mongoose.model('Post', postSchema)
export default Post