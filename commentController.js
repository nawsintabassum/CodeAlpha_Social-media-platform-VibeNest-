const db = require('../config/db');

exports.addComment = async (req, res) => {
    const { post_id, comment } = req.body;
    const userId = req.user.id;

    if (!post_id || !comment) {
        return res.status(400).json({ message: 'Comment content is required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
            [post_id, userId, comment]
        );
        res.status(201).json({ message: 'Comment added.', commentId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add comment.', error: err.message });
    }
};

exports.getPostComments = async (req, res) => {
    const postId = req.params.postId;

    try {
        const [comments] = await db.query(
            `SELECT c.*, u.name AS author_name, u.profile_image AS author_image 
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.created_at ASC`,
            [postId]
        );
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load comments.', error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        const [comments] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);
        if (comments.length === 0) return res.status(404).json({ message: 'Comment not found.' });

        if (comments[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ message: 'Comment deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete comment.', error: err.message });
    }
};