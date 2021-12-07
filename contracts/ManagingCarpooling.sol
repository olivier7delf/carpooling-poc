// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./ManagingServices.sol";


contract ManagingCarpooling is ManagingServices {
    
    // Call the function to check if the passenger has the services required
    function validateBooking(address passenger) public {
        if (checkMandatoryService(passenger)==true && bookings[passenger].userState == State.pending){
            bookings[passenger].userState = State.booked;
        }
    }

    // Passenger validate or not carpooling trip
    function validateCarpooling(bool isValidated) public {
        require(bookings[msg.sender].userState == State.booked, "your carpooling's state must be 'booked'");
        require(bookings[msg.sender].nSlotBooked > 0, "you must have nSlotBooked > 0");
        require(startTime < now, "startTime must be past");
        
        if (isValidated == false){
            bookings[msg.sender].userState = State.conflicted;
        }else{
            bookings[msg.sender].userState = State.validated;
            
            settleBooking(msg.sender, owner, bookings[msg.sender].amountBooked);
            settleServices(msg.sender, address(0));
        }
    }

    // owner validate to refund a passenger that canceled nSLot. 
    function validateRefund(address to, bool isValidated) public ownerOnly {
        validateRefundBooking(to, isValidated);
        // Services are refunded only if the passenger has no more booked seat
        if (isValidated == true && bookings[to].amountBooked == 0){
            settleServices(to, to);
        }
    }

    // Owner can cancel the contract, every passenger can get his refund
    function cancelCarpooling() public ownerOnly {
        refundSomeUsers(true, false, false);
    }

    // Call by a user to solve carpooling conflicts
    function solveConflict() public returns(bool){
        // VF - caution in the case owner create fake account & fake passenger's booking that will validate the Tx...
        // Only passengers that didn't validateCarpooling yet will get back their money 
        require(now > startTime + 24*60*60, "conflict can be solved after at least 24 hours");
        
        if(((carpoolingModeConflict == ModeConflict.generous) && (nConflict > 0)) ||
           ((nConflict == nSlot-nAvailableSlot) && (carpoolingModeConflict == ModeConflict.normal) && (nConflict > 1))
        ){
            // passenger get back their tokens used for: booking and services
            refundSomeUsers(true, false, false);
            return true;
        }else{
            // conflicted amountBooked and amountService is transfer to conflictOwner 
            refundSomeUsers(false, true, true);
            return false;
        }
    }

    function refundSomeUsers(bool noFilter, bool bookedRecipientIsConflictOwner, bool serviceRecipientToConflictOwner) private {
        // refund passengers (booked + services) depending of the filter, and the serviceRecipientToConflictOwner option
        bool isRefund = noFilter;
        for(uint8 i; i < bookingsAddress.length; i++){
            address passenger = bookingsAddress[i];
            refundFindOneUser(passenger, isRefund, noFilter, bookedRecipientIsConflictOwner, serviceRecipientToConflictOwner);
        }
    }

    function refundFindOneUser(address passenger, bool isRefund, bool noFilter, bool bookedRecipientIsConflictOwner, bool serviceRecipientToConflictOwner) private {
        address bookedRecipient = passenger;
        address serviceRecipient = passenger;

        if (bookedRecipientIsConflictOwner){
            bookedRecipient = conflictOwner;
        }
        if (serviceRecipientToConflictOwner){
            serviceRecipient = conflictOwner;
        }
        if (noFilter == false){// Only refund user in conflict situation !
            isRefund = bookings[passenger].userState == State.conflicted;
        }

        if (isRefund && bookings[passenger].amountBooked > 0){
            refundOneUser(passenger, bookedRecipient, serviceRecipient);
        }
    }
    
    function refundOneUser(address passenger, address bookedRecipient, address serviceRecipient) private {     
        require(msg.sender == conflictOwner || msg.sender == passenger, "msg.sender is not the conflictOwner nor passenger");
        settleBooking(passenger, bookedRecipient, bookings[passenger].amountBooked);
        settleServices(passenger, serviceRecipient);
    }  
}