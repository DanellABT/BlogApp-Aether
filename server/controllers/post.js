const Post = require('../models/Post');

// 1. Create Post
module.exports.createPost = async (req, res) => {
    try {
        let newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id
        });
        const savedPost = await newPost.save();
        res.status(201).send({ message: "Post created", post: savedPost });
    } catch (err) {
        res.status(500).send({ error: "Failed to create post", details: err.message });
    }
};

// 2. Get All Posts (Populates Author data)
module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'username')
            .populate('comments.author', 'username')
            .sort({ creationDate: -1 }); // Newest first like
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch posts" });
    }
};

// 3. Get Single Post
module.exports.getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.author', 'username');
        if (!post) return res.status(404).send({ message: "Post not found" });
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send({ error: "Error fetching post" });
    }
};

// 4. Update Post (ONLY if user created it)
module.exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        // Authorization Check: Is this user the author?
        if (post.author.toString() !== req.user.id) {
            return res.status(403).send({ message: "Forbidden: You can only edit your own posts" });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        const updatedPost = await post.save();
        
        res.status(200).send({ message: "Post updated", post: updatedPost });
    } catch (err) {
        res.status(500).send({ error: "Failed to update post" });
    }
};

// 5. Delete Post (ONLY if user created it OR user is Admin)
module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        // Authorization Check: Author OR Admin
        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: "Forbidden: You are not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to delete post" });
    }
};

// 6. Add Comment to Post
module.exports.addComment = async (req, res) => {
    try {
        const newComment = {
            text: req.body.text,
            author: req.user.id
        };
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: newComment } },
            { new: true }
        ).populate('comments.author', 'username');

        if (!updatedPost) return res.status(404).send({ message: "Post not found" });
        res.status(200).send({ message: "Comment added", post: updatedPost });
    } catch (err) {
        res.status(500).send({ error: "Failed to add comment" });
    }
};

// Toggle Like
module.exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id); // Unlike
        } else {
            post.likes.push(req.user.id); // Like
        }
        await post.save();
        res.status(200).send({ message: "Like updated", likes: post.likes });
    } catch (err) { res.status(500).send({ error: "Like failed" }); }
};

// Get 'Following' Feed
module.exports.getFollowingPosts = async (req, res) => {
    try {
        const User = require('../models/User');
        const currentUser = await User.findById(req.user.id);
        const posts = await Post.find({ author: { $in: currentUser.following } })
            .populate('author', 'username')
            .sort({ creationDate: -1 });
        res.status(200).send(posts);
    } catch (err) { res.status(500).send({ error: "Failed to load feed" }); }
};