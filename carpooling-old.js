// Time manipulation
// npm install --save-dev @openzeppelin/test-helpers
// const {time,} = require('@openzeppelin/test-helpers');

const { assert } = require("chai");

require('chai').use(require('chai-as-promised')).should();

var Carpooling = artifacts.require("./Carpooling.sol");

contract('Carpooling', function(accounts) {

  var  owner   = accounts[0];
  var  payer_1 = accounts[1];
  var  payer_2 = accounts[2];
  var service_1 = accounts[3];
  var service_2 = accounts[4];

  var ownerName = "0x1000000000000000000000000000000000000000000000000000000000000000";
  var otherName = "0x2000000000000000000000000000000000000000000000000000000000000000"; // no impact

  var bidingContract;
  var ERROR_MSG;

  var carpooling;

  // constructor ! it s already set in migration file !
  var carpoolId = 0;
  var origin = "nantes";
  var destination = "bordeaux";
  var nSlot = 3;
  var price = 20; // euros for the moment
  var startDate = Date.now();
  var conflictOwner = owner;
  var carpoolingModeConflict = 0; // generous !
  var userCertificationCheck = false;
  

  //
  var nAvailableSlot;
  var amountBooked;
  var nSlotBooked;
  var passenger;

  var priceService1 = 5;
  var priceService2 = 10;

  it("should create a carpooling, with the desired parameters", async function() {

    carpooling = await Carpooling.deployed();//origin,destination,nSlot,price,startDate,owner,0);

    var ownerCheck = await carpooling.owner.call();
    assert.equal(ownerCheck, owner, "ownerCheck should be the owner !");

    var originCheck = await carpooling.origin.call();
    assert.equal(originCheck, originCheck, "originCheck should be the origin :" + origin);

    var destinationCheck = await carpooling.destination.call();
    assert.equal(destinationCheck, destination, "destinationCheck should be the destination:" + destination);

    var nSlotCheck = await carpooling.nSlot.call();
    assert.equal(nSlotCheck, nSlot, "nSlotCheck should be the nSlot !" + nSlot);

    var priceCheck = await carpooling.price.call();
    assert.equal(priceCheck, price, "priceCheck should be the price !" + price);
    
    var conflictOwnerCheck = await carpooling.conflictOwner.call();
    assert.equal(conflictOwnerCheck, conflictOwner, "owner should be the conflictOwner !" + conflictOwner);

    var carpoolingModeConflictCheck = await carpooling.carpoolingModeConflict.call();
    assert.equal(carpoolingModeConflictCheck, carpoolingModeConflict, "carpoolingModeConflictCheck should be " + carpoolingModeConflict);
  });

  it("should be able to book a carpooling", async function() {
    // payer_1 books 2 slots
    passenger = payer_1;
    nSlotBooked = 2;
    nAvailableSlot = nSlot - nSlotBooked;
    amountBooked = nSlotBooked*price//web3.utils.toBN(nSlotBooked*price);

    await carpooling.makeBooking(nSlotBooked, {from: passenger, value: amountBooked});
    await bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);

    // payer_2 books 1 slots
    passenger = payer_2;
    nSlotBooked = 1;
    nAvailableSlot -= nSlotBooked;
    amountBooked = nSlotBooked*price
    await carpooling.makeBooking(nSlotBooked, {from: payer_2, value: amountBooked});
    await bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);

  });

  it("Passenger should be able to add a service: assurance...", async function() {
    
    // passenger 1 add service1, with option 2
    var priceService = 2*priceService1;
    passenger = payer_1;
    var service = service_1;
    await carpooling.askService(service, 2, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);

    // passenger 1 add service2
    var priceService = 2*priceService2;
    passenger = payer_1;
    var service = service_2;
    await carpooling.askService(service, 2, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);

    // passenger 2 add service1
    var priceService = 1*priceService1;
    passenger = payer_2;
    var service = service_1;
    await carpooling.askService(service, 2, {from: passenger, value: priceService});
    await carpooling.validateService(passenger, true, {from: service});
    serviceAssertions(carpooling, passenger, service, priceService);
    
    // Services added for a passenger are accessible
    var servicesAddressCheck = await carpooling.getServicesAddress.call(payer_1);
    var servicesAddress = [service_1, service_2];
    assert.equal(servicesAddressCheck.toString(), servicesAddress.toString(), "servicesAddress should = " + servicesAddress);
  });

  it("Passenger should be able to cancel a booking and to be refunded", async function() {
    
    // passager can cancel 1 booking, and keep the other one ! BUT services are NOT refunded
    passenger = payer_1;
    var nSlotAskRefund = 1;
    var amountRefounded = nSlotAskRefund * price;
    await carpooling.askRefundBooking(nSlotAskRefund, {from: passenger});
    await carpooling.validateRefund(passenger, true, {from: owner});
    amountRefoundedCheck = await carpooling.balanceOf(passenger);
    
    assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "owner validate so amountRefounded should = " + amountRefounded);
    nSlotBooked = 1;
    amountBooked = nSlotBooked * price;
    nAvailableSlot += 1;
    bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot);

    // owner can unvalidate the query of the passenger to cancel a booking.
    passenger = payer_1;
    nSlotAskRefund = 1;
    amountRefounded += 0;
    await carpooling.askRefundBooking(nSlotAskRefund, {from: passenger});
    await carpooling.validateRefund(passenger, false, {from: owner});
    amountRefoundedCheck = await carpooling.balanceOf(passenger);
    assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "owner did NOT validate so amountRefounded should = " + amountRefounded);
    
    var nSlotAskRefundCheck = await carpooling.getnSlotAskRefund.call(passenger);
    assert.equal(nSlotAskRefundCheck.toNumber(), 0, "owner activate the function 'validateRefundBooking' so nSlotAskRefund should = 0");


    // passager can cancel its last booking, AND service are refunded
    passenger = payer_1;
    var priceServiceCheck1 = await carpooling.getAmountService(passenger, service_1);
    var priceServiceCheck2 = await carpooling.getAmountService(passenger, service_2);

    nSlotAskRefund = 1;
    amountRefounded = (1+nSlotAskRefund) * price + 2 * (priceService1+priceService2); // (+1 for the precedent place refunded) "2" because the passenger had booked 2 seats at the begining
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
    var nAvailableSlot = await carpooling.nAvailableSlot.call()
    nAvailableSlot = nAvailableSlot.toNumber() + addedSlot;
    await carpooling.addNAvailableSlot(addedSlot, true, {from:owner});
    var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
    assert.equal(nAvailableSlotCheck, nAvailableSlot , "1: Number of available slot should =" + nAvailableSlot);

    // Retrieve 2 slots
    addedSlot = 2;
    var nAvailableSlot = await carpooling.nAvailableSlot.call();
    nAvailableSlot = nAvailableSlot.toNumber() - addedSlot;
    await carpooling.addNAvailableSlot(addedSlot, false, {from:owner});
    var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
    assert.equal(nAvailableSlotCheck, nAvailableSlot , "2: Number of available slot should =" + nAvailableSlot);

    // Fail to retrieve 3 slots, because only 2 are available.
    const ERROR_MSG = "Returned error: VM Exception while processing transaction: revert nAvailableSlot must be >= nSlot retrieved";
    await carpooling.addNAvailableSlot(3, false, {from:owner}).should.be.rejectedWith(ERROR_MSG);
  });

  it("Owner should be able to cancel the carpooling and each passenger should be refunded", async function() {

    await carpooling.cancelCarpooling({from:owner});
    // amountRefoundedCheck = await carpooling.balanceOf(payer_1);
    // amountRefounded = 2 * (price+priceService1+priceService2)
    // assert.equal(amountRefoundedCheck.toNumber(), amountRefounded, "2 place (2*20€) and 1(*2) service1 (2*5=10€) + 1 service2 (20€) = 70 €");

    amountRefoundedCheck = await carpooling.balanceOf(payer_2);
    amountRefounded = (price+priceService1)
    assert.equal(amountRefoundedCheck.toNumber(),amountRefounded , "1 place and 1 service1 (5€) = 25€");
  });

  it("Account having money refunded should be able to withdraw it", async function() {
    // todo : check if the withdraw is really working : change price euro to wei....
    var balanceOri = await web3.eth.getBalance(payer_1);
    // console.log("balanceOri =", balanceOri);
    await carpooling.withdrawalRefund(payer_1, {from: payer_1});
    var balanceCheck = await carpooling.balanceOf.call(payer_1);
    assert.equal(balanceCheck, 0, "passenger1 no more money to refound: 0€")

    // console.log("balanceCheck =", balanceCheck.toNumber());
    // var balance = await web3.eth.getBalance(payer_1);
    // console.log("balance - balanceOri =", balance - balanceOri);

    // passenger1 cannot withdraw money of passenger2 
    const ERROR_MSG = "Returned error: VM Exception while processing transaction: revert you don't have anything to be refund !";
    await carpooling.withdrawalRefund(payer_2, {from: payer_1}).should.be.rejectedWith(ERROR_MSG);


    await carpooling.withdrawalRefund(payer_2, {from: payer_2});
    balanceCheck = await carpooling.balanceOf.call(payer_2);
    assert.equal(balanceCheck, 0, "passenger2 no more money to refound: 0€")
    
  });
});

async function bookingAssertions(carpooling, passenger, nSlotBooked, amountBooked, nAvailableSlot) {
  var nSlotBookedCheck = await carpooling.getnSlotBooked.call(passenger);
  assert.equal(nSlotBookedCheck, nSlotBooked, "carpooling should have nSlotBooked by the passenger = " + nSlotBooked);

  var amountBookedCheck = await carpooling.getAmountBooked.call(passenger);
  assert.equal(amountBookedCheck, amountBooked, "carpooling should have amountBooked by the passenger = " + amountBooked);

  var nAvailableSlotCheck = await carpooling.nAvailableSlot.call();
  assert.equal(nAvailableSlotCheck, nAvailableSlot, "carpooling total nAvailableSlot = " + nAvailableSlot);
}

async function serviceAssertions(carpooling, passenger, service, priceService){
  
  var priceServiceCheck = await carpooling.getAmountService(passenger, service);
  assert.equal(priceServiceCheck, priceService, "priceService should = " + priceService);
}