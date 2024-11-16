import React, { useState } from 'react';
import socket from 'socket.io-client'

const ContestCreation = () => {
  const [contestName, setContestName] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [contestId, setContestId] = useState('');

  const handleCreateContest = () => {
    // Generate a fake contest ID for demonstration
    const generatedContestId = `contest-${Math.random().toString(36).substr(2, 6)}`;

    // Emit the 'createContest' event to the server
    socket.emit('createContest', {
      contestId: generatedContestId,
      contestName,
      description,
      maxTeamSize,
    });

    // Update the UI
    setContestId(generatedContestId);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Create Contest</h1>
      <div>
        <label>Contest Name:</label>
        <input
          type="text"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        ></textarea>
      </div>
      {/* <div>
        <label>Max Team Size:</label>
        <input
          type="number"
          value={maxTeamSize}
          onChange={(e) => setMaxTeamSize(Number(e.target.value))}
          className="border rounded w-full p-2 mb-4"
        />
      </div> */}
      <button
        onClick={handleCreateContest}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Create Contest
      </button>
      {contestId && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 border rounded">
          <p>Contest Created! Share this ID: {contestId}</p>
        </div>
      )}
    </div>
  );
};

export default ContestCreation;
