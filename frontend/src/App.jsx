// Import necessary modules and components
import { useEffect, useState } from "react";
import "./App.css"; // Import a CSS file for styling
import Header from "./components/Header"; // Import the Header component
import Swap from "./components/Swap"; // Import the Swap component
import Liquidity from "./components/Liquidity"; // Import the Liquidity component
import CreateExchange from "./components/CreateExchange"; // Import the CreateExchange component
import { Address } from "viem";
import { getExchangeAddress } from "./components/utils/getData";
import { TOKEN_CONTRACT_ADDRESS } from "./components/utils/constants";

// Define the main App component
function App() {
  // Initialize state to track the active tab
  const [tab, setTab] = useState(() => {
    const savedTab = localStorage.getItem("currentTab");
    return savedTab || "swap";
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState < Address > "0x";
  const [exchangeAddress, setExchangeAddress] = useState < Address > "0x";
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Function to fetch the exchange address
  const getExcAddr = async () => {
    const exAddress = await getExchangeAddress(TOKEN_CONTRACT_ADDRESS);
    setExchangeAddress(exAddress);
  };

  // useEffect hook to fetch exchange address data on component mount
  useEffect(() => {
    getExcAddr();
  }, [walletConnected, account]);

  // Update local storage when the tab changes
  useEffect(() => {
    localStorage.setItem("currentTab", tab);
  }, [tab]);

  return (
    // Render the main layout of the application
    <div className="min-h-screen min-w-screen bg-blue-100 p-1 font-sans">
      {/* Render the Header component and pass setTab as a prop */}
      <Header
        setTab={setTab}
        setWalletConnected={setWalletConnected}
        setAccount={setAccount}
        setWrongNetwork={setWrongNetwork}
      />

      {/* Conditionally render the Swap, Liquidity, or CreateExchange component based on the selected tab */}
      <div className="mt-2 p-2 bg-blue-100 rounded-lg">
        {tab === "swap" ? (
          <Swap
            walletConnected={walletConnected}
            account={account}
            exchangeAddress={exchangeAddress}
            wrongNetwork={wrongNetwork}
          />
        ) : tab === "liquidity" ? (
          <Liquidity
            walletConnected={walletConnected}
            account={account}
            exchangeAddress={exchangeAddress}
            wrongNetwork={wrongNetwork}
          />
        ) : tab === "create-exchange" ? (
          <CreateExchange
            walletConnected={walletConnected}
            account={account}
            exchangeAddress={exchangeAddress}
            wrongNetwork={wrongNetwork}
            getExchange={getExcAddr}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
