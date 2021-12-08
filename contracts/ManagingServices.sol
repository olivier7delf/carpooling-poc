// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./BookingCarpooling.sol";
import "./CarpoolingFactoryAbstract.sol";

// ManagingServices has every functions that interact with services, or modify pending and booked services inside the smart contract.


contract ManagingServices is BookingCarpooling {
    // simplification: 1 service has 1 address, no option yet.
    // mapping(address => mapping (address => uint256)) public pendingUserService; // {user: {service: amount}, ...}
    // mapping(address => mapping (address => uint256)) public userService; // {user: {service: amount}, ...}
    // mapping(address => address[]) public userServices; // {user: [service, ...], ...}
    // address[] public mandatoryServices; // [service, ...] , e.g: owner wants passenger with idCheck & insurance...

    event SettleServiceToSomeone(address service, address passenger, address to, uint256 amountService);
    event ValidateService(address user, address service, bool validation);

    // ---> Services - User
    //  The passenger/creator asks to add the service paying msg.value, or he cancels the ask and he is refunded
    function askService(address service, bool cancel) payable public {
        require(msg.value >= 0, "price service must be >= 0");

        if(cancel==true && pendingUserService[msg.sender][service] > 0){
            bookings[msg.sender].amountRefunded += pendingUserService[msg.sender][service];
            pendingUserService[msg.sender][service] = 0;
        }else if(cancel==false){
            pendingUserService[msg.sender][service] += msg.value;
            userServices[msg.sender].push(service);
        }
        askServiceUsingFactory(service, carpoolingId, msg.sender, msg.value, cancel);
    }

    // user emits a notification for insurance to get insured, using factory contract to facilitate insurance listening.
    function askServiceUsingFactory(address service, uint64 carpoolingId, address user, uint256 amount, bool cancel) private {
        CarpoolingFactoryAbstract carpoolingFactoryAbs = CarpoolingFactoryAbstract(carpoolingFactoryAddress);
        carpoolingFactoryAbs.setPendingServiceCarpoolingUserOption(service, carpoolingId, user, amount, cancel);
    }

    // service validates the pending query from customer
    function validateService(address user, bool validation) public {
        require(pendingUserService[user][msg.sender] > 0, "there are no pending query from this user to this service");

        if(validation==true){
            userService[user][msg.sender] += pendingUserService[user][msg.sender];  
        }else{
            bookings[user].amountRefunded += pendingUserService[user][msg.sender];
        }
        delete pendingUserService[user][msg.sender];
        

        emit ValidateService(user, msg.sender, validation);
    } 

    // it settles the service, if no issue token are sent to the service, else to the passenger or the conflictOwner
    function settleService(address service, address passenger, address to) internal {
        uint256 amountService = userService[passenger][service];
        userService[passenger][service] = 0;
        bookings[to].amountRefunded += amountService;
        
        emit SettleServiceToSomeone(service, passenger, to, amountService);
    }

    function settleServices(address passenger, address to) internal {
        // If "to" == passenger address, function is like refund passenger
        // Else If "to" == ownerConflict, function will send token to ownerConflict, which has to finalize the paiement
        // else "to" is empty and it meant the service will be paid
        address _initialTo = to;
        for(uint8 j; j < userServices[passenger].length; j++){
            address service = userServices[passenger][j];
            if (_initialTo == address(0)){
                to = service;
            }
            settleService(service, passenger, to);
        }
    }

    // ---> Mandatory services
    function addMandatoryService(address service) public ownerOnly {
        // in VF, modify mandatoryServices to allow more services, i.g: having insurance company, and allowing many of them...
        // Caution, the service must be in the safe repository. VF -> update
        mandatoryServices.push(service);
    }

    function getMandatoryService(uint8 index) view public returns(address) {
        return mandatoryServices[index];
    }

    function checkMandatoryService(address passenger) view public returns(bool){
        // Check that a passenger has every mandatory service
        for(uint8 i; i < mandatoryServices.length; i++){
            if (userService[passenger][mandatoryServices[i]] == 0){
                return false;
            }
        }
        return true;
    }
}