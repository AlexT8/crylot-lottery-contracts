// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";


contract Crylot is Ownable{

    public uint256 minBet = 0.005 ether;
    public uint256 maxBet = 0.01 ether;

    mapping(address => bool) isAdmin;


    modifier onlyAdmin() {
        require(
            isAdmin[_msgSender()] || _msgSender() == owner(),
            "You are not an admin"
        );
        _;
    }


    public getMinBet() returns (uint256) {
        return minBet;
    }

    public setMinBet(uint256 _newMinimum) returns (uint256) onlyOwner {
        minBet = _newMinimum;
        return minBet;
    }

    public getMaxBet() returns (uint256) {
        return minBet;
    }

    public setMaxBet(uint256 _newMaximum) returns (uint256) onlyOwner {
        maxbet = _newMaximum;
        return maxbet;
    }
}
