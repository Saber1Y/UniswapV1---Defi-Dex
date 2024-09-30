// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Exchange is ERC20, ReentrancyGuard {

    error InvalidValuesProvided();
    error InsufficientTokenBalance();
    error InvariantCheckFailed();
    error InvalidTokenAmount();
    error TokenAmountLessThanExpected();
    error EthAmountLessThanExpected();
    error EthMustBeGreaterThan0();
    error TokenSoldMustBeGreaterThan0();
    error InvalidValuesProvided();


    address immutable tokenAddress;
    address immutable factoryAddress;

    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event TokenPurchased(address indexed buyer, uint256 ethAmount, uint256 tokensReceived);
    event TokenSold(address indexed seller, uint256 tokensSold, uint256 ethReceived);

    function addLiquidity(uint256 tokenAdded) external paybable nonReentrant returns (uint256) {
        if (msg.value < 0 || tokenAdded < 0) {
            revert InvalidValuesProvided();
        }

        uint256 ethBalance = address(this).balance;
        uint256 tokenBalance = getTokenReserves();

        if (tokenBalance == 0) {
            if (IERC20(tokenAddress).balanceOf(msg.sender) < tokensAdded) {
                revert InsufficientTokenBalance();
            }
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokensAdded);
            uint256 liquidity = ethBalance;
            _mint(msg.sender, liquidity);
            emit LiquidityAdded(msg.sender, msg.value, tokensAdded);
            return liquidity;
        } else {
            uint256 liquidity = (msg.value * totalSupply()) / (ethBalance - msg.value);
            if (IERC20(tokenAddress).balanceOf(msg.sender) < tokensAdded) {
                revert("Insufficient token balance");
            }
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokensAdded);
            _mint(msg.sender, liquidity);
            emit LiquidityAdded(msg.sender, msg.value, tokensAdded);
            return liquidity;
        }
    }

   function removeLiquidity(uint256 tokenAmount) external nonReentrant returns (uint, uint) {
    // Check if the provided tokenAmount is valid (greater than 0)
    if (tokenAmount <= 0) {
        revert InvalidTokenAmount();
    }

    // Calculate the equivalent ETH amount to be returned based on the ratio of tokenAmount to totalSupply
    uint ethAmount = (address(this).balance * tokenAmount) / totalSupply();
    
    // Calculate the equivalent token amount to be returned based on the ratio of tokenAmount to totalSupply
    uint tokenAmt = (getTokenReserves() * tokenAmount) / totalSupply();

    // Invariant check to ensure that the pool's token-to-ETH ratio remains the same before and after liquidity is removed
    if ((getTokenReserves() / address(this).balance) != ((getTokenReserves() + tokenAmt) / (address(this).balance + ethAmount))) {
        revert InvariantCheckFailed();
    }

    // Burn the liquidity tokens that the user is removing from the pool
    _burn(msg.sender, tokenAmount);

    // Send the equivalent ETH back to the user
    payable(msg.sender).transfer(ethAmount);

    // Transfer the equivalent amount of tokens back to the user
    IERC20(tokenAddress).transfer(msg.sender, tokenAmt);

    // Emit an event to indicate liquidity removal
    emit LiquidityRemoved(msg.sender, ethAmount, tokenAmt);

    return (ethAmount, tokenAmt);
}

function swapEthForTokens(uint minTokens, address recipient) external payable nonReentrant returns (uint) {
    uint tokenAmount = getTokenAmount(msg.value);
    if (tokenAmount <= minTokens) {
        revert TokenAmountLessThanExpected();
    }

    IERC20(tokenAddress).transfer(recipient, tokenAmount);
    emit TokenPurchased(msg.sender, msg.value, tokenAmount);

    return tokenAmount;
}

function tokenForEthSwap(uint tokensSold, uint minEth) external nonReentrant returns(uint) {
    uint ethAmount = getEthAmount(tokensSold);

    if(ethAmount < minEth) {
        revert EthAmountLessThanExpected();
    }

    IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokensSold);
    payable(msg.sender).transfer(ethAmount);
    emit TokenSold(msg.sender, tokensSold, ethAmount);

    return ethAmount;
}


// Pricing Functions
//Determines the number of tokens a user would receive for a specified amount of ETH. It first checks that the amount of ETH being sold is greater than 0.
function getTokenAmount(uint ethSold) public view returns (uint256) {

    if (ethSold < 0) {
        revert EthMustBeGreaterThan0();
    }
    uint outputReserve = getTokenReserves();
    return getAmount(ethSold, address(this).balance - ethSold, outputReserve);
}
//Determines the amount of ETH a user would receive for a specified number of tokens. It first checks that the number of tokens being sold is greater than 0. 
function getEthAmount(uint tokensSold) public view returns (uint256) { 

    if (tokenSOld <= 0) {
        revert TokenSoldMustBeGreaterThan0();
    }
    uint inputReserve = getTokenReserves();
    return getAmount(tokensSold, inputReserve - tokensSold, address(this).balance);
}

function getAmount(uint inputAmount, uint inputReserve, uint outputReserve) public pure returns (uint256) {


    if (inputReserve < 0 || inputAmount < 0 ) {
        revert InvalidValuesProvided();
    }
    uint256 inputAmountWithFee = inputAmount * 997;
    uint256 numerator = inputAmountWithFee * outputReserve;
    uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;
    return numerator / denominator;
}

function getTokenReserves() public view returns (uint256) {
    return IERC20(tokenAddress).balanceOf(address(this));
}

}
