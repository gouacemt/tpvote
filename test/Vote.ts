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