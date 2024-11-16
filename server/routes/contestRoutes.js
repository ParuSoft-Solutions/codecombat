const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// Route to create a new contest
router.post('/create', contestController.createContest);

// Route to join a contest
router.post('/join', contestController.joinContest);

// Route to get details of a contest
router.get('/:contestId', contestController.getContestDetails);

// Route to update the contest status (e.g., mark as completed and determine winner)
router.post('/update-status', contestController.updateContestStatus);

// Route to get all contests
router.get('/', contestController.getAllContests);

// Route to get leaderboard
router.get('/leaderboard', contestController.getLeaderboard);

// Route to end a contest and update team/user statistics
router.post('/end-contest', contestController.endContest);

module.exports = router;
