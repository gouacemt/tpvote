import { expect } from "chai";
import hre from "hardhat";

describe("Vote", function () {

  async function deployFixture() {
    const [owner, voter1, voter2, stranger] = await hre.ethers.getSigners();

    const Vote = await hre.ethers.getContractFactory("Vote");
    const vote = await Vote.deploy();

    await vote.addCandidate("Alice");
    await vote.addCandidate("Bob");
    await vote.addCandidate("Charlie");

    return { vote, owner, voter1, voter2, stranger };
  }

  describe("Déploiement", function () {

    it("Le owner est bien défini", async function () {
      const { vote, owner } = await deployFixture();
      expect(await vote.admin()).to.equal(owner.address);
    });

    it("Les candidats sont initialisés (3 candidats)", async function () {
      const { vote } = await deployFixture();
      expect(await vote.getCandidatesCount()).to.equal(3);
    });

    it("Tous les candidats ont 0 vote au départ", async function () {
      const { vote } = await deployFixture();
      for (let i = 0; i < 3; i++) {
        const candidate = await vote.candidates(i);
        expect(candidate.voteCount).to.equal(0);
      }
    });

  });

});