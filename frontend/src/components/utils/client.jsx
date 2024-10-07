import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  Address,
} from "viem";
import { sepolia } from "viem/chains";
import "viem/window";

// Create an HTTP transport using the hardcoded Alchemy Sepolia endpoint URL
const transport = http("https://eth-sepolia.g.alchemy.com/v2/4bWOvk391ctwaMr74INX5GLLrctoqY8h");

// Create a public client for the Sepolia chain
export const publicClient = createPublicClient({
  chain: sepolia,
  transport,
});

// Create a wallet client using the Sepolia chain and the browser's Ethereum provider (MetaMask, etc.)
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum), // You may want to handle null cases if no wallet is found
});

// Retrieve the user's account address using the wallet client
let account;

(async () => {
  try {
    [account] = await walletClient.getAddresses();
    console.log("User's account address:", account); // Log the retrieved account address
  } catch (error) {
    console.error("Failed to get account address:", error);
  }
})();

export { account };
