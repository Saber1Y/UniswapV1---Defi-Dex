import { useWriteContract, useAccount } from "wagmi";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // For loading spinner

const CreateExchange = ({ abi, factoryAddress }) => {
  const { address, isConnected } = useAccount(); // Check wallet connection status
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alreadyCreated, setAlreadyCreated] = useState(false);
  const [notAddress, setNotAddress] = useState(false);

  const { writeContract: createNewExchange } = useWriteContract({
    mode: "recklesslyUnprepared",
  });

  // Manual function to validate Ethereum address
  const validateAddress = (inputAddress) => {
    const regex = /^0x[a-fA-F0-9]{40}$/; // Simple regex to match valid Ethereum addresses
    if (!regex.test(inputAddress)) {
      setNotAddress(true);
      return false;
    } else {
      setNotAddress(false);
      return true;
    }
  };

  // Function to handle contract interaction
  const handleCreateExchange = async () => {
    if (!validateAddress(tokenAddress)) return; // Check if token address is valid

    try {
      setLoading(true);
      const tx = await createNewExchange({
        address: factoryAddress,
        abi: abi,
        functionName: "createNewExchange",
        args: [tokenAddress],
      });
      console.log("Transaction sent:", tx);
      setMessage("Exchange created successfully!");
    } catch (error) {
      console.error("Error:", error);
      setMessage(`Failed to create exchange: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-80 bg-blue-100 mt-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
        <div className="text-center p-2 bg-blue-100 mb-4 rounded">
          <p className="text-md text-gray-700">
            Note: This platform supports one active ERC-20 token at a time. In
            case of creating another Exchange for a new token, it is necessary
            to manually update the ERC-20 token contract address in the code to
            reflect the new token exchange.
          </p>
        </div>

        {/* Token Address Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Token Address
          </label>
          <input
            className="px-4 py-3 w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          {tokenAddress && notAddress && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-left text-xs mt-1">
              <p>This address is not an EVM address. Check your address.</p>
            </div>
          )}
        </div>

        {/* Create Exchange Button */}
        {isConnected ? (
          <button
            onClick={handleCreateExchange}
            className={`mt-6 w-full py-3 font-semibold rounded-lg ${
              notAddress
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            }`}
            disabled={notAddress || loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
            ) : (
              <span>Create Exchange</span>
            )}
          </button>
        ) : (
          <button className="w-full bg-blue-200 text-blue-700 font-semibold rounded-xl py-3 mt-4 hover:bg-blue-300">
            No wallet detected
          </button>
        )}

        {/* Already created exchange warning */}
        {alreadyCreated && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-left text-xs mt-1">
            <p>
              There is already an Exchange contract associated with this token
              address.
            </p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-4 text-left ${
              message.startsWith("Failed")
                ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                : "bg-green-100 border-l-4 border-green-500 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateExchange;
