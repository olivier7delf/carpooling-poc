i have to decide how do we add a service:
ex:
- carpooling send it to the factory contract, 
booking carpooling is waiting few minutes...
- service listen to it
- service validate it
- booking carpooling call factory to get the info, and modify its status to validate it
AND THE MONEY ?? 

CHECK HOW GET ADDRESS OF CHILD CONTRACT AND ADD IT to the factory contract...

Architecture

The actual contract allow to a lot of flexibility, to foster innovation. 
Before to use it, it would be wise to reduce it, to improve the security and facilitate audits.


carpoolingFactory manages every carpooling
carpoolingFactoryAbstract allow easy call
carpooling instance refer to one trip, including the driver and its passengers

A set of services are allowed in carpoolingFactory
-> set function that have the rights to do it.
-> set function allowing insurance to add services, with an id and an associated price.
???

User with id checked are registered there, to avoid multiple call...

for each carpooling, a passenger can choose to book driver insurrance, or its own or none. the amount of with is split in function of this.
-> add a function booking with include insurance ! and put the other one in private






// "nantes","bordeaux",3,20,1636630368,0xC39F595D9ad5b208988674B7c502e0f5c69a32Ab,0

// test
//price for 1 gas = 76*10**(9-18) ether = 76^-9 ether = 2 * 10^-4 €  (https://ethereumprice.org/gas/), 1 ether = 3737€
// deployment 1 carpooling child SC. -> gas used = 3,316,838,  
// price depl = gas_used*pf1_gas = 0.25 ether = 934 €
// price to add 1 passenger: gas = 108,087 , price = 8,2*10-3 ether = 31 €

// polygon: Polygon is that it is EVM compatible
// 1gas = 40gwei = 40*10^-9 Matic = 56 * 10^-9 € , 1 matic = 1,4€
// ratio gas matic / gas ether = 56*(10^-9 )/ (2*10^-4) = 2,8 * 10^-4 (3571 cheapest to deploy on Polygon than Ethereum L1)
// price dep = 0.26€
// price to add 1 passenger : = 0.0087 €
// total price ~= 0.4 - 0.5 € (with about 10 to 24 Tx on the contract)