function ResultsPanel({ candidates }) {
  return (
    <div>
      <h2>Résultats en temps réel</h2>

      {candidates.length === 0 ? (
        <p>Aucun candidat pour le moment.</p>
      ) : (
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              {candidate.name} — {candidate.voteCount} vote(s)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResultsPanel;