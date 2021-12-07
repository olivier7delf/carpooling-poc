// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./CreatingCarpooling.sol";
import "./CarpoolingFactoryAbstract.sol";

contract BookingCarpooling is CreatingCarpooling {
    
    event AskRefundBooking(address booker, uint8 nSlotAskRefund);
    event  ValidatedRefundBooking(address booker, uint8 nSlotAskRefundAllowed, uint256 amountRefunded);
    event BookingPending(address booker, uint8 nSlotBooked, uint256 amountBooked);

    // passenger booked N slots
    function makeBooking(uint8 nSlotBooked) payable public {
        require(nSlotBooked > 0, "Book at least 1 slot");
        require(nSlotBooked <= nAvailableSlot, "Not enough slot available!");
        require(price*nSlotBooked == msg.value, "Pay the right price !");

        nAvailableSlot -= nSlotBooked;
        
        if (bookings[msg.sender].nSlotBooked + bookings[msg.sender].nSlotAskRefund > 0) {
            bookings[msg.sender].nSlotBooked = nSlotBooked;
            bookings[msg.sender].amountBooked = msg.value;
        }else{
            bookings[msg.sender] = Booking(nSlotBooked, msg.value, 0, 0, State.pending);
            bookingsAddress.push(msg.sender);
        }
    
        emit BookingPending(msg.sender, nSlotBooked, msg.value);
    }
    
    // Transfer amountBooked when the carpooling is validated or canceled.
    function settleBooking(address from, address to, uint256 amountRefunded) internal {
        require(amountRefunded > 0, "amountRefunded must be > 0");
        require(amountRefunded <= bookings[from].amountBooked, "amountRefunded must be <= amountBooked");
        
        bookings[from].amountBooked -= amountRefunded;
        bookings[to].amountRefunded += amountRefunded;
    }
    
    // passenger ask to remove N slots booked and for refunds
    function askRefundBooking(uint8 nSlotAskRefund) public {
        require(bookings[msg.sender].nSlotBooked > 0,"Not slot booked!");
        require(bookings[msg.sender].nSlotBooked >= bookings[msg.sender].nSlotAskRefund + nSlotAskRefund,"Not enough slot booked!");
        
        bookings[msg.sender].nSlotAskRefund += nSlotAskRefund;
        
        emit AskRefundBooking(msg.sender, nSlotAskRefund);
    }
    
    // Owner validate or not refunds
    function validateRefundBooking(address to, bool isValidated) internal ownerOnly {
        uint8 nSlotAskRefundAllowed;
        if (isValidated == true){
            nAvailableSlot += bookings[to].nSlotAskRefund;
            settleBooking(to, to, bookings[to].nSlotAskRefund * price);
            nSlotAskRefundAllowed = bookings[to].nSlotAskRefund;
            bookings[to].nSlotBooked -= bookings[to].nSlotAskRefund;   
        }
        bookings[to].nSlotAskRefund = 0;

        emit ValidatedRefundBooking(to, nSlotAskRefundAllowed, bookings[to].amountRefunded);
    }

    // Owner can add or delete available slots
    function addNAvailableSlot(uint8 nSlot, bool toAdd) public ownerOnly {
        require(nSlot > 0, "nSlot must be > 0");

        if (toAdd==true) {
            require(nSlot + nAvailableSlot <= 255, "nSlot + nAvailableSlot must uint8 : <= 255");
            nAvailableSlot += nSlot;
        }else{
            require(nAvailableSlot >= nSlot, "nAvailableSlot must be >= nSlot retrieved");
            nAvailableSlot -= nSlot;
        }
    }
}