const db = require('../config/db');

exports.toggleFollow = async (req, res) => {
    const { following_id } = req.body;
    const followerId = req.user.id;

    if (parseInt(following_id) === parseInt(followerId)) {
        return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
            [followerId, following_id]
        );

        if (existing.length > 0) {
            await db.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, following_id]);
            return res.json({ message: 'Unfollowed successfully.', following: false });
        } else {
            await db.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, following_id]);
            return res.json({ message: 'Followed successfully.', following: true });
        }
    } catch (err) {
        res.status(500).json({ message: 'Follow state update failed.', error: err.message });
    }
};