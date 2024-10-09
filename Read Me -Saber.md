Uniswap V1 DEX Project - To-Do List

1. Liquidity Management
   Add Liquidity:
   Ensure users can add liquidity by depositing ETH and the corresponding tokens.
   Handle calculating token reserves correctly to maintain the ETH/token ratio.
   Allow dynamic calculation of token amounts to be added when the user inputs ETH.
   Remove Liquidity: (Not yet implemented)
   Provide functionality for users to remove liquidity from the pool.
   Track and calculate the correct portion of liquidity tokens to return to the user.


2. Token Swapping
   ETH to Token Swap: (Not yet implemented)
   Integrate the functionality to swap ETH for a given token.
   Use the Uniswap V1 price formula to determine exchange rates.
   Token to ETH Swap: (Not yet implemented)
   Integrate the reverse, where users can swap tokens for ETH.
   Ensure correct price calculation and gas efficiency during the swap process.


3. Pricing Calculations
   Implement functions to calculate the current price for:
   ETH → Token.
   Token → ETH.
   Ensure pricing updates dynamically based on the current reserves in the pool.
   Add a price impact and slippage tolerance feature for users to understand the effect of their trade.

   
4. Contract Interaction (Sepolia Testnet)
   Ensure the smart contracts are correctly deployed on the Sepolia testnet:
   Token Contract.
   Exchange Contract.
   Factory Contract.
   Verify that all contract addresses are correct, and update them if necessary.
   Gas Estimation: Make sure you are handling gas estimation and error handling for failed transactions.
