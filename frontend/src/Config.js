import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";


export const config = getDefaultConfig({
  appName: "UniswapV1",
  projectId: "bunniswwap",
  appDescription: "uniswap project",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});