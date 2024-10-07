import { Alchemy, Network } from "alchemy-sdk"; // Import Alchemy SDK and network
import {
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_CONTRACT_ABI,
} from "./constants"; // Import contract ABIs and addresses
import { ethers } from "ethers"; // Import ethers for transaction signing

// Initialize the Alchemy SDK
const alchemy = new Alchemy({
  apiKey: "YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy API Key
  network: Network.ETH_SEPOLIA, // Use Sepolia Testnet or appropriate network
});

// Function to calculate the amount of tokens to be received from a swap
export const getAmountOfTokensReceivedFromSwap = async (
  ethSelected,
  swapAmountWei,
  exchangeAddress
) => {
  let amountOfTokens;

  // Check if ETH is being swapped for tokens or vice versa
  if (ethSelected) {
    // Calculate the amount of tokens to be received when swapping ETH for tokens
    const data = alchemy.utils.encodeFunctionCall(
      {
        name: "getTokenAmount",
        type: "function",
        inputs: [{ type: "uint256" }],
      },
      [swapAmountWei]
    );

    amountOfTokens = await alchemy.core.callContract({
      to: exchangeAddress,
      data,
    });
  } else {
    // Calculate the amount of ETH to be received when swapping tokens for ETH
    const data = alchemy.utils.encodeFunctionCall(
      {
        name: "getEthAmount",
        type: "function",
        inputs: [{ type: "uint256" }],
      },
      [swapAmountWei]
    );

    amountOfTokens = await alchemy.core.callContract({
      to: exchangeAddress,
      data,
    });
  }

  return BigInt(amountOfTokens);
};

// Function to perform a token swap
export const swapTokens = async (
  ethSelected,
  swapAmountWei,
  tokenToBeReceivedAfterSwap,
  account,
  exchangeAddress
) => {
  const minimumTokenToBeReceivedAfterSwap =
    (tokenToBeReceivedAfterSwap * 90n) / 100n;

  try {
    if (ethSelected) {
      // Swap ETH for tokens
      const iface = new ethers.utils.Interface(EXCHANGE_CONTRACT_ABI);
      const data = iface.encodeFunctionData("swapEthForTokens", [
        minimumTokenToBeReceivedAfterSwap,
        account,
      ]);

      const tx = await alchemy.core.sendTransaction({
        to: exchangeAddress,
        data,
        value: swapAmountWei.toString(), // Send ETH value
        from: account,
      });

      // Wait for transaction to be mined
      await alchemy.core.waitForTransaction(tx.hash);
      console.log(`Swap Tx is: ${tx.hash}`);
    } else {
      // Increase allowance for the token contract
      const iface = new ethers.utils.Interface(TOKEN_CONTRACT_ABI);
      const approveData = iface.encodeFunctionData("approve", [
        exchangeAddress,
        swapAmountWei,
      ]);

      let approveTx = await alchemy.core.sendTransaction({
        to: TOKEN_CONTRACT_ADDRESS,
        data: approveData,
        from: account,
      });

      // Wait for transaction to be mined
      await alchemy.core.waitForTransaction(approveTx.hash);
      console.log(`Approve Tx is: ${approveTx.hash}`);

      // Swap tokens for ETH
      const swapData = iface.encodeFunctionData("tokenForEthSwap", [
        swapAmountWei,
        minimumTokenToBeReceivedAfterSwap,
      ]);

      let swapTx = await alchemy.core.sendTransaction({
        to: exchangeAddress,
        data: swapData,
        from: account,
      });

      // Wait for transaction to be mined
      await alchemy.core.waitForTransaction(swapTx.hash);
      console.log(`Swap Tx is: ${swapTx.hash}`);
    }
  } catch (err) {
    console.error("Error swapping tokens:", err);
  }
};
