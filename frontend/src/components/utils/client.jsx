import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";

// Step 1: Configure Chains and Providers
const { chains, publicClient } = configureChains(
  [mainnet, sepolia], 
  [publicProvider()]
);

// Step 2: Set up default wallets (RainbowKit provides various wallet connectors)
const { connectors } = getDefaultWallets({
  appName: "UniswapV1", 
  chains,
});

// Step 3: Wagmi Client Configuration
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});


export function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Wallet /> {/* This is your wallet component */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

// Step 5: Use RainbowKit's ConnectButton
export function Wallet() {
  const { address, isConnected } = useAccount(); // Get user's account

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected as {address}</p>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
