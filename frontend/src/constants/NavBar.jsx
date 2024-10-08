import { Helmet, HelmetProvider } from "react-helmet-async";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = ({ handleTab, tab }) => {
  return (
    <div className="py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-500 shadow-md">
      <HelmetProvider>
        <Helmet>
          <title>UniswapV1</title>
          <meta name="description" content="DeFi Course DEX" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
      </HelmetProvider>

      {/* Navbar Container */}
      <div className="flex justify-between items-center mt-4">
        {/* Tab Buttons */}
        <div className="flex flex-row space-x-6">
          <button
            onClick={() => handleTab("create-exchange")}
            className={`${
              tab === "create-exchange"
                ? "text-white border-b-2 border-yellow-300"
                : "text-gray-300"
            } hover:text-yellow-200 font-semibold text-lg transition-all duration-300`}
          >
            Create Exchange
          </button>
          <button
            onClick={() => handleTab("liquidity")}
            className={`${
              tab === "liquidity"
                ? "text-white border-b-2 border-yellow-300"
                : "text-gray-300"
            } hover:text-yellow-200 font-semibold text-lg transition-all duration-300`}
          >
            Liquidity
          </button>
          <button
            onClick={() => handleTab("swap")}
            className={`${
              tab === "swap"
                ? "text-white border-b-2 border-yellow-300"
                : "text-gray-300"
            } hover:text-yellow-200 font-semibold text-lg transition-all duration-300`}
          >
            Swap
          </button>
        </div>

        <p className="text-xl font-bold text-white ">Uniswap V1</p>
        {/* Connect Button */}
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
