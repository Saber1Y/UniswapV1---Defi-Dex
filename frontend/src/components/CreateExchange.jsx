// Import necessary modules and components
import { useEffect, useState } from "react";
import { getExchangeAddress } from "./utils/getData";
import { createNewExchange } from "./utils/createExchange";
import { isAddress } from "viem"; // Remove Address type import
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Define the CreateExchange component
const CreateExchange = (props) => {
  // Initialize state variables
  const [tokenAddress, setTokenAddress] = useState("");
  const [notAddress, setNotAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyCreated, setAlreadyCreated] = useState(false);
  const [message, setMessage] = useState("");

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  // Effect to check the token address when changes
  useEffect(() => {
    // Check if the entered address is an EVM address
    isAddress(tokenAddress) ? setNotAddress(false) : setNotAddress(true);
  }, [tokenAddress]);

  // Function to handle creating exchange
  const createExchange = async () => {
    try {
      setLoading(true);

      const exchangeAddress = await getExchangeAddress(tokenAddress);
      if (exchangeAddress === ZERO_ADDRESS) {
        setAlreadyCreated(false);
        await createNewExchange(tokenAddress, props.account);
        setMessage(
          `New Exchange Contract is created. It's associated with Token ${tokenAddress}`
        );
        props.getExchange();
      } else {
        setAlreadyCreated(true);
      }
      setLoading(false);
      setTokenAddress("");
    } catch (err) {
      console.error("Failed to create the Exchange contract:", err);
      setMessage("Failed to create the Exchange contract. Please try again.");
    } finally {
      setLoading(false);
      setTokenAddress("");
    }
  };

  // Render the UI components
  return (
    <div className="flex justify-center min-h-fit bg-blue-100 mt-4">
      {/* Main content container */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
        {props.wrongNetwork && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
            <p className="text-center text-sm">Change your network to Sepolia.</p>
          </div>
        )}
        {/* Note about single token handling */}
        {/* Note about single token handling and manual address update */}
        {!props.wrongNetwork && (
          <div className="text-center p-2 bg-blue-100 mb-4 rounded">
            <p className="text-xs text-gray-700">
              Note: This platform supports one active ERC-20 token at a time. In
              case of creating another Exchange for a new token, it is necessary
              to manually update the ERC-20 token contract address in the code
              to reflect the new token exchange.
            </p>
          </div>
        )}
        {/* Token Address input */}
        {!props.wrongNetwork && (
          <div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Token Address
              </label>
              <input
                className="px-4 py-3 w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter Token Address"
                onChange={(e) => setTokenAddress(e.target.value)}
                value={tokenAddress}
              />
              {/* Display a warning if the input is not a valid address */}
              {tokenAddress && notAddress ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-left text-xs mt-1">
                  <p>This address is not an EVM address. Check your address.</p>
                </div>
              ) : null}
            </div>

            {/* Conditional rendering of the create exchange button */}
            {props.walletConnected ? (
              <button
                onClick={createExchange}
                className={`mt-6 w-full py-3 font-semibold rounded-lg ${
                  notAddress
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                }`}
                disabled={notAddress}
              >
                {/* Display loading spinner or button label */}
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
                ) : (
                  <span>{!notAddress ? "Create Exchange" : "Enter Token Address"}</span>
                )}
              </button>
            ) : (
              <button className="w-full bg-blue-200 text-blue-700 font-semibold rounded-xl py-3 mt-4 hover:bg-blue-300">
                No wallet detected
              </button>
            )}
            {/* Display a warning if an exchange contract is already created */}
            {alreadyCreated ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-left text-xs mt-1">
                <p>There is already an Exchange contract associated with this token address.</p>
              </div>
            ) : null}

            {message && (
              <div
                className={`bg-${
                  message.startsWith("Failed")
                    ? "red-100 border-red-500 text-red-700"
                    : "green-100 border-green-500 text-green-700"
                } p-4 mt-4 text-left`}
              >
                <p>{message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateExchange;
