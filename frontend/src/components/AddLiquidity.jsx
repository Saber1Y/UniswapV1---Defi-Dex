// Import necessary modules and constants
import { 
  TOKEN_CONTRACT_ABI, 
  TOKEN_CONTRACT_ADDRESS, 
  EXCHANGE_CONTRACT_ABI 
} from './constants'; // Contract ABIs and addresses

import { parseEther } from 'viem'; // Function to convert Ether to Wei
import { sepolia } from 'viem/chains'; // Sepolia testnet chain
import { createWalletClient, createPublicClient, http, custom } from 'viem'; // Import viem clients
import 'viem/window';

// Create an HTTP transport using the Alchemy endpoint
const transport = http(process.env.ALCHEMY_ENDPOINT); // Replace with your actual Alchemy endpoint

// Create a public blockchain client using Sepolia chain and HTTP transport
export const publicClient = createPublicClient({
  chain: sepolia,
  transport,
});

// Create a wallet blockchain client using Sepolia chain and the browser's Ethereum provider
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum), // Ensure you handle the case where window.ethereum might be null
});

// Retrieve the user's account address using the wallet client
let account;

(async () => {
  [account] = await walletClient.getAddresses();
})();

export { account };

// Function to simulate contract interaction (like approve or addLiquidity)
const simulateContract = async ({ account, address, abi, functionName, args, value = undefined, chain }) => {
  return await publicClient.simulateContract({
    account,
    address,
    abi,
    functionName,
    args,
    value,
    chain,
  });
};

// Function to wait for transaction receipt after sending a transaction
const waitForTransactionReceipt = async (hash) => {
  return await publicClient.waitForTransactionReceipt({ hash });
};

// Function to add liquidity to the exchange pool
export const addLiquidity = async (
  addTokenAmountWei,
  addEtherAmountWei,
  account,
  exchangeAddress
) => {
  try {
    // Increase the allowance of tokens for the exchange contract
    const { request: requestOne } = await simulateContract({
      account,
      address: TOKEN_CONTRACT_ADDRESS,
      abi: TOKEN_CONTRACT_ABI,
      functionName: 'approve',
      args: [exchangeAddress, addTokenAmountWei],
      chain: sepolia,
    });

    // Write the transaction to the blockchain and wait for receipt
    let hash = await walletClient.writeContract(requestOne);
    await waitForTransactionReceipt(hash);
    console.log(`Approve Tx is: ${hash}`);

    // Add liquidity to the exchange pool
    const { request: requestTwo } = await simulateContract({
      account,
      address: exchangeAddress,
      abi: EXCHANGE_CONTRACT_ABI,
      functionName: 'addLiquidity',
      args: [addTokenAmountWei],
      value: addEtherAmountWei,
      chain: sepolia,
    });

    // Write the transaction to the blockchain and wait for receipt
    hash = await walletClient.writeContract(requestTwo);
    await waitForTransactionReceipt(hash);
    console.log(`AddLiquidity Tx is: ${hash}`);
  } catch (err) {
    console.error('Error adding liquidity:', err);
  }
};

// Function to calculate the amount of tokens to add based on provided Ether amount
export const calculateToken = async (_addEther = '0', etherBalanceContract, tokenReserve) => {
  try {
    const _addEtherAmountWei = parseEther(_addEther);

    // Calculate the token amount to be added based on the formula
    const tokenAmount = (_addEtherAmountWei * tokenReserve) / etherBalanceContract;

    return tokenAmount;
  } catch (err) {
    console.error('Error calculating token amount:', err);
    return BigInt(0);
  }
};
