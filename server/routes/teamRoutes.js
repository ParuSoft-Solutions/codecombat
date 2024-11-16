const express = require('express');
const router = express.Router();
const { createTeam, getTeamsByContest } = require('../controllers/teamController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/create', isAuthenticated, createTeam);  // Create team
router.get('/:contestId', getTeamsByContest);  // Get teams by contest

module.exports = router;
