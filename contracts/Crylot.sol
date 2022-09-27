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

    function bet(uint256 number) public payable{
        require(msg.value >= minBet, "The bet must be higher or equal than min bet");
        require(msg.value <= maxBet, "The bet must be lower or equal than max bet");
        uint256 n = number;
    }

    function getMinBet() public view  returns (uint256) {
        return minBet;
    }

    function setMinBet(uint256 _newMinimum) public onlyAdmin returns (uint256) {
        require(_newMinimum > 0, "The minimum bet must be higher than 0");
        minBet = _newMinimum;
        return minBet;
    }

    function getMaxBet() public view returns (uint256) {
        return maxBet;
    }

    function setMaxBet(uint256 _newMaximum) public onlyAdmin returns (uint256) {
        require(_newMaximum > minBet, "The maximum bet must be higher than the minimum bet");
        maxBet = _newMaximum;
        return maxBet;
    }
}
