// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Crylot is Ownable{

    event NumberGuessed(address _addr);
    event WithdrawnUserFunds(address _addr, uint256 funds);

    uint256 minBet = 0.005 ether;
    uint256 maxBet = 0.05 ether;
    uint256 totalBets = 0;

    uint256 randomNumber = 5;

    bool isPaused = false;

    mapping(address => bool) isAdmin;
    mapping(address => uint256) userFunds;
    mapping(address => uint256) userBets;

    struct BET {
        address _addr;
        uint256 amount;
        uint256 number;
    }
    BET lastBet;
    // -/ SET GAME DIFFICULTIES \-
    // categorie => reward
    // BRONZE - EMERALD - DIAMOND
    uint256[3] categories = [7, 35, 70];


    modifier onlyAdmin() {
        require(
            isAdmin[_msgSender()] || _msgSender() == owner(),
            "You are not an admin"
        );
        _;
    }

    modifier canPlay() {
        require(
            isPaused == false,
            "The game is paused"
        );
        _;
    }

    bool internal locked;
    modifier noReentrancy() {
        require(!locked, "No re-entrancy!");
        locked = true;
        _;
        locked = false;
    }

    function getLastBet() public view returns(BET memory){
        return lastBet;
    }

    function bet(uint256 number, uint category) public payable canPlay{
        require(category < 3 , "The categorie must be lower than 3");
        require(msg.value >= minBet, "The bet must be higher or equal than min bet");
        require(msg.value <= maxBet, "The bet must be lower or equal than max bet");

        if(number == randomNumber){
            userFunds[msg.sender] += (msg.value * categories[category]);
            emit NumberGuessed(msg.sender);
        }
        lastBet = BET(msg.sender, msg.value, number);
        userBets[msg.sender] += 1;
        totalBets += 1;
    }

    function getTotalBets() public view  returns (uint256) {
        return totalBets;
    }

    function getUserBets(address _addr) public view  returns (uint256) {
        return userBets[_addr];
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

    function isInPause() public view returns (bool) {
        return isPaused;
    }
    function setPaused(bool pause) public onlyOwner{
        isPaused = pause;
    }

    function getFunds(address _addr) public view returns (uint256){
        return userFunds[_addr];
    }
    function withdrawUserFunds() public payable noReentrancy{
        uint256 funds = userFunds[msg.sender];
        require(getBalance() >= funds, "The contract has no liquidity");
        require(funds > 0, "You do not have any funds");

        (bool success,) = (msg.sender).call{value:funds}("");
        require(success, "Transaction failed");

        userFunds[msg.sender] = 0;
        emit WithdrawnUserFunds(msg.sender, funds);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(address _addr) public payable onlyAdmin{
        uint256 balance = getBalance();
        require(balance > 0, "The balance is 0");
        (bool success,) = (_addr).call{value:balance}("");
        require(success, "Transaction failed");
    }
}
