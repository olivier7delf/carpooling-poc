# Decentralized Capooling with Solidity on Polygon

Carpooling is currently quite expensive (overcharged +30%) and has not innovated a lot for years because there is a monopoly.

This project aims to propose a solution to avoid it using blockchain.

Recent improvements make blockchain an interesting solution, it is fast, cheap, scalable, low energy consumption, and with a consequent ecosystem.

## Contents
1. Project description
2. Architecture and business model
3. Deploy and use the contracts
4. Next steps

## 1) Project description

It is a small Proof of Concept (POC) to validate the feasibility of decentralized carpooling on a technical aspect.
The main idea is to keep things simple and flexible so that other services can interact with them, which facilitates innovation.
It is a minimalist version, to make it usable, it would require collaboration with third party's apps to answer with precision to the needs.

It is related to a wider idea described in (TODO link with medium), in the article, we assume an other other another architecture to lower cost describe in "4. Next steps".

The carpooling apps can:
- Share their offers and use others
- Add services to a carpool, e.g: id check, insurance

The services can easily be registered as safe to be used by drivers and passengers without third-party help.

## 2) Architecture and business model

The project is composed of two smart contracts:
- CarpoolingFactory:
  - carpoolings are registered here
  - services have to been registered as safe to be used
- Carpooling:
  - Manage carpooling
  - Manage services linked to one carpooling


Carpooling contract is split in 5 main classes:
1. CreatingCarpooling
2. BookingCarpooling
3. ManagingServices
4. ManagingCarpooling: functions requiring (2) & (3) inheritances
5. Carpooling: mostly used to withdraw tokens and "getter" functions

MetaVariable class contains variables used by both contracts.
CarpoolingFactoryAbstract is used by Carpooling to add a service.

**Smart contract architecture:**

![This is an image](/images/carpooling-archi.png)


**Business model: incentivize offers sharing by apps**

To do margin, apps can increase slightly their price.

![This is an image](/images/carpooling-worflow-offer.png)

In this case, App1 shares an offer with a 1€ margin each time someone book a carpooling through the smart contract.

Other incentives can be imagined, e.g: giving access to more offers depending on the number of offers shared by the app. 
But it would limit the openness of the solution. 

## 3) Deploy and use the contracts

### a- Edit and test the contracts
To edit the contract, or test it localy, it requires:
- Solidity - 0.5.16 (solc-js)
- Truffle v5.4.18 (core: 5.4.18)
- Node v14.18.0
- Web3.js v1.5.3
- Ganache app
- npm: ganache-time-traveler, @truffle/hdwallet-provider

**Run tests:**

Start Ganache, make sure you have the right configurations that match between Ganache's app and "./truffle-config.js".
Then you can run the tests:
>truffle test ./test/carpooling.js

### b- Use functionality
You can deploy it on a blockchain using truffle or remix: https://remix-ide.readthedocs.io/en/latest/create_deploy.html

Deploy on dev network: Mumbai

>truffle deploy --network maticmumbai 

Deploy on main network:

>truffle deploy --network maticmainnet

**Create a carpoolingFactory:**

Deploy the factory contract "CarpoolingFactory" on an Ethereum compatible blockchain, e.g: Polygon (gas used: 4,854,473; cost ~0.33€).
Services can ask to be integrated into the safe repository, it is required to be used in carpooling.
Admin of carpoolingFactory (instance) can validate or not these services.

**Create a carpooling:**
Through carpoolingFactory, drivers create carpooling (child contract) using the function "createCarpooling" between two cities.
(gas used: 4,007,441; cost ~0.27€)

Users can :
- Book a carpooling using "makeBooking" with the number of seats desired and pay the right amount. (cost ~0.01€)
- Ask to add a service, as id check or insurance. They are not coded.
The funds are locked on the smart contract.

Then, we assume the services are listening to carpoolingFactory, to get notified if they have a pending request from users.
They have to answer it by validating or not the request. 
We assume in the design that to subscribe to it, we just need to register its address and lock the amount of token needed.

After that, anyone can call "validateBooking" and the passenger request is now accepted or he is refunded.

When the carpooling ride start, passengers can validate it. 
The driver and services can withdraw their payment in tokens.

**Main roles in the contract:**
![This is an image](/images/carpooling-roles.png)

## 4) Next steps

TODO:
- Find collaborators and contacts third parties: list their main needs
- Refactor the code:
 - Change the architecture into a single smart contract, it will reduce the cost to create a new carpooling from 0.38€ to ~0.02€. 
 - It should allow to create an itinary with more than 2 cities...
- Review the security of the code, optimization and do an audit
