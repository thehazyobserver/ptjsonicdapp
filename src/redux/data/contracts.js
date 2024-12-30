// src/redux/data/contracts.js
import erc721Abi from '../blockchain/abis/erc721Abi.json'; // Ensure the ABI file is correctly imported

// Pass The Joint Smart Contract Configuration
export const PassTheJointContract = {
  abi: erc721Abi,
  address: process.env.REACT_APP_CONTRACT_ADDRESS || "", // Dynamically set the address via environment variables
};

// Example: Add more contracts if needed
// export const AnotherContract = {
//   abi: anotherAbi,
//   address: process.env.REACT_APP_ANOTHER_CONTRACT_ADDRESS || "",
// };

// Export all contracts as an object for scalability
const Contracts = {
  PassTheJoint: PassTheJointContract,
  // Add additional contracts here
};

export default Contracts;
