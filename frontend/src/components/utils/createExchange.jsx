import { Alchemy, Network } from "alchemy-sdk"; // Import Alchemy SDK and network
import { FACTORY_CONTRACT_ABI, FACTORY_CONTRACT_ADDRESS } from "./constants"; // Import contract ABIs and addresses
import { ethers } from "ethers"; // Import ethers for transaction signing

// Initialize the Alchemy SDK
const alchemy = new Alchemy({
  apiKey: "YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy API Key
  network: Network.ETH_SEPOLIA, // Use Sepolia Testnet or appropriate network
});

// Function to create a new exchange contract for a token
export const createNewExchange = async (tokenAddress, account) => {
  try {
    // Create the function data for createNewExchange
    const iface = new ethers.utils.Interface(FACTORY_CONTRACT_ABI);
    const data = iface.encodeFunctionData("createNewExchange", [tokenAddress]);

    // Send the transaction to create the new exchange
    const tx = await alchemy.core.sendTransaction({
      to: FACTORY_CONTRACT_ADDRESS,
      data,
      from: account,
    });

    // Wait for transaction to be mined
    await alchemy.core.waitForTransaction(tx.hash);
    console.log(`createNewExchange Tx is: ${tx.hash}`);
  } catch (err) {
    console.error("Error creating new exchange:", err);
  }
};
