import { expect } from "chai";
import { network } from "hardhat";

// Fixture de déploiement
async function deployVoteFixture() {
  const { ethers } = await network.connect();
  const [admin, voter1, voter2] = await ethers.getSigners();

  const VoteFactory = await ethers.getContractFactory("Vote");
  const vote = await VoteFactory.deploy();
  await vote.waitForDeployment();

  await vote.addCandidate("Alice");
  await vote.addCandidate("Bob");

  return { vote, admin, voter1, voter2 };
}

describe("Vote", function () {

  describe("Déploiement", function () {

    it("Les candidats sont-ils initialisés ?", async function () {
      const { vote } = await deployVoteFixture();
      const count = await vote.getCandidatesCount();
      expect(count).to.equal(2n);
    });

    it("Ont-ils tous 0 vote au départ ?", async function () {
      const { vote } = await deployVoteFixture();
      const count = await vote.getCandidatesCount();
      for (let i = 0n; i < count; i++) {
        const candidate = await vote.candidates(i);
        expect(candidate.voteCount).to.equal(0n);
      }
    });

    it("Le owner est-il bien défini ?", async function () {
      const { vote, admin } = await deployVoteFixture();
      expect(await vote.admin()).to.equal(admin.address);
    });

  });
});

describe("Gestion des électeurs", function () {

  it("L'admin peut ajouter un électeur", async function () {
    const { vote, voter1 } = await deployVoteFixture();

    await expect(vote.addVoter(voter1.address))
      .to.emit(vote, "VoterAdded")
      .withArgs(voter1.address);

    expect(await vote.isVoter(voter1.address)).to.equal(true);
  });

  it("Un non-admin ne peut PAS ajouter un électeur", async function () {
    const { vote, voter1, voter2 } = await deployVoteFixture();

    await expect(
      vote.connect(voter1).addVoter(voter2.address)
    ).to.be.revertedWith("Not admin");
  });

  it("Impossible d'ajouter deux fois le même électeur", async function () {
    const { vote, voter1 } = await deployVoteFixture();

    await vote.addVoter(voter1.address);

    await expect(
      vote.addVoter(voter1.address)
    ).to.be.revertedWith("Voter already registered");
  });

  describe("Ouverture du vote", function () {

    it("L'admin peut ouvrir le vote", async function () {
      const { vote } = await deployVoteFixture();

      await expect(vote.openVoting())
        .to.emit(vote, "VotingOpened");

      expect(await vote.votingOpen()).to.equal(true);
    });

    it("Un non-admin ne peut PAS ouvrir le vote", async function () {
      const { vote, voter1 } = await deployVoteFixture();

      await expect(
        vote.connect(voter1).openVoting()
      ).to.be.revertedWith("Not admin");
    });

  });
});

describe("Tests de vote", function () {

  it("Un électeur autorisé peut voter", async function () {
    const { vote, voter1 } = await deployVoteFixture();

    await vote.openVoting();
    await vote.addVoter(voter1.address);

    await expect(vote.connect(voter1).vote(0))
      .to.emit(vote, "Voted")
      .withArgs(voter1.address, 0n);

    const candidate = await vote.candidates(0);
    expect(candidate.voteCount).to.equal(1n);

    expect(await vote.hasVoted(voter1.address)).to.equal(true);
  });

  it("Un électeur ne peut voter qu'une seule fois", async function () {
    const { vote, voter1 } = await deployVoteFixture();

    await vote.openVoting();
    await vote.addVoter(voter1.address);

    await vote.connect(voter1).vote(0);

    await expect(
      vote.connect(voter1).vote(0)
    ).to.be.revertedWith("You already voted");
  });

  it("Un non-électeur ne peut PAS voter", async function () {
    const { vote, voter2 } = await deployVoteFixture();

    await vote.openVoting();

    await expect(
      vote.connect(voter2).vote(0)
    ).to.be.revertedWith("Not authorized");
  });

  it("Impossible de voter si le vote est fermé", async function () {
    const { vote, voter1 } = await deployVoteFixture();

    await vote.addVoter(voter1.address);

    await expect(
      vote.connect(voter1).vote(0)
    ).to.be.revertedWith("Voting closed");
  });
});