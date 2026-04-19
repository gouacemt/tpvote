import { useVoting } from "./hooks/useVoting";
import ConnectWallet from "./components/ConnectWallet";
import StatusBanner from "./components/StatusBanner";
import AdminPanel from "./components/AdminPanel";
import VoterPanel from "./components/VoterPanel";
import ResultsPanel from "./components/ResultsPanel";

function App() {
  const {
    account,
    isAdmin,
    isVoter,
    hasVoted,
    votingOpen,
    candidates,
    loading,
    connectWallet,
    openVoting,
    addVoter,
    vote,
  } = useVoting();

  return (
    <div>
      <h1>🗳️ Application de Vote</h1>

      <ConnectWallet account={account} connectWallet={connectWallet} />

      {account && (
        <>
          <StatusBanner votingOpen={votingOpen} />

          {isAdmin && (
            <AdminPanel
              openVoting={openVoting}
              addVoter={addVoter}
              votingOpen={votingOpen}
              loading={loading}
            />
          )}

          {isVoter && (
            <VoterPanel
              candidates={candidates}
              vote={vote}
              hasVoted={hasVoted}
              votingOpen={votingOpen}
              loading={loading}
            />
          )}

          <ResultsPanel candidates={candidates} />
        </>
      )}
    </div>
  );
}

export default App;