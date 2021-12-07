Carpooling: How blockchain profits both ecology and economy

Introduction
Blockchain is often criticized for its high energy consumption [1], and for having limited application outside of finance. The issue of high energy consumption is one that is recognized and is currently being tackled by the blockchain community. In particular, blockchains based on Proof of Stake (PoS), such as Ethereum 2. The second criticism reflects the fact that the most well-known applications of blockchain have been in finance, rather than any inherent limitations of the technology to other applications contexts. This article proposes an energy-efficient application of blockchain to a concrete problem: decentralized carpooling. The proposed blockchain aims to improve on existing carpooling services based on three criteria: prices, number of offers and integration with other services.

 TODO :This leads to a reflection on the development of the blockchain ecosystem with regard to the multiplication of this type of initiative and the expected potential.
Contents
What problems does the carpooling industry have ?
How does blockchain help ?
How does our blockchain based solution work ?
Does it improve the service, is there Innovation ?
From theory to application using a smart contract 
1. Does carpooling industry have issues ?
Carpooling is a very efficient mean to reduce pollution, save money and sometime meet people. It has becoming more and more democratic during the last 15 years, especially in France (TODO find numbers 2005–2021), with a lot of innovations at the beginning. In the meantime, a single company has taken the monopoly on the market, which lead to some issues: innovation decreases which limit the massive service’s adoption.

Why this monopoly ? 
Because a carpooling app needs to propose many carpoolings in order to satisfy the demand: the passenger will go to a competitors if they’re not enough carpoolings and the drivers too if there are not enough passengers.

2. How does blockchain help ?
Here came a solution; having all the carpoolings in a public shared ledger, with a secure, legal, easy and efficient way to interact with it: using smart contract and a blockchain. It allows many new actors to enter the scene, this lead to cheaper travels and more innovations.

Secure:Blockchain: Polygon is a blockchain based on PoS, closed to be a layer 2 scaling solutions built on Ethereum. It uses Ethereum for validator staking and periodical finality checkpoints and it has a market cap over 10 Billions €.

sqscSmart Contract: funds will be handle by the contract, and only the passengers, the driver and the conflict owner can transfer tokens, respecting some rules

Legal:

Insurances: each carpooling must have a Civil insurance in case of accident, the driver can use its own or add an other one using the smart contract.
Conflicts: what happens if a passenger arrive too late ? Or if the driver don’t show up but do claim the money ? It’s one of the worst case because it can be automated to do big frauds 💸… This will be solved thanks to the contract when the situation is simple, but if it’s not, money will be locked and redistributed by the conflict owner declared by the driver.
Dangerous users: a service will provide user checking: id, number...
Easy:

For the clients: he uses carpooling App/website, he don’t see the difference, nor every options. Apps apply their defaults settings.
For the carpooling App: developers can operate directly on the blockchain, and manage all the complexity.
It can interact with others Ethereum layer 2 blockchains and thus facilitates the adoption by actors/developers.
Efficient:

