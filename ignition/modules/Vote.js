import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VoteModule", (m) => {
  const vote = m.contract("Vote");
  return { vote };
});