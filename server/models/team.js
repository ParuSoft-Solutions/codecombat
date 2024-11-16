const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
  status: { type: String, default: 'Waiting' }, // Waiting, Active
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
