const db = require('../config/db');

exports.getFeed = async (req, res) => {
    const currentUserId = req.user.id;

    try {
        const [posts] = await db.query(
            `SELECT p.*, u.name AS author_name, u.profile_image AS author_image,
                (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likesCount,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS commentsCount,
                EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS isLiked
             FROM posts p
             JOIN users u ON p.user_id = u.id
             ORDER BY p.created_at DESC`,
            [currentUserId]
        );
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load feed.', error: err.message });
    }
};

exports.createPost = async (req, res) => {
    const { content, image } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)',
            [userId, content, image || null]
        );
        res.status(201).json({ message: 'Post published!', postId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create post.', error: err.message });
    }
};

exports.getUserPosts = async (req, res) => {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    try {
        const [posts] = await db.query(
            `SELECT p.*, u.name AS author_name, u.profile_image AS author_image,
                (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likesCount,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS commentsCount,
                EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS isLiked
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [currentUserId, userId]
        );
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user posts.', error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { content, image } = req.body;
    const userId = req.user.id;

    try {
        const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) return res.status(404).json({ message: 'Post not found.' });

        if (posts[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post.' });
        }

        await db.query('UPDATE posts SET content = ?, image = ? WHERE id = ?', [content, image, postId]);
        res.json({ message: 'Post updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update post.', error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) return res.status(404).json({ message: 'Post not found.' });

        if (posts[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post.' });
        }

        await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ message: 'Post deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete post.', error: err.message });
    }
};