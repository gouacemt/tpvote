function StatusBanner({ votingOpen, isAdmin, account }) {
  return (
    <div>
      {account && (
        <p>
          {isAdmin ? "Connecté en tant qu'ADMIN" : "Connecté en tant qu'utilisateur"}
        </p>
      )}
      <h2>État du vote</h2>
      {votingOpen ? (
        <p>Vote ouvert</p>
      ) : (
        <p>Vote fermé</p>
      )}
    </div>
  );
}

export default StatusBanner;