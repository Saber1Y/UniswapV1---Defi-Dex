import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// // import { WagmiConfig } from "wagmi";
// // import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// // import { wagmiConfig, chains } from "./wagmiSetup"; // Separate configuration

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <WagmiConfig config={wagmiConfig}>
//       <RainbowKitProvider chains={chains}>
//         <App />
//       </RainbowKitProvider>
//     </WagmiConfig>
//   </StrictMode>
// );
