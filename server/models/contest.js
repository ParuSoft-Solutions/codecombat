const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teams: [
    {
      teamName: { type: String },
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      status: { type: String, default: 'Waiting' }, // Status can be 'Waiting', 'InProgress', 'Completed'
      score: { type: Number, default: 0 },  // Track score for leaderboard
    },
  ],
  startTime: { type: Date },
  endTime: { type: Date },
  winningTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },  // Refers to the winning team
  status: { type: String, default: 'Waiting' },  // Contest status
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
