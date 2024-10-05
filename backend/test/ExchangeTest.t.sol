//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import { MyToken } from  "../src/MyToken.sol";
import { Exchange } from "../src/Exchange.sol";
import { Factory } from "../src/Factory.sol";

contract ExchangeTest is Test {
    Exchange exchange;
    Factory factory;
    MyToken token;
    address tokenAddress;
    address factoryAddress;

    address owner = makeAddr("alice");

    function setUp() public {
        vm.prank(owner);
        token = new MyToken(owner);
        tokenAddress = address(token);

        factory = new Factory();
        factoryAddress = address(factory);

        exchange = new Exchange(tokenAddress, factoryAddress, "MyToken", "MTK");
    }

    function testAddLiquidity() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);

        token.mint(owner, 10000 * 10 ** 18);

        vm.prank(owner);
        token.approve(address(exchange), 10000 * 10 ** 18);

        vm.prank(owner);
        uint256 tokensToAdd = 5000 * 10 ** 18;
        uint256 ethToAdd = 10 ether;
        uint256 liquidity = exchange.addLiquidity{value: ethToAdd}(tokensToAdd);
        console.log(liquidity);
        assertGt(liquidity, 0, "Liquidity tokens not minted");

        uint256 contractTokenBalance = token.balanceOf(address(exchange));
        assertEq(
            contractTokenBalance,
            tokensToAdd,
            "Exchange token balance incorrect"
        );

        assertEq(
            address(exchange).balance,
            ethToAdd,
            "Exchange ETH balance incorrect"
        );
    }

    function testRemoveLiquidity() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 * 10 ** 18);
        vm.prank(owner);
        token.approve(address(exchange), 10000 * 10 ** 18);
        vm.prank(owner);
        uint256 tokensToAdd = 5000 * 10 ** 18;
        uint256 ethToAdd = 10 ether;
        uint256 liquidity = exchange.addLiquidity{value: ethToAdd}(tokensToAdd);

        uint256 totalLiquidityTokens = liquidity;

        vm.prank(owner);
        (uint ethAmount, uint tokenAmount) = exchange.removeLiquidity(
            totalLiquidityTokens
        );
        console.log(ethAmount, tokenAmount);

        assertTrue(
            ethAmount > 0 && tokenAmount > 0,
            "ETH and Tokens should be returned"
        );
        assertEq(ethAmount, ethToAdd, "Incorrect ETH amount returned");
        assertEq(tokenAmount, tokensToAdd, "Incorrect Token amount returned");
    }

    function testSwapEthForTokens() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 ether);
        vm.prank(owner);
        token.approve(address(exchange), 10000 ether);
        vm.prank(owner);
        exchange.addLiquidity{value: 10 ether}(10000 ether);

        uint ethToSwap = 1 ether;
        uint minTokens = 1;
        address recipient = makeAddr("bob");
        vm.deal(recipient, ethToSwap);
        vm.prank(recipient);
        uint tokensReceived = exchange.swapEthForTokens{value: ethToSwap}(
            minTokens,
            recipient
        );

        assertTrue(
            tokensReceived >= minTokens,
            "Received less tokens than expected"
        );
    }

    function testTokenForEthSwap() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 ether);
        vm.prank(owner);
        token.approve(address(exchange), 10000 ether);
        vm.prank(owner);
        exchange.addLiquidity{value: 10 ether}(10000 ether);

        address bob = makeAddr("bob");
        vm.prank(owner);
        token.mint(bob, 1000 ether);
        vm.prank(bob);
        token.approve(address(exchange), 1000 ether);

        uint tokensToSwap = 500 ether;
        uint minEth = 1;
        vm.prank(bob);
        uint ethReceived = exchange.tokenForEthSwap(tokensToSwap, minEth);

        assertTrue(ethReceived >= minEth, "Received less ETH than expected");
    }
}
