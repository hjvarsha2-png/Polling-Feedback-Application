const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const authMiddleware = require('../middleware/authMiddleware');

// Optional auth for getPoll (to check if user has voted)
const optionalAuth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return next();
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        next();
    }
};

router.post('/', authMiddleware, pollController.createPoll);
router.get('/', pollController.getPolls);
router.get('/:id', optionalAuth, pollController.getPoll);
router.post('/:id/vote', authMiddleware, pollController.vote);
router.put('/:id/close', authMiddleware, pollController.closePoll);
router.delete('/:id', authMiddleware, pollController.deletePoll);

module.exports = router;
