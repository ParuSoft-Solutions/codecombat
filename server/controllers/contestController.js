const Contest = require('../models/contest');
const User = require('../models/user');

// Create a new contest
exports.createContest = async (req, res) => {
  try {
    const { name, description, creator, startTime, endTime } = req.body;

    const contest = new Contest({
      name,
      description,
      creator,
      startTime,
      endTime,
    });

    await contest.save();
    res.status(201).json({ message: 'Contest created successfully', contest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating contest' });
  }
};

// Join a contest as a team
exports.joinContest = async (req, res) => {
  try {
    const { contestId, teamName, members } = req.body;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const newTeam = {
      teamName,
      members,
      status: 'Waiting',
    };

    contest.teams.push(newTeam);
    await contest.save();

    res.status(200).json({ message: 'Team joined contest successfully', contest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error joining contest' });
  }
};

// Get details of a specific contest
exports.getContestDetails = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId).populate('teams.members');
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json(contest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contest details' });
  }
};

// Update contest status
exports.updateContestStatus = async (req, res) => {
  try {
    const { contestId, status } = req.body;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    contest.status = status;
    await contest.save();

    res.status(200).json({ message: 'Contest status updated successfully', contest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contest status' });
  }
};

// Get all contests
exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate('creator').sort({ startTime: 1 });

    res.status(200).json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contests' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const contests = await Contest.aggregate([
      { $unwind: '$teams' },
      { $sort: { 'teams.score': -1 } },
      { $project: { 'teams.teamName': 1, 'teams.score': 1 } },
    ]);

    res.status(200).json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

// End a contest and update statistics
exports.endContest = async (req, res) => {
  try {
    const { contestId } = req.body;

    const contest = await Contest.findById(contestId).populate('teams.members');
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (contest.status === 'Completed') {
      return res.status(400).json({ message: 'Contest already completed' });
    }

    let highestScore = -1;
    let winningTeam = null;

    contest.teams.forEach((team) => {
      if (team.score > highestScore) {
        highestScore = team.score;
        winningTeam = team;
      }
    });

    contest.status = 'Completed';
    contest.winningTeam = winningTeam._id;
    await contest.save();

    for (const team of contest.teams) {
      for (const member of team.members) {
        await User.findByIdAndUpdate(member._id, {
          $inc: {
            'statistics.contestsParticipated': 1,
            'statistics.contestsWon': team._id === winningTeam._id ? 1 : 0,
          },
        });
      }
    }

    res.status(200).json({
      message: 'Contest ended successfully',
      contest,
      winningTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error ending contest' });
  }
};
