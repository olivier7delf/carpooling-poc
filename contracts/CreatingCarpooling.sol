// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./MetaVariable.sol";

contract CreatingCarpooling is metaVariables {
    // carpooling description
    uint64 carpoolingId;
    address payable public owner;
    address payable public conflictOwner;

    string public origin;
    string public destination;
    uint8 public nSlot;
    uint8 public nAvailableSlot;
    uint256 public price;
    uint256 public startTime;

    State public carpoolingState;
    uint8 public nConflict;
    uint8 public nValid;

    ModeConflict public carpoolingModeConflict;

    struct Booking{
        uint8 nSlotBooked;
        uint256 amountBooked;
        uint8 nSlotAskRefund;
        uint256 amountRefunded;
        State userState;
    }

    mapping(address => Booking) public bookings;
    address[] public bookingsAddress;

    mapping(address => mapping (address => uint256)) public pendingUserService; // info in ManagingServices
    mapping(address => mapping (address => uint256)) public userService; // info in ManagingServices
    mapping(address => address[]) public userServices; // info in ManagingServices
    address[] public mandatoryServices; // add this in creatingCarpooling. in VF
    

    // Fictive: An other smart contract checks user data: name, phone number...
    address public carpoolingFactoryAddress;

    
    modifier ownerOnly() {
        require(msg.sender == owner, "Only the owner can do it !");
        _;
    }

    constructor(
        address payable _owner, uint64 _carpoolingId, string memory _origin, string memory _destination, 
        uint8 _nSlot, uint256 _price, uint _startTime, 
        address payable _conflictOwner, ModeConflict _carpoolingModeConflict
        ) public {
        owner = _owner;
        carpoolingId = _carpoolingId;
        conflictOwner = _conflictOwner;
        
        origin = _origin;
        destination = _destination;
        nSlot = _nSlot;
        nAvailableSlot = nSlot;
        price = _price;
        startTime = _startTime;
        
        carpoolingModeConflict = _carpoolingModeConflict;
        carpoolingFactoryAddress = msg.sender;
        
        bookings[owner].userState = State.booked;
        bookingsAddress.push(owner);
    }
}