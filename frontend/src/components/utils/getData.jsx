import { Alchemy, Network } from "alchemy-sdk";
import {
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_CONTRACT_ABI,
  FACTORY_CONTRACT_ABI,
  FACTORY_CONTRACT_ADDRESS,
} from "./constants";

// Initialize the Alchemy SDK
const alchemy = new Alchemy({
  apiKey: "YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy API Key
  network: Network.ETH_MAINNET, // Use appropriate network (mainnet, goerli, etc.)
});

/**
 * Retrieve the exchange address associated with a given token address.
 * @param {string} address - The token contract address.
 * @returns {Promise<string>} - The exchange contract address for the token.
 */
export const getExchangeAddress = async (address) => {
  try {
    const exchangeAddress = await alchemy.core.callContract({
      to: FACTORY_CONTRACT_ADDRESS,
      data: alchemy.utils.encodeFunctionCall(
        {
          name: "getExchange",
          type: "function",
          inputs: [{ type: "address", name: "token" }],
        },
        [address]
      ),
    });

    return exchangeAddress;
  } catch (err) {
    console.error("Error fetching exchange address:", err);
    return "0x";
  }
};

/**
 * Retrieve the Ethereum balance of a given address.
 * @param {string} address - The address to check the Ether balance for.
 * @returns {Promise<bigint>} - The Ether balance in Wei.
 */
export const getEtherBalance = async (address) => {
  if (address === "0x") {
    return BigInt(0);
  }

  try {
    const balance = await alchemy.core.getBalance(address);
    return BigInt(balance);
  } catch (err) {
    console.error("Error fetching Ether balance:", err);
    return BigInt(0);
  }
};

/**
 * Retrieve the balance of a specific token associated with a given address.
 * @param {string} address - The address to check the token balance for.
 * @returns {Promise<bigint>} - The token balance.
 */
export const getTokenBalance = async (address) => {
  if (address === "0x") {
    return BigInt(0);
  }

  try {
    const tokenBalance = await alchemy.core.callContract({
      to: TOKEN_CONTRACT_ADDRESS,
      data: alchemy.utils.encodeFunctionCall(
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ type: "address", name: "account" }],
        },
        [address]
      ),
    });

    return BigInt(tokenBalance);
  } catch (err) {
    console.error("Error fetching token balance:", err);
    return BigInt(0);
  }
};

/**
 * Retrieve the balance of an LP token associated with a given address and exchange.
 * @param {string} address - The user's address.
 * @param {string} exchangeAddress - The exchange contract address.
 * @returns {Promise<bigint>} - The balance of LP tokens.
 */
export const getLpTokenBalance = async (address, exchangeAddress) => {
  if (
    address === "0x" ||
    exchangeAddress === "0x" ||
    exchangeAddress === "0x0000000000000000000000000000000000000000"
  ) {
    return BigInt(0);
  }

  try {
    const balanceOfLpToken = await alchemy.core.callContract({
      to: exchangeAddress,
      data: alchemy.utils.encodeFunctionCall(
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ type: "address", name: "account" }],
        },
        [address]
      ),
    });

    return BigInt(balanceOfLpToken);
  } catch (err) {
    console.error("Error fetching LP token balance:", err);
    return BigInt(0);
  }
};

/**
 * Retrieve the reserve amount of a token within the exchange contract.
 * @param {string} exchangeAddress - The exchange contract address.
 * @returns {Promise<bigint>} - The token reserve in the exchange.
 */
export const getReserveOfToken = async (exchangeAddress) => {
  if (exchangeAddress === "0x") {
    return BigInt(0);
  }

  try {
    const tokenReserve = await alchemy.core.callContract({
      to: exchangeAddress,
      data: alchemy.utils.encodeFunctionCall(
        {
          name: "getTokenReserves",
          type: "function",
          inputs: [],
        },
        []
      ),
    });

    return BigInt(tokenReserve);
  } catch (err) {
    console.error("Error fetching token reserve:", err);
    return BigInt(0);
  }
};

/**
 * Retrieve the token symbol by the token contract address.
 * @param {string} address - The token contract address.
 * @returns {Promise<string>} - The token symbol.
 */
export const getTokenData = async (address) => {
  try {
    const tokenMetadata = await alchemy.core.getTokenMetadata(address);
    return tokenMetadata.symbol || "Unknown";
  } catch (err) {
    console.error("Error fetching token data:", err);
    return "Unknown";
  }
};
