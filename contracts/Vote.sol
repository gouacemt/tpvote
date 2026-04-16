// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {

    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isVoter;

    bool public votingOpen;
    
    event VoterAdded(address voter);
    event VotingOpened();
    event VotingClosed();
    event Voted(address voter, uint candidateIndex);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate(_name, 0));
    }

    function addVoter(address _voter) public onlyOwner {
        require(!isVoter[_voter], "Voter already registered");
        isVoter[_voter] = true;
        emit VoterAdded(_voter);
    }

    modifier onlyVoter() {
        require(isVoter[msg.sender], "Not authorized");
        _;
    }
    modifier votingIsOpen() {
        require(votingOpen, "Voting closed");
        _;
    }

    function vote(uint _candidateIndex) public onlyVoter {    
        require(!hasVoted[msg.sender], "You already voted");

        hasVoted[msg.sender] = true;
        candidates[_candidateIndex].voteCount++;
        emit Voted(msg.sender, _candidateIndex);
    }

    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }

    function openVoting() public onlyOwner {
        votingOpen = true;
        emit VotingOpened();
    }

    function closeVoting() public onlyOwner {
        votingOpen = false;
        emit VotingClosed();
    }

    function getWinner() public view returns (uint) {
    uint winnerIndex = 0;

    for (uint i = 1; i < candidates.length; i++) {
        if (candidates[i].voteCount > candidates[winnerIndex].voteCount) {
            winnerIndex = i;
        }
    }

    return winnerIndex;
    }

}