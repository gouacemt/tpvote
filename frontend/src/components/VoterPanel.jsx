function VoterPanel({ candidates, vote, hasVoted, votingOpen, loading }) {
  return (
    <div>
      <h2>Panel Électeur</h2>

      {!votingOpen && <p>Le vote n'est pas encore ouvert.</p>}

      {hasVoted && <p>Vous avez déjà voté !</p>}

      {votingOpen && !hasVoted && (
        <div>
          <h3>Choisissez un candidat :</h3>
          {candidates.map((candidate, index) => (
            <button
              key={index}
              onClick={() => vote(index)}
              disabled={loading}
            >
              {candidate.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default VoterPanel;