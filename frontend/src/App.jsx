import React from "react";
import { WagmiProvider, useAccount } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./Config"; // Import the config you just created
import "@rainbow-me/rainbowkit/styles.css";
import AddLiquidity from "./AddLiquidity";
import Navbar from "./constants/NavBar";
import factoryContract from "./Data/Factory.json";
import CreateExchange from "./CreateExchange";

const abi = factoryContract.abi;
const factoryAddress = "0x90193C961A926261B756D1E5bb255e67ff9498A1";

function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <Navbar />
          <CreateExchange abi={abi} factoryAddress={factoryAddress} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
