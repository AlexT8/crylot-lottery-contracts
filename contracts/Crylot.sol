// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";


contract Crylot is Ownable{

    uint256 minBet = 0.005 ether;
    uint256 maxBet = 0.01 ether;

    mapping(address => bool) isAdmin;


    modifier onlyAdmin() {
        require(
            isAdmin[_msgSender()] || _msgSender() == owner(),
            "You are not an admin"
        );
        _;
    }


    function getMinBet() public view  returns (uint256) {
        return minBet;
    }

    function setMinBet(uint256 _newMinimum) public onlyOwner returns (uint256) {
        minBet = _newMinimum;
        return minBet;
    }

    function getMaxBet() public view returns (uint256) {
        return minBet;
    }

    function setMaxBet(uint256 _newMaximum) public onlyOwner returns (uint256) {
        maxBet = _newMaximum;
        return maxBet;
    }
}
