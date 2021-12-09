// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./ManagingCarpooling.sol";


contract Carpooling is ManagingCarpooling {

    constructor(address payable _owner, uint64 _carpoolingId, string memory _origin, string memory _destination, 
        uint8 _nSlot, uint256 _price, uint _startTime, 
        address payable _conflictOwner, ModeConflict _carpoolingModeConflict) public CreatingCarpooling(
        _owner, _carpoolingId, _origin, _destination, 
         _nSlot, _price, _startTime, 
        _conflictOwner, _carpoolingModeConflict
        )  {}

    event Refunded(address user, uint256 amountRefunded);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    
    modifier onlyCarpoolingMembers(address bookingAddress) {
        require((msg.sender == bookingAddress) || (msg.sender == owner) || (msg.sender == conflictOwner), "Only the passenger, or the owner, or the conflict owner can do it");
        _;
    }


    // Withdraw token from "amountRefunded" to an other account
    function withdrawalRefund(address payable to) payable public {
        // in VF: add restriction to conflictOwner: he should not be able to withdraw. Not done yet because sometime, owner = conflictOwner...
        require(bookings[msg.sender].amountRefunded > 0, "you don't have anything to be refund !");

        to.transfer(bookings[msg.sender].amountRefunded);
        bookings[msg.sender].amountRefunded = 0;
        
        emit Refunded(to, bookings[msg.sender].amountRefunded);
    }

    // Useful for the conflictOwner, to send token (amountRefunded) to another one in the contract
    function transfer(address to, uint tokens) external returns (bool success){
        // in VF: add restriction to conflictOwner to avoid issues...
        require(bookings[msg.sender].amountRefunded >= tokens, "you have not enough tokens");
        
        bookings[msg.sender].amountRefunded -= tokens;
        bookings[to].amountRefunded += tokens;
        emit Transfer(msg.sender, to, tokens);
        
        return true;
    }
    
    // ---> VIEWS

    // get the balance of an address: refunded (=getAmountRefunded)
    function balanceOf(address from) external view returns (uint balance){
        balance = bookings[from].amountRefunded;
    }
    function getnSlotBooked(address bookingAddress) view public onlyCarpoolingMembers(bookingAddress) returns(uint) {
        return bookings[bookingAddress].nSlotBooked;
    }

    function getAmountBooked(address bookingAddress) view public returns(uint) {
        return bookings[bookingAddress].amountBooked;
    }

    function getUserState(address bookingAddress) view public returns(State) {
        return bookings[bookingAddress].userState;
    }

    function getnSlotAskRefund(address bookingAddress) view public returns(uint8) {
        return bookings[bookingAddress].nSlotAskRefund;
    }

    function getUserService(address passenger, address service) view public returns(uint256) {
        return userService[passenger][service];
    }

    function getUserServices(address passenger) view public returns(address[] memory) {
        return userServices[passenger];
    }
}