Interaction with Polygon blockchain is quick, less than 2 secondes to create a carpooling and reading data is almost instantaneous.
Interactions are quite cheap: calls (actions to see info in the ledger) are free and transactions (action to modify the ledger) cost ~0.01 €.
Consumption: PoS as Polygon needs about 100 000 time less energy than PoW as Bitcoin. (https://blog.polygon.technology/polygon-the-eco-friendly-blockchain-scaling-ethereum-bbdd52201ad/)
 3. How does it work ?
Let’s assumes users will continue to use apps to do carpooling and let’s have a look at the process.

A carpooling app App1 has in its setting to use Insurance1, which is a service available thanks to a smart contract deployed by an insurance company.

The driver creates as usual a carpooling (34€) through App1. 
App1 creates it on the blockchain, set the price at 35€ to make 1€ profits, add the mandatory insurance Ins1 (+2€). 
Final price on the blockchain, including insurance is 37€ and App1 publish it on its website at 37€.

App2 retrieves it to offer it on its website at 37€. Same for App3 but at 44€ .


1 seat is booked on each app and everything go well.

 — As a result:

App1 receives from the contract 35*3=105€, sends 34*3=102€ to the driver and keeps a margin of 3€ .
Ins1 receives from the contract 3*2=6€
App2 increases its offer
App3 (market leader) makes a margin of 7€
Then, market rules will tend to minimize margin at equal services offered and the customer will be the final winner.
Furthermore, App1 could have put a higher price on the blockchain, and keep its price on the website at 37€ to get a competitive advantage.

Reality: Mark and his daughter Sasha want to go from Paris to Biarritz in carpooling, about 800km (500miles).
Today (Nov 2021) on the leading carpooling app, it costs ~44€ by passenger : 34€ for the driver and 10€ for the app: driver’s initial price has been increased by 30% ! Mark takes his car.
4. Does it improve the service, is there Innovation ?
This new model allows to increase the number of offers and lower the prices. But it might even be better, indeed, with a more open market, each competitor and even outsiders can propose new services just by creating a smart contract.


Each service based on a smart contract can be seen as a lego brick, then, through a carpooling app, the user could select each brick he needs to get the best experience.

Fictives services examples:

End to end trip: a smart contract books a cheap “taxi”, or directly proposes to the carpooling driver to drop you home for a predefined amount.
On site trip helper: it proposes a car/bike sharing making your life easy. Any bulky material could be proposed on site.
Main services characteristics to make them efficient and competitive: 

Bring value
Easy, fast, automated interactions/validation
Open: available to other services than carpooling
With this: Mark added few services when he was booking and they are now dropped to Biarritz’s motorway exit (N°4), they find there a car waiting for them, with 2 surfs on the roof and a beginner camper equipment, holidays can start !
5. From theory to application using a smart contract
 — Does a smart contract is enough to create a decentralized carpooling ?

Yes and No… 

Yes: Technically, one smart contract is enough to create the open carpooling ledger, the next paragraph deals with it. 
No: People’s adoption requires an entire ecosystem: the lego’s bricks. Else, the apps trying to use the ledger will be facing many issues, prices will increase and the result will be mitigate.

 — Smart contract characteristics:

In order to validate its feasibility, I coded a smart contract using Solidity language that creates and manages carpoolings. 
Here is my Github if you are interested in the details and/or in the code which uses solidity 0.5.16 and has some functional tests to validate user journeys using Ganache, Truffle, OpenZeppling and Chai.


Usually, a driver will create a carpooling (1), with the option checkId (2) and select an insurance (3).
Then, the passenger booked a seat (4) and the smart contract check its Id (5).
During the trip, passenger validate it (6) and after X hours, apps and insurance contracts withdraw their money (7) and App1 paid the driver.
Apps services interactions exists but are not drawn here to avoid confusion and misinformation.


The cost of one transaction is around 0.01€ on Polygon and the whole process to create, book, validate a carpooling and withdraw tokens for 4 users should not exceed 50 transactions and so on 0.50€. 
Apps have to propose solution regarding the conversion required between local currency and cryptocurrency (i.e: MATIC) in order order to do transactions. They can charge the customer or manage to have some treasury in MATIC.
The solution can be economically viable.

Conclusion:
Some blockchains allow to provide an infinity of open services, improving the fairness of the market, for a low price, which can directly benefit to entrepreneurs, customers and people. The carpooling is one of these services and the freedom offered by blockchain might allow it to become more affordable, to increase the quality of the customer experience and the number of users, leading to a virtuous circle. It might even affect other services as car sharing and equipment sharing... It allows to create consumption market for the ecologically conscious consumer.

 — — 

Sources:
https://polygon.technology/lightpaper-polygon.pdf
https://github.com/maticnetwork/whitepaper



[1] https://link.springer.com/article/10.1007/s12599-020-00656-x — 60 and 125 TWh per year for Bitcoin



Next steps:
ICO customer oriented: it could reward people using the service as driver or passenger. To avoid speculation, it might integrate a tokens amount restriction hold by user and burn some tokens every X months so that only users stay there.
Example for user 1:
newAmount = (1+a1) * AmountUsed + (1-b1) * AmountUnused, a1 and b1 close to 0…