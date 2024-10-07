import { Alchemy, Network } from "alchemy-sdk"; // Import Alchemy SDK and network
import { EXCHANGE_CONTRACT_ABI } from "./constants"; // Import the contract ABI and address
import { ethers } from "ethers"; // Import ethers for transaction signing

// Initialize the Alchemy SDK
const alchemy = new Alchemy({
  apiKey: "YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy API Key
  network: Network.ETH_SEPOLIA, // Use Sepolia Testnet or appropriate network
});

// Simulate and execute the removal of liquidity tokens from the pool
export const removeLiquidity = async (
  removeLPTokensWei,
  account,
  exchangeAddress
) => {
  try {
    // Encode the function call to remove liquidity
    const iface = new ethers.utils.Interface(EXCHANGE_CONTRACT_ABI);
    const data = iface.encodeFunctionData("removeLiquidity", [
      removeLPTokensWei,
    ]);

    // Send the transaction using Alchemy
    const tx = await alchemy.core.sendTransaction({
      to: exchangeAddress,
      data,
      from: account, // The user's wallet address
    });

    // Wait for transaction to be mined
    const receipt = await alchemy.core.waitForTransaction(tx.hash);
    console.log(`RemoveLiquidity Tx is: ${tx.hash}`);
    return receipt;
  } catch (err) {
    console.error("Error removing liquidity:", err);
    return null;
  }
};

// Calculate the amounts of Ether and tokens after removing liquidity
export const getTokensAfterRemove = async (
  removeLPTokenWei,
  ethReserve,
  tokenReserve,
  exchangeAddress
) => {
  try {
    // Get the total supply of liquidity tokens in the pool
    const totalSupplyData = await alchemy.core.callContract({
      to: exchangeAddress,
      data: alchemy.utils.encodeFunctionCall(
        {
          name: "totalSupply",
          type: "function",
          inputs: [],
        },
        []
      ),
    });
    const totalSupply = BigInt(totalSupplyData);

    // Calculate the amount of Ether to be received after removing liquidity
    const removeEther = (ethReserve * removeLPTokenWei) / totalSupply;

    // Calculate the amount of tokens to be received after removing liquidity
    const removeToken = (tokenReserve * removeLPTokenWei) / totalSupply;

    // Return the calculated amounts of Ether and tokens
    return {
      removeEther,
      removeToken,
    };
  } catch (err) {
    console.error("Error fetching tokens after remove:", err);
    return { removeEther: BigInt(0), removeToken: BigInt(0) };
  }
};
