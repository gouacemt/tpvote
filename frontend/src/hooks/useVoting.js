import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

const ALCHEMY_URL = "https://eth-sepolia.g.alchemy.com/v2/pcVrThFFoQQV6foQs4Rik";

export function useVoting() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
  if (!window.ethereum) {
    alert("Installe MetaMask !");
    return;
  }

  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0xaa36a7" }],
  });

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const _provider = new ethers.BrowserProvider(window.ethereum);
  const _signer = await _provider.getSigner();
  const _account = await _signer.getAddress();
  const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);

  setProvider(_provider);
  setSigner(_signer);
  setAccount(_account);
  setContract(_contract);

  await loadData(_contract, _account);
}

  async function loadData(_contract, _account) {
    try {
      const readProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);

      const admin = await readContract.admin();
      const _votingOpen = await readContract.votingOpen();
      const _isVoter = await readContract.isVoter(_account);
      const _hasVoted = await readContract.hasVoted(_account);
      const count = await readContract.getCandidatesCount();

      setIsAdmin(admin.toLowerCase() === _account.toLowerCase());
      setVotingOpen(_votingOpen);
      setIsVoter(_isVoter);
      setHasVoted(_hasVoted);

      const _candidates = [];
      for (let i = 0; i < count; i++) {
        const c = await readContract.candidates(i);
        _candidates.push({ name: c.name, voteCount: c.voteCount.toString() });
      }
      setCandidates(_candidates);
    } catch (error) {
      console.error("Erreur loadData:", error);
    }
  }

  async function openVoting() {
    try {
      setLoading(true);
      const tx = await contract.openVoting();
      await tx.wait();
      setVotingOpen(true);
      await loadData(contract, account);
    } catch (error) {
      console.error("Erreur openVoting:", error);
      alert("Erreur : " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  }

  async function addVoter(address) {
    try {
      setLoading(true);
      const tx = await contract.addVoter(address);
      await tx.wait();
      await loadData(contract, account);
    } catch (error) {
      console.error("Erreur addVoter:", error);
      alert("Erreur : " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  }

  async function vote(index) {
    try {
      setLoading(true);
      const tx = await contract.vote(index);
      await tx.wait();
      setHasVoted(true);
      await loadData(contract, account);
    } catch (error) {
      console.error("Erreur vote:", error);
      alert("Erreur : " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}