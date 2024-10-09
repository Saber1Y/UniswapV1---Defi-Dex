// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MyToken } from "../src/MyToken.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployMyToken is Script {

    function run() external {
    MyToken myToken;

    vm.startBroadcast();

    myToken = new MyToken(msg.sender);

    vm.stopBroadcast();
    }
}