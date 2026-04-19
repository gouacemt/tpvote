function ConnectWallet({ account, connectWallet }) {
  return (
    <div>
      {account ? (
        <p> Connecté : {account}</p>
      ) : (
        <button onClick={connectWallet}>
          Se connecter avec MetaMask
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;