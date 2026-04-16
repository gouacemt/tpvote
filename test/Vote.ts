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

    // Vérifier l'émission de l'event
    await expect(vote.addVoter(voter1.address))
      .to.emit(vote, "VoterAdded")
      .withArgs(voter1.address);

    // Vérifier que l'adresse est bien enregistrée
    expect(await vote.isVoter(voter1.address)).to.equal(true);
  });

  it("Un non-admin ne peut PAS ajouter un électeur", async function () {
  const { vote, voter1, voter2 } = await deployVoteFixture();

  // voter1 essaie d'ajouter voter2 → doit échouer
  await expect(
    vote.connect(voter1).addVoter(voter2.address)
  ).to.be.revertedWith("Not admin");
  });

  it("Impossible d'ajouter deux fois le même électeur", async function () {
  const { vote, voter1 } = await deployVoteFixture();

  // Premier ajout → ok
  await vote.addVoter(voter1.address);

  // Deuxième ajout → doit échouer
  await expect(
    vote.addVoter(voter1.address)
  ).to.be.revertedWith("Voter already registered");
  });
});