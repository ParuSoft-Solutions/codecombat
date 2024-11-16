const Team = require('../models/team');
const Contest = require('../models/contest');

// Create a new team and associate it with a contest
exports.createTeam = async (req, res) => {
  try {
    const { teamName, contestId, members } = req.body;

    // Check if the contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Validate team size
    if (members.length < 1 || members.length > 4) {
      return res.status(400).json({ message: 'Team size should be between 1 and 4 members' });
    }

    // Create a new team
    const team = new Team({
      teamName,
      contest: contestId,
      members,
    });

    await team.save();

    // Add team to the contest's teams list
    contest.teams.push({
      teamName: team.teamName,
      members: team.members,
      status: 'Waiting',
    });
    await contest.save();

    res.status(201).json({
      message: 'Team created successfully and added to the contest',
      team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating team', error });
  }
};

// Get all teams for a specific contest
exports.getTeamsByContest = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Fetch the contest with its teams populated
    const contest = await Contest.findById(contestId).populate('teams.members');
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json(contest.teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching teams for contest', error });
  }
};

// Get a specific team by its ID
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching team', error });
  }
};

// Update team status or score (e.g., during a contest)
exports.updateTeamStatus = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { status, score } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (status) team.status = status;
    if (score !== undefined) team.score = score;

    await team.save();

    res.status(200).json({ message: 'Team updated successfully', team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating team', error });
  }
};

// Delete a team from a contest
exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove the team from its associated contest
    const contest = await Contest.findById(team.contest);
    if (contest) {
      contest.teams = contest.teams.filter(
        (t) => String(t._id) !== String(team._id)
      );
      await contest.save();
    }

    await team.remove();

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting team', error });
  }
};
