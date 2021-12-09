require('chai').use(require('chai-as-promised')).should();

const { assert } = require("chai");
// Time manipulation: npm i ganache-time-traveler
const timeMachine = require('ganache-time-traveler');

var CarpoolingFactory = artifacts.require("./CarpoolingFactory.sol");
var Carpooling = artifacts.require("./Carpooling.sol");

contract('CarpoolingFactory and Carpooling', function(accounts) {
  var ERROR_MSG;
  var carpooling;

  var  owner   = accounts[0];
  var  passenger_1 = accounts[1];
  var  passenger_2 = accounts[2];
  var  passenger_3 = accounts[3];
  var service_1 = accounts[4];
  var service_2 = accounts[5];

  var origin = "nantes";
  var destination = "bordeaux";
  var nSlot = 3;
  var price = 20; // TODO, use BN... about 20€ =~ 10 * 10**18 wei in Matic, Polygon
  var priceService1 = 1;
  var priceService2 = 2;
  var delay = 3*24*3600; // carpooling is in 3 days
  var startTime = Math.floor(Date.now()/1000)+delay;
  var conflictOwner = owner;
  var carpoolingModeConflict = 0; // generous mode
  
  var nAvailableSlot;
  var amountBooked;
  var nSlotBooked;
  var passenger;

  it("carpoolingFactory should create a carpooling, with the desired parameters", async function() {

    carpoolingFactory = await CarpoolingFactory.deployed();
    await carpoolingFactory.createCarpooling("nantes","bordeaux",3,price,startTime,conflictOwner,0, {from: owner});
    var carpoolingAddress = await carpoolingFactory.getCarpoolingAddressUsingIndex.call(0);
    carpooling = await Carpooling.at(carpoolingAddress);

    var carpoolingFactoryAddress = carpoolingFactory.address;
    var carpoolingFactoryAddressCheck = await carpooling.carpoolingFactoryAddress.call();
    assert.equal(carpoolingFactoryAddressCheck, carpoolingFactoryAddress, "carpoolingFactoryAddress should be " + carpoolingFactoryAddress);

    var ownerCheck = await carpooling.owner.call();
    assert.equal(ownerCheck, owner, "owner should be" + owner);

    var originCheck = await carpooling.origin.call();
    assert.equal(originCheck, originCheck, "origin should be:" + origin);

    var destinationCheck = await carpooling.destination.call();
    assert.equal(destinationCheck, destination, "destination should be:" + destination);

    var nSlotCheck = await carpooling.nSlot.call();
    assert.equal(nSlotCheck, nSlot, "nSlot should be:" + nSlot);

    var priceCheck = await carpooling.price.call();
    assert.equal(priceCheck, price, "The price should be:" + price);
    
    var conflictOwnerCheck = await carpooling.conflictOwner.call();
    assert.equal(conflictOwnerCheck, conflictOwner, "owner should be the conflictOwner:" + conflictOwner);

    var carpoolingModeConflictCheck = await carpooling.carpoolingModeConflict.call();
    assert.equal(carpoolingModeConflictCheck, carpoolingModeConflict, "carpoolingModeConflict should be " + carpoolingModeConflict);
  });

  it("should be able to book a carpooling", async function() {
    // passenger_1 books 2 slots
    passenger = passenger_1;
    nSlotBooked = 2;
    nAvailableSlot = nSlot - nSlotBooked;
    amountBooked = nSlotBooked*price//web3.utils.toBN(nSlotBooked*price);

    await carpooling.makeBooking(nSlotBooked, {from: passenger, value: amountBooked});
    await carpooling.validateBooking(passenger);
    await bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);

    // passenger_2 books 1 slots
    passenger = passenger_2;
    nSlotBooked = 1;
    nAvailableSlot -= nSlotBooked;
    amountBooked = nSlotBooked*price
    await carpooling.makeBooking(nSlotBooked, {from: passenger, value: amountBooked});
    await carpooling.validateBooking(passenger);
    await bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);
  });

  it("Passenger should be able to add a service: assurance...", async function() {
    
    // passenger 1 add service1
    var priceService = 2*priceService1;
    passenger = passenger_1;
    var service = service_1;
    await carpooling.askService(service, false, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);

    // passenger 1 add service2
    var priceService = 2*priceService2;
    passenger = passenger_1;
    var service = service_2;
    await carpooling.askService(service, false, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);

    // passenger 2 add service1
    var priceService = 1*priceService1;
    passenger = passenger_2;
    var service = service_1;
    await carpooling.askService(service, false, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);
    
    // Services added for a passenger are visible
    var servicesAddressCheck = await carpooling.getUserServices.call(passenger_1);
    var servicesAddress = [service_1, service_2];
    assert.equal(servicesAddressCheck.toString(), servicesAddress.toString(), "servicesAddress should = " + servicesAddress);
  });

  it("Passenger should be able to cancel a booking and to be refunded", async function() {
    // passager can cancel 1 booking, and keep the other one. But services are not refunded. 
    passenger = passenger_1;
    var nSlotAskRefund = 1;
    var amountRefounded = nSlotAskRefund * price;
    await carpooling.askRefundBooking(nSlotAskRefund, {from: passenger});
    await carpooling.validateRefund(passenger, true, {from: owner});
    amountRefoundedCheck = await carpooling.balanceOf(passenger);
    
    assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "owner validate so amountRefounded should = " + amountRefounded);
    nSlotBooked = 1;
    amountBooked = nSlotBooked * price;
    nAvailableSlot += 1; // =nSlotAskRefund
    bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);

    // passenger_1 try to cancel its other booking, owner can unvalidate the query of the passenger to cancel a booking.
    passenger = passenger_1;
    nSlotAskRefund = 1;
    amountRefounded += 0;
    await carpooling.askRefundBooking(nSlotAskRefund, {from: passenger});
    await carpooling.validateRefund(passenger, false, {from: owner});
    amountRefoundedCheck = await carpooling.balanceOf(passenger);
    assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "owner did NOT validate so amountRefounded should = " + amountRefounded);
    
    var nSlotAskRefundCheck = await carpooling.getnSlotAskRefund.call(passenger);
    assert.equal(nSlotAskRefundCheck.toNumber(), 0, "owner activate the function 'validateRefundBooking' so nSlotAskRefund should = 0");


    // passager can cancel its last booking, AND services are refunded
    passenger = passenger_1;
    nSlotAskRefund = 1;
    amountRefounded +=  price + 2 * (priceService1+priceService2); // "2" because insurances are refunded only when every seats of the passenger are canceled
    await carpooling.askRefundBooking(nSlotAskRefund, {from: passenger});
    await carpooling.validateRefund(passenger, true, {from: owner});
    amountRefoundedCheck = await carpooling.balanceOf(passenger);
    
    assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "owner validate (last) so amountRefounded should = " + amountRefounded);
    nSlotBooked = 0;
    amountBooked = nSlotBooked * price;
    nAvailableSlot += 1;
    bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);
  });

  it("Owner should be able to add/retrieve an available slot or retrieve an empty one", async function() {
    
    // Add 2 slots
    addedSlot = 2;
    nAvailableSlot = await carpooling.nAvailableSlot.call()
    nAvailableSlot = nAvailableSlot.toNumber() + addedSlot;
    await carpooling.addNAvailableSlot(addedSlot, true, {from:owner});
    var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
    assert.equal(nAvailableSlotCheck, nAvailableSlot , "1: Number of available slot should =" + nAvailableSlot);

    // Retrieve 2 slots
    addedSlot = 2;
    nAvailableSlot = await carpooling.nAvailableSlot.call();
    nAvailableSlot = nAvailableSlot.toNumber() - addedSlot;
    await carpooling.addNAvailableSlot(addedSlot, false, {from:owner});
    var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
    assert.equal(nAvailableSlotCheck, nAvailableSlot , "2: Number of available slot should =" + nAvailableSlot);

    // Fail to retrieve 3 slots, because only 2 are available. Indeed passenger_1 has still one booking
    ERROR_MSG = "Returned error: VM Exception while processing transaction: revert nAvailableSlot must be >= nSlot retrieved";
    await carpooling.addNAvailableSlot(3, false, {from:owner}).should.be.rejectedWith(ERROR_MSG);
  });

  it("Passenger should be able to validate the carpooling", async function() {
    
    // passeneger 2 try to validate the carpooling before it starts: error
    ERROR_MSG = "Returned error: VM Exception while processing transaction: revert startTime must be past"
    await carpooling.validateCarpooling(true, {from: passenger_2}).should.be.rejectedWith(ERROR_MSG);

    // passeneger 2 validate the carpooling after it has started
    let snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot['result'];
    await timeMachine.advanceTimeAndBlock(delay); // modify the blockchain timestamp (here ganache)
    await carpooling.validateCarpooling(true, {from: passenger_2});
    
    amountRefoundedCheck = await carpooling.balanceOf.call(owner);
    amountRefounded = price;
    assert.equal(amountRefoundedCheck, amountRefounded, "owner should have been founded of:" + amountRefounded);

    await timeMachine.revertToSnapshot(snapshotId); // Without it, you cannot repeat the test. Caution it reverse every actions inside.
  });

  it("Owner had a mandatory service", async function() {
    // owner (=driver) add a mandatory service
    await carpooling.addMandatoryService(service_1, {from: owner});

    // passenger_3 books 1 slots (still pending)
    passenger = passenger_3;
    nSlotBooked = 1;
    nAvailableSlot -= nSlotBooked;
    amountBooked = nSlotBooked*price
    await carpooling.makeBooking(nSlotBooked, {from: passenger, value: amountBooked});
    var userStateCheck = await carpooling.getUserState.call(passenger);
    assert.equal(userStateCheck, 0, "userState should be 0: pending");
    
    // add the service
    var priceService = 1*priceService1;
    var service = service_1;
    await carpooling.askService(service, false, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);

    // anyone can ask to validate a passenger. (booked)
    await carpooling.validateBooking(passenger);
    await bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);
  });

  it("Owner should be able to cancel the carpooling and each passenger should be refunded", async function() {
    // Only the owner can cancel a carpool. passengers have not validated the carpooling, so they are refunded
    await carpooling.cancelCarpooling({from:owner});

    amountRefoundedCheck = await carpooling.balanceOf(passenger_3);
    amountRefounded = (price+priceService1)
    assert.equal(amountRefoundedCheck.toNumber(),amountRefounded , "passenger 3: 1 place and 1 service1 (5€) = 25€");

    amountRefoundedCheck = await carpooling.balanceOf(passenger_2);
    amountRefounded = (price+priceService1)
    assert.equal(amountRefoundedCheck.toNumber(),amountRefounded , "passenger 2: 1 place and 1 service1 (5€) = 25€");
  });

  it("Account having money refunded should be able to withdraw it", async function() {
    // passenger 1 withdraw its money
    await carpooling.withdrawalRefund(passenger_1, {from: passenger_1});
    var balanceCheck = await carpooling.balanceOf.call(passenger_1);
    assert.equal(balanceCheck, 0, "passenger1 no more money to refound: 0€");

    // passenger 1 cannot withdraw money of passenger2 
    ERROR_MSG = "Returned error: VM Exception while processing transaction: revert you don't have anything to be refund !";
    await carpooling.withdrawalRefund(passenger_2, {from: passenger_1}).should.be.rejectedWith(ERROR_MSG);

    // passenger 3 withdraw its money
    await carpooling.withdrawalRefund(passenger_3, {from: passenger_3});
    balanceCheck = await carpooling.balanceOf.call(passenger_3);
    assert.equal(balanceCheck, 0, "passenger3 has no more money to refound: 0€");
  });
});

// Check booking's structure characteristics
async function bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot) {
  var nSlotBookedCheck = await carpooling.getnSlotBooked.call(passenger);
  assert.equal(nSlotBookedCheck, nSlotBooked, "carpooling should have nSlotBooked by the passenger = " + nSlotBooked);

  var amountBookedCheck = await carpooling.getAmountBooked.call(passenger);
  assert.equal(amountBookedCheck, amountBooked, "carpooling should have amountBooked by the passenger = " + amountBooked);

  var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
  assert.equal(nAvailableSlotCheck, nAvailableSlot, "carpooling total nAvailableSlot = " + nAvailableSlot);

  var userStateCheck = await carpooling.getUserState.call(passenger);
  assert.equal(userStateCheck, 1, "userState should be 1: booked");
}

// Check if the service has funds looked in userService.
async function serviceAssertions(carpooling, passenger, service, priceService){
  var priceServiceCheck = await carpooling.getUserService(passenger, service);
  assert.equal(priceServiceCheck, priceService, "priceService should = " + priceService);
}