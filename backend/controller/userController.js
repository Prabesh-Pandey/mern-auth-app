
module.exports.profile = (req, res) => {
    return res.json({
        message: 'User profile fetched successfully',
        user: req.user,
    });
};
