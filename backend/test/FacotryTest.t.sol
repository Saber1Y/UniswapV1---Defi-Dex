// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Factory} from "../src/Factory.sol";
import "../src/MyToken.sol";

// import {Exchnage} from "../src/Exchange.sol";

contract FactoryTest is Test {
    Factory public factory;
    MyToken public token;

    address owner = makeAddr("Saber"); //simmulating that Saber is making the call

    function setUp() public {
        token = MyToken(owner);
        factory = new Factory();
    }

    function testCreateNewExchange() public {
        address tokenExchangeAddress = factory.createNewExchange(
            address(token)
        );
        assertEq(
            factory.getExchange(address(token)),
            tokenExchangeAddress,
            "Exchange address does not match"
        );
        assertTrue(
            tokenExchangeAddress != address(0),
            "Exchange address should not be 0x0"
        );
    }

    function testFailCreateExchangeForExistingToken() public {
        factory.createNewExchange(address(token));
        factory.createNewExchange(address(token));
    }
}
