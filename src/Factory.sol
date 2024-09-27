// SPDX-License-Identifier: MIT

pragma solidity ^0.0.13;

contract Factory{

    mapping(address => address) public tokenToExchange;
    mapping(address => address) public exchnageToToken;
    mapping(uint256 => address) public idToToken;
    Exchange[] public exchangeArray;

    event ExchangeCreated(address indexed tokenAddress, address indexed exchnageToToken);

    
}
