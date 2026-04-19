import { useState } from "react";

function AdminPanel({ openVoting, addVoter, votingOpen, loading }) {
  const [voterAddress, setVoterAddress] = useState("");

  async function handleAddVoter() {
    if (!voterAddress) return;
    await addVoter(voterAddress);
    setVoterAddress("");
    alert("Électeur ajouté !");
  }

  return (
    <div>
      <h2>Panel Administrateur</h2>

      {/* Ouvrir le vote */}
      <button onClick={openVoting} disabled={votingOpen || loading}>
        {votingOpen ? "Vote déjà ouvert" : "Ouvrir le vote"}
      </button>

      {/* Ajouter un électeur */}
      <div>
        <h3>Ajouter un électeur</h3>
        <input
          type="text"
          placeholder="Adresse 0x..."
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button onClick={handleAddVoter} disabled={loading}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;