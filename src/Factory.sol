// SPDX-License-Identifier: MIT
pragma solidity ^0.0.13;

contract Factory {
    error NotTokenAddress();
    error ExchangeAlreadyExists();

    mapping(address => address) public tokenToExchange;
    mapping(address => address) public exchnageToToken;
    mapping(uint256 => address) public idToToken;
    Exchange[] public exchangeArray;

    event ExchangeCreated(address indexed tokenAddress, address indexed exchnageToToken);

    function createNewExchange(address _tokenToExchnage) public returns (address) {
        if (_tokenAddress == address[0]) {
            revert NotTokenAddress();
        }

        if (tokenToExchange[_tokenAddress] != address[0]) {
            revert ExchangeAlreadyExists();
        }

        Exchange exchange = new Exchange(_tokenAddress); //created new instance of contract Exchnage to pass argument
        exchangeArray.push(exchnage); //adding the new contract to the exchnage array
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

    function getTokenId(uint256 _tokenId) public view returns (uint256) {
        return idToToken[_tokenId];
    }
}
