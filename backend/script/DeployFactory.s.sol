// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Factory } from "../src/Factory.sol"; // Adjust the path as necessary

// Import necessary libraries
import {Script, console} from "forge-std/Script.sol";

contract DeployFactory is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the Factory contract
        Factory factory = new Factory();

        // Log the deployed address
        console.log("Factory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}
