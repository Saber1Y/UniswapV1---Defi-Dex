import { createPublicClient, http } from "viem";
import MyTokenContract from "../Data/MyToken.json"

// Define your contract ABIs and addresses directly
const TOKEN_CONTRACT_ABI = MyTokenContract.abi;

const TOKEN_CONTRACT_ADDRESS = "0x5E5785C04cC3Bc245130eCB351AaEBbB94138df1"; // Replace with your actual token contract address

const EXCHANGE_CONTRACT_ABI = [
    // Replace with your actual exchange contract ABI
];

const FACTORY_CONTRACT_ADDRESS = "0xYourFactoryContractAddress"; // Replace with your actual factory contract address

const FACTORY_CONTRACT_ABI = [
    // Replace with your actual factory contract ABI
];

// Create a public client instance
const publicClient = createPublicClient({
    chain: 'mainnet', // Specify the desired blockchain network
    transport: http(),
});

// Retrieve the exchange address associated with a given token address
export const getExchangeAddress = async (address) => {
    try {
        const exchangeAddress = await publicClient.readContract({
            address: FACTORY_CONTRACT_ADDRESS,
            abi: FACTORY_CONTRACT_ABI,
            functionName: "getExchange",
            args: [address],
        });
        return exchangeAddress;
    } catch (err) {
        console.error("Error getting exchange address:", err);
        return "0x"; // Ensuring return type consistency
    }
};

// Retrieve the Ethereum balance of a given address
export const getEtherBalance = async (address) => {
    if (address === "0x") {
        return BigInt(0);
    }

    try {
        const balance = await publicClient.getBalance({ address });
        return balance;
    } catch (err) {
        console.error("Error getting Ether balance:", err);
        return BigInt(0);
    }
};

// Retrieve the balance of a specific token associated with a given address
export const getTokenBalance = async (address) => {
    if (address === "0x") {
        return BigInt(0);
    }

    try {
        const balanceOfToken = await publicClient.readContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: TOKEN_CONTRACT_ABI,
            functionName: "balanceOf",
            args: [address],
        });
        return balanceOfToken;
    } catch (err) {
        console.error("Error getting token balance:", err);
        return BigInt(0);
    }
};

// Retrieve the balance of an LP token associated with a given address
export const getLpTokenBalance = async (address, exchangeAddress) => {
    if (
        address === "0x" ||
        exchangeAddress === "0x" ||
        exchangeAddress === "0x0000000000000000000000000000000000000000"
    ) {
        return BigInt(0);
    }

    try {
        const balanceOfLpToken = await publicClient.readContract({
            address: exchangeAddress,
            abi: EXCHANGE_CONTRACT_ABI,
            functionName: "balanceOf",
            args: [address],
        });
        return balanceOfLpToken;
    } catch (err) {
        console.error("Error getting LP token balance:", err);
        return BigInt(0);
    }
};

// Retrieve the reserve amount of a token within the exchange contract
export const getReserveOfToken = async (exchangeAddress) => {
    if (exchangeAddress === "0x") {
        return BigInt(0);
    }

    try {
        const reserve = await publicClient.readContract({
            address: exchangeAddress,
            abi: EXCHANGE_CONTRACT_ABI,
            functionName: "getTokenReserves",
        });
        return reserve;
    } catch (err) {
        console.error("Error getting reserve of token:", err);
        return BigInt(0);
    }
};

// Retrieve the token symbol by the address
export const getTokenData = async (address) => {
    try {
        const tokenMetadata = await publicClient.qn_getTokenMetadataByContractAddress({
            contract: address,
        });

        return tokenMetadata?.symbol ?? "Unknown";
    } catch (err) {
        console.error("Error getting token data:", err);
        return "Unknown";
    }
};
