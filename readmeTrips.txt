TODO:

urgent !
the owner choose the civil insurance, with a fixed price...
then, passenger pay: price + insPrice in separate field ?!
When carpooling is validated we just move insPrice to amountrefund at insurance address...


user journey:

driver: D
passenger: p
insurance: i
3rd party: p

carpoolingFactory: cf
carpoolingFactoryAbstract: cfa

Everything is fine:
j-3
d: create a carpooling, with user check & insurance - createCarpooling public none
    3: addService(address _service) payable public none
j-2
3: search carpooling -  cf getCarpoolingUsingIndex public instanceAddress 
(later: more functions to have cities, price info easily... because now, they have to query every carpooling)
p: book a seat - makeBooking public none
    verifyUserCertification() private
        cfa: getServiceUserOptions(userCertificationAddress, msg.sender) uint8
        REQUIRE previously: 3: 
            have add user to a service that makes a certification
            3: cf.setServiceUserOption() 
J0
p: validate the carpooling: validateCarpooling(bool _isValidated) public - none
d & i: withdraw money: withdrawalRefund(address payable _to) payable public - none


Everything is fine, with some modification
j-3
d: create a carpooling, with user check & insurance - createCarpooling public - none
    3: addService(address _service) payable public - none
j-2
3: search carpooling -  cf getCarpoolingUsingIndex public - instanceAddress 
(later: more functions to have cities, price info easily... because now, they have to query every carpooling)
p: book a seat - makeBooking public - none
d: add or remove a seat: addNAvailableSlot(uint8 nSlot, bool toAdd) public ownerOnly - none
p: book again...
p: cancel a booking - askRefundBooking(uint8 _nSlotAskRefund) public
    d: validate refund - validateRefund(address _to, bool isValidated) public ownerOnly - none
    p: withdraw money: withdrawalRefund(address payable _to) payable public -none
J0
p: validate the carpooling: validateCarpooling(bool _isValidated) public - none
d & i: withdraw money: withdrawalRefund(address payable _to) payable public -none


Conflict situation:
j-3
d: create a carpooling, with user check & insurance - createCarpooling public - none
    3: addService(address _service) payable public - none
j-2
3: search carpooling -  cf getCarpoolingUsingIndex public - instanceAddress 
(later: more functions to have cities, price info easily... because now, they have to query every carpooling)
p: book a seat - makeBooking public - none
p: cancel a booking - askRefundBooking(uint8 _nSlotAskRefund) public
    d: don't validate refund - validateRefund(address _to, bool isValidated) public ownerOnly - none
    p: withdraw money: withdrawalRefund(address payable _to) payable public -none
J0
p: don't validate the carpooling: validateCarpooling(bool _isValidated) public - none
J1
p or d: ask to solve conflict - solveConflict() public - bool
    Two choices: 
        passenger get back their money
        conflictOwner received the whole amount, and have to split it wisely, depending of the situation
p or d and/or i: withdraw money: withdrawalRefund(address payable _to) payable public -none


intro:
carpooling is as many industry, monopolised a uniq enterprise, in France Blablacar.
at the beginning it bring a lot innovation, but now, it brings some issues: less inovation, expensive, ???
Does blockchain can be a game changer in this field ? what does it imply and can it be efficient and costfree ?
We will see a proposition to make it true, using SC coded in Solidity, and deployed with a solution close to Ethereum BC (Polygon).

A)
B)
C)
D)

Conclusion

code:

add a migration file with the factory contract creating child, then try the ID fonctionnalities

CHECK each small SC do his job:
cancel a reservation:
    cancelBooking
    cancelService



SC:
- check functionnalities are working correctly
    and that it makes sense ! (ex:
        - dont carre for the moment: creator would prefer to add the assurance when he is creating the contract
        - 
        )
    - create
    - join
    - delete:
        - from passenger
        - from owner
    - add assurance
    - conflicts
- Create tests for the main feature: not too much, just enough to show people i am able to do it, and to use zeppling, timestamp...

Explainations/Summary:
- define what is the goal of this work for myself:
- make it valuable for other (who ? recruters ? startup?...)
- medium ? github ? my website ? 
    - -> medium & github, advertising on linkedin: group first maybe? and then my own account ?
    

    
