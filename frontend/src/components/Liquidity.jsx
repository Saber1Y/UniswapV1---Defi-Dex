// Import necessary modules and components
import { useEffect, useState } from "react";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import { getLpTokenBalance } from "./utils/getData";
import { formatEther } from "viem";

// Define the Liquidity component
const Liquidity = (props) => {
  // Initialize state variables
  const [lpBalance, setLpBalance] = useState(parseFloat("0").toFixed(5));
  const [addLp, setAddLp] = useState(false);

  // useEffect hook to fetch LP token balance on component mount
  useEffect(() => {
    (async () => {
      await getAmounts();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.account,
    props.walletConnected,
    props.wrongNetwork,
    props.exchangeAddress,
  ]);

  // Function to fetch LP token balance
  const getAmounts = async () => {
    const _lpBalance = await getLpTokenBalance(
      props.account,
      props.exchangeAddress
    );

    const showLp = parseFloat(formatEther(_lpBalance)).toFixed(5);
    setLpBalance(showLp);
  };

  // Function to handle showing AddLiquidity component
  const handleAddLp = (value) => {
    setAddLp(value);
  };

  // Render the UI components
  return (
    <div className="flex justify-center">
      {/* This is a container that centers the content. */}
      <div className="w-3/4 rounded-xl">
        {/* This is a conditional statement that renders the AddLiquidity component if the addLp state is true. */}
        {addLp ? (
          <AddLiquidity
            goBack={handleAddLp}
            getLpAmount={getAmounts}
            walletConnected={props.walletConnected}
            account={props.account}
            exchangeAddress={props.exchangeAddress}
            wrongNetwork={props.wrongNetwork}
          />
        ) : (
          <div className="flex flex-col sm:w-3/4 m-auto">
            <div className="flex justify-center ">
              {/* This is a button that opens the Add Liquidity modal. */}
              <button
                onClick={() => handleAddLp(true)}
                className={`font-semibold rounded-xl p-2 ${
                  props.wrongNetwork
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } `}
                disabled={props.wrongNetwork}
              >
                Add Liquidity
              </button>
            </div>
            <div>
              {/* This is a conditional statement that renders the RemoveLiquidity component if the lpBalance state is not equal to 0. */}
              {lpBalance !== parseFloat("0").toFixed(5) ? (
                <RemoveLiquidity
                  lpBalance={lpBalance}
                  getLpAmount={getAmounts}
                  walletConnected={props.walletConnected}
                  account={props.account}
                  exchangeAddress={props.exchangeAddress}
                  wrongNetwork={props.wrongNetwork}
                />
              ) : (
                <div className="bg-white rounded-2xl drop-shadow-2xl lg:mt-2">
                  <div className="flex flex-col items-center gap-y-5 p-10">
                    {props.wrongNetwork && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
                        <p className="text-center text-sm">
                          Change your network to Sepolia.
                        </p>
                      </div>
                    )}

                    {!props.wrongNetwork && (
                      <span className="text-center">
                        You have no Liquidity Positions.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidity;
