// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Factory} from "../src/Factory.sol";
import {Exchange} from "../src/Exchange.sol";
import "../src/ERC20.sol";

contract FactoryTest is Test {
    Factory public factory;
    myToken public token;

    address owner = makeAddr("Saber"); //simmulating that Saber is making the call

    function setUp() public {
        token = myToken(owner);
        tokenAddress = address(token);
    }

}
