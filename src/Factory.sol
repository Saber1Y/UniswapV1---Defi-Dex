// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Exchange} from "./Exchange.sol";

contract Factory {
    error NotTokenAddress();
    error ExchangeAlreadyExists();

    mapping(address => address) public tokenToExchange;
    mapping(address => address) public exchnageToToken;
    mapping(uint256 => address) public idToToken;
    Exchange[] public exchangeArray;

    event ExchangeCreated(address indexed tokenAddress, address indexed exchnageToToken);

    function createNewExchange(address _tokenAddress) public returns (address) {
        if (_tokenAddress == address(0)) {
            revert NotTokenAddress();
        }

        if (tokenToExchange[_tokenAddress] != address(0)) {
            revert ExchangeAlreadyExists();
        }
        Exchange exchange = new Exchange(_tokenAddress, address(this), "MyToken", "MTK");
        //created new instance of contract Exchnage to pass argument
        exchangeArray.push(exchange); //adding the new contract to the exchnage array
        tokenToExchange[_tokenAddress] = address(exchange);

        emit ExchangeCreated(_tokenAddress, address(exchange));
        return address(exchange);
    }

    function getExchange(address _tokenAddress) public view returns (address) {
        return tokenToExchange[_tokenAddress];
    }

    function getToken(address _exchnage) public view returns (address) {
        return tokenToExchange[_exchnage];
    }

    function getTokenId(uint256 _tokenId) public view returns (address) {
        return idToToken[_tokenId];
    }
}
