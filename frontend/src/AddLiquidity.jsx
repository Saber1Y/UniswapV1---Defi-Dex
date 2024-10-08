import { useState } from "react";
import { useWriteContract, useSimulateContract } from "wagmi";
import { parseEther } from "viem"; // Viem's utility to parse ETH values

const AddLiquidity = ({ contractAddress, abi }) => {
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  // Simulate the contract interaction to make sure it won't fail
  const { data: simulationData, error: simulationError } = useSimulateContract({
    address: contractAddress,
    abi,
    functionName: "addLiquidity",
    args: [parseEther(tokenAmount)], // Use Viem's parseEther
    overrides: {
      value: parseEther(ethAmount), // Use Viem's parseEther to handle ETH
    },
  });

  // Use the simulation data to prepare for writing to the contract
  const { write } = useWriteContract({
    address: contractAddress,
    abi,
    functionName: "addLiquidity",
    args: [parseEther(tokenAmount)],
    overrides: {
      value: parseEther(ethAmount),
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the simulation was successful before writing
    if (!simulationError) {
      write?.(); // Execute the contract call
    } else {
      console.error("Simulation failed:", simulationError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="ETH Amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Amount"
        value={tokenAmount}
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <button type="submit" disabled={simulationError}>
        Add Liquidity
      </button>
      {simulationError && (
        <p style={{ color: "red" }}>
          Simulation Error: {simulationError.message}
        </p>
      )}
    </form>
  );
};

export default AddLiquidity;
