// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { walletClient } from "./utils/client";

// Function to shorten the displayed address (e.g., 0xabcd...abcd)
const shortAddress = (address) => {
  return `${address.substring(0, 6)}...${address.slice(-4)}`;
};

// Header component
const Header = ({
  setTab,
  setWalletConnected,
  setAccount,
  setWrongNetwork,
}) => {
  // Initialize state variables
  const [tab, setTabState] = useState(() => {
    const savedTab = localStorage.getItem("currentTab");
    return savedTab ? savedTab : "swap";
  });
  const [account, setAccountState] = useState("0x");
  const [wrongNetwork, setWrongNetworkState] = useState(false);

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      const [address] = await walletClient.requestAddresses();
      setAccountState(address);
      setAccount(address);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setAccountState("0x"); // Reset the account
    setWalletConnected(false); // Update the parent component's state
    setAccount("0x"); // Reset the account in the parent component
  };

  // Function to get the connected address
  const getConnectedAddress = async () => {
    try {
      const [address] = await walletClient.getAddresses();
      if (address) {
        setAccountState(address);
        setAccount(address);
        setWalletConnected(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to detect if the wallet connects to another blockchain
  const getConnectedChain = async () => {
    try {
      const chainIdClient = await walletClient.getChainId();
      if (chainIdClient !== undefined) {
        const isWrongNetwork = chainIdClient !== 11155111; // Replace with the actual Sepolia chain ID
        setWrongNetworkState(isWrongNetwork);
        setWrongNetwork(isWrongNetwork); // Update app-level state
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle tab change
  const handleTab = (newTab) => {
    setTabState(newTab);
    setTab(newTab);
    localStorage.setItem("currentTab", newTab); // Save current tab to local storage
  };

  // Update the tab when walletConnected changes
  useEffect(() => {
    setTab(tab);
  }, [tab, setTab]);

  // Connect the wallet on component mount
  useEffect(() => {
    getConnectedAddress();
    getConnectedChain();

    if (typeof window.ethereum !== "undefined") {
      // The user has Metamask installed and enabled
      window.ethereum.on("accountsChanged", getConnectedAddress);
      window.ethereum.on("chainChanged", getConnectedChain);
    } else {
      console.log("Install browser-based wallet (i.e., Metamask)");
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", getConnectedAddress);
        window.ethereum.removeListener("chainChanged", getConnectedChain);
      }
    };
  }, []);

  // Render the UI components
  return (
    <div className="py-4 px-6 bg-white shadow-md">
      <HelmetProvider>
        <Helmet>
          <title>DeFi Course DEX</title>
          <meta name="description" content="DeFi Course DEX" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
      </HelmetProvider>

      <p className="text-lg font-semibold">DeFi Course DEX</p>

      <div className="flex justify-between items-center">
        {/* Container for the tabs and connect wallet button */}
        <div className="flex lg:flex-row">
          {/* Wrapper for the connect wallet button */}
          <div className="lg:relative lg:w-fit">
            {/* Container for the three tabs */}
            <div className="flex flex-row py-1 space-x-6 text-blue-500 text-lg ">
              {/* Button for the create exchange tab */}
              <button
                onClick={() => handleTab("create-exchange")}
                className={
                  tab === "create-exchange"
                    ? "font-semibold underline"
                    : "font-semibold"
                }
              >
                Create Exchange
              </button>
              {/* Button for the liquidity tab */}
              <button
                onClick={() => handleTab("liquidity")}
                className={
                  tab === "liquidity"
                    ? "font-semibold underline"
                    : "font-semibold"
                }
              >
                Liquidity
              </button>
              {/* Button for the swap tab */}
              <button
                onClick={() => handleTab("swap")}
                className={
                  tab === "swap" ? "font-semibold underline" : "font-semibold"
                }
              >
                Swap
              </button>
            </div>
          </div>
        </div>
        {/* Container for the warning message and connect wallet button */}
        <div className="flex flex-row space-x-4">
          {/* Warning message for incorrect network */}
          <div
            className={`bg-yellow-100 border-l-4 border-yellow-500 p-4 ${
              wrongNetwork ? "block" : "hidden"
            }`}
          >
            <p className="text-xs">Change your network to Sepolia.</p>
          </div>
          {/* Connect wallet button */}
          <button
            onClick={connectWallet}
            className="bg-blue-200 px-3 py-2 rounded-xl text-blue-500 hover:bg-blue-300"
          >
            {account.length > 40 ? shortAddress(account) : "Connect Wallet"}
          </button>
          {account !== "0x" && (
            <button
              onClick={disconnectWallet}
              className="bg-red-200 px-3 py-2 rounded-xl text-red-500 hover:bg-red-300"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Header.displayName = "Header";

export default Header;
