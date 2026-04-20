import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

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

  // Connexion MetaMask
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Installe MetaMask !");
      return;
    }

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
    const admin = await _contract.admin();
    const _votingOpen = await _contract.votingOpen();
    const _isVoter = await _contract.isVoter(_account);
    const _hasVoted = await _contract.hasVoted(_account);
    const count = await _contract.getCandidatesCount();

    setIsAdmin(admin.toLowerCase() === _account.toLowerCase());
    setVotingOpen(_votingOpen);
    setIsVoter(_isVoter);
    setHasVoted(_hasVoted);

    const _candidates = [];
    for (let i = 0; i < count; i++) {
      const c = await _contract.candidates(i);
      _candidates.push({ name: c.name, voteCount: c.voteCount.toString() });
    }
    setCandidates(_candidates);
  }

  async function openVoting() {
    setLoading(true);
    await contract.openVoting();
    setVotingOpen(true);
    setLoading(false);
  }

  async function addVoter(address) {
    setLoading(true);
    await contract.addVoter(address);
    setLoading(false);
  }

  async function vote(index) {
    setLoading(true);
    await contract.vote(index);
    setHasVoted(true);
    await loadData(contract, account);
    setLoading(false);
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