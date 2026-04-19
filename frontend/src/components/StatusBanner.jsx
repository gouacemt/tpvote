function StatusBanner({ votingOpen }) {
  return (
    <div>
      <h2>État du vote</h2>
      {votingOpen ? (
        <p> Vote ouvert</p>
      ) : (
        <p> Vote fermé</p>
      )}
    </div>
  );
}

export default StatusBanner;