import asyncHandler from 'express-async-handler'
import Post from '../models/Post.js'

// create a post belonging to one user
const createPost = asyncHandler(
    async (req, res) => {
        const userId = req.user
        const { title, content, category, tags, isPrivate } = req.body
        // console.log(req.body, req.user)
        if (!userId || !title || !content || !category) {
            return res.status(400).json({ message: "cannot create post: missing field(s)" })
        }
        const newPost = new Post({
            author: userId,
            title,
            content,
            category,
            tags,
            isPrivate
        })
        await newPost.save()
        res.status(201).json(newPost)
    }
)



//  get user's all posts
const getAllPosts = asyncHandler(
    async (req, res) => {
        const userId = req.user
        if (!userId) return res.status(400).json({ message: "cannot retrieve posts: missing userId" })

        // // make sure the user requesting matches the url params
        // if (userId !== req.params.userId) {
        //     return res.status(403).json({ message: "forbidden: cannot view other's posts" })
        // }

        const posts = await Post.find({ author: userId })
        res.status(200).json(posts)
    }
)




const getSinglePost = asyncHandler(
    async (req, res) => {
        const userId = req.user
        const postId = req.params.postId
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(400).json({ message: "the post doesn't exist." })
        }
        // authorization
        console.log(post.author, userId)
        // convert ObjectId to string
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "forbidden: cannot view other's post" })
        }

        res.status(200).json(post)
    }
)


const editPost = asyncHandler(
    async (req, res) => {
        const userId = req.user
        const { id, title, content, category, tags, isPrivate } = req.body
        if (!userId || !id || !title || !content || !category) {
            return res.status(400).json({ message: "cannot update post: missing field(s)" })
        }

        const post = await Post.findById(id).exec()
        if (!post) {
            return res.status(400).json({ message: "the post doesn't exist." })
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "forbidden: cannot view other's post" })
        }

        post.title = title
        post.content = content
        post.category = category
        post.tags = tags
        if (post.isPrivate !== isPrivate) {
            post.isPrivate = isPrivate
        }

        await post.save()
        res.status(202).json(post)
    }
)


const deletePost = asyncHandler(
    async (req, res) => {
        const userId = req.user
        const { id } = req.body
        if (!id || !userId) return res.status(400).json({ message: "delete request failed: missing field(s) " })

        const post = await Post.findById(id).exec()

        if (!post) {
            return res.status(400).json({ message: "the post doesn't exist." })
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "forbidden: cannot delete other's post" })
        }

        const result = await post.deleteOne()
        const response = `post ‘${post.title}’ is deleted`

        res.status(200).json({ message: response })
    }
)



export { createPost, getAllPosts, editPost, deletePost, getSinglePost }