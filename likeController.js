const db = require('../config/db');

exports.toggleLike = async (req, res) => {
    const { post_id } = req.body;
    const userId = req.user.id;

    if (!post_id) {
        return res.status(400).json({ message: 'Post ID is required.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
            [post_id, userId]
        );

        if (existing.length > 0) {
            await db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [post_id, userId]);
            return res.json({ message: 'Post unliked.', liked: false });
        } else {
            await db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [post_id, userId]);
            return res.json({ message: 'Post liked.', liked: true });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to update like state.', error: err.message });
    }
};