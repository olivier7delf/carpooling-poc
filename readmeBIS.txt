What if blockchain could foster eco-friendly initiatives
//
Carpooling: How blockchain profits both ecology and economy

Carpooling: How blockchain integrate ecology in consumption

Carpooling: How blockchain foster economy in an eco-friendly manner
Carpooling: How blockchain foster economy in an eco-friendly manner

Decentralized Carpooling: How Blockchain foster eco-friendly initiatives
Carpooling: How Blockchain foster eco-friendly initiatives
Carpooling: Blockchain as foster eco-friendly initiatives


What if the Blockchain could foster eco-friendly initiatives
What if Blockchain could foster eco-friendly initiatives
How Blockchain could foster eco-friendly initiatives
Blockchain as an ecological and economical booster: Carpooling


//
Blockchain is often criticized for its energy consumption and its applications other than finance are unknown to many people. The energy issue is being tackle down currently by many blockchains as Ethereum 2 (PoS) and has already been solved by many others ones. The second one is an observation that for many people, blockchains are speculations things that regards only financial industry.
This article aims to proposed a solution for common people, economically viable, which respect ecology: a decentralized carpooling. It comes with an attempt to improved it regarding 3 criteria : offers, price, services. This leads to a reflection on the development of the blockchain ecosystem with regard to the multiplication of this type of initiative and the expected potential.
Plan
Does carpooling industry have issues ?
How Blockchain solves it ?
How is it gonna work ?
Does it improve the service ? Is there Innovation ?
From theory to application: just a smart contract ? 
 - Does carpooling industry have issues ?
Carpooling is a very efficient mean to reduce pollution, save money and sometime meet people. It has becoming more and more democratic during the last 15 years, especially in France (TODO find numbers 2005–2021), with a lot of innovations at the beginning. In the meantime, a single company has taken the monopoly on the market, which lead to some issues: innovation decreases which limit the massive service's adoption.
Why this  monopoly ? 
Because a carpooling app needs to propose many carpoolings in order to satisfy the demand:  the passenger will go to a competitors if they're not enough carpoolings and the drivers too if there are not enough passengers.
 - How Blockchain solves it ?
Here came a solution; having all the carpoolings in a public shared ledger, with a secure, legal, easy and efficient way to interact with it: using smart contract and a blockchain. It allows many new actors to enter the scene, this lead to cheaper travels and more innovations.
layer-two scaling solutions built on Ethereum
Secure:
Blockchain: Polygon is a blockchain based on proof of stack (PoS), closed to be a layer 2 scaling solutions built on Ethereum. It uses Ethereum for validator staking and periodical finality checkpoints and it has a market cap over 10 Billions €.
Smart Contract: funds will be handle by the contract, and only the passengers, the driver and the conflict owner can transfer tokens, respecting some rules.

Legal:
Insurances: each carpooling must have a Civil insurance in case of accident, the driver can use its own or add an other one using the smart contract.
Conflicts: what happens if a passenger arrive too late ? Or if the driver don't show up but do claim the money ? It's one of the worst case because it can be automated to do big frauds… This will be solved thanks to the contract when the situation is simple, but if it's not, money will be locked and redistributed by the conflict owner declared by the driver.
Dangerous users: a service will provide user checking: id, number...

Easy:
For the clients: he uses carpooling App/website, he don't see the difference, nor every options. Apps apply their defaults settings.
For the carpooling App: developers can operate directly on the blockchain, and manage all the complexity.
It can interact with others Ethereum layer 2 blockchains and thus facilitates the adoption by actors/developers.

Efficient:
Interaction with Polygon is quick, less than 2 secondes to create a carpooling and reading data is almost instantaneous.
Interactions are quite cheap: calls (actions to see info in the ledger) are free and transactions (action to modify the ledger) cost ~0.01 €.
Consumption: PoS as Polygon needs about 100 000 time less energy than PoW as Bitcoin. (https://blog.polygon.technology/polygon-the-eco-friendly-blockchain-scaling-ethereum-bbdd52201ad/)

 - How is it gonna work ?
Let's assumes users will continue to use apps to do carpooling and let's have a look at the process.
A carpooling app App1 have in its setting to use Insurance1, which is a service available thanks to a smart contract deployed by an insurance company.
The driver creates as usual a carpooling (36€) through App1. 
App1 creates it directly on the blockchain, set the price at 38€ to make 1€ profits, add the mandatory insurance Ins1 (+3€) and a conflictOwner that is App1. 
Final price on the blockchain, including insurance is 40€.
App2 retrieves it to offer it on its website at 40 €. Same for App3 but at 61€ which just sends 40€ to the contract, making 21€ benefits.
1 seat is booked on each app and everything go well.
As a result:
App1 receives from the contract 37*3=111€, sends 108€ to the driver and keeps 3€
Ins1 receives from the contract 3*3=9€
App2 increases its offer
App3 (market leader) makes a benefit of 21€

Then, market rules will tend to minimize margin at equal services offered and the customer will be the final winner.
Reality: Mark and his daughter Sasha want to go from Paris to Biarritz in carpooling, about 800km (500miles).
Today (Nov 2021) on the leading carpooling app, it costs ~61€ by passenger : 36€ for the driver and 25€ for the app: driver's initial price has been increased by 70% ! Mark takes his car.
 - Does it improve the service ? Is there Innovation ?
This new model allows to increase the number of offers and lower the prices. But it might even be better, indeed, with a more open market, each competitor and even outsiders can propose new services just by creating a smart contract.
Each service based on a smart contract can be seen as a lego brick, then, through a carpooling app, the user could select each brick he needs to get the best experience.
Fictives services examples:
End to end trip: a smart contract books a cheap "taxi", or directly proposes to the carpooling driver to drop you home for a predefined amount.
On site trip helper: it proposes a car/bike sharing making your life easy. Any bulky material could be proposed on site.
…

Main services characteristics to make them efficient and competitive: 
Bring value
Easy and fast interactions/validation
As much automated as possible 
Open: available to other services than carpooling

With this: Mark added few services when he was booking and they are now dropped to Biarritz's motorway exit (N°4), they find there a car waiting for them, with 2 surfs on the roof and a beginner camper equipment, holidays can start !
 - From theory to application: just a smart contract ?
Yes and No… 
Yes: One smart contract is enough to create the open carpooling ledger, the next paragraph deals with it. 
No: People's adoption requires an entire ecosystem: the lego's bricks. Else, the app trying to use the ledger will be facing many issues, prices will increase and the result will be mitigate.
In order to validate its feasibility, I coded a smart contract using Solidity language that creates and manages carpoolings. 
Here is my Github if you are interested in the details and/or in the code which uses solidity 0.5.16 and has some functional tests to validate user journeys using Ganache, Truffle, OpenZeppling and Chai.
Main characteristics of it:
A driver can create a carpooling and manage/add its settings: 
Basic: destination, date, price, seats number
New: 
- Insurance, conflict managing, id checking, booking automatically.
- He can directly add any services having a smart contract. 
Why adding it directly in the carpooling booking ? 
It facilitates refunding in case of cancelation/issue/conflict.

He can modify the number of seats available and cancel the carpooling if needed.
The passenger can reserve a place, choose an additional insurance, cancel a reservation for personal reasons, validate that the carpooling has taken place in order to allow the driver to access his money or invalidate a carpooling that could lead to a conflict if the owner refuses to reimburse people.
In case of conflict, the conflict owner decides how to split money between users and services, according to some predefined rules.
The cost of one transaction is around 0.01€ on Polygon and the whole process to create, book and validate a carpooling for 4 users should not exceed 50 transactions and so on 0.50€. 
Apps have to propose solution regarding the conversion required between local currency and cryptocurrency (i.e: MATIC) in order order to do transactions. They can charge the customer or manage to have some treasury in MATIC.
The solution can be economically viable.
 - Conclusion:
Some blockchains allow to provide an infinity of open services, improving the fairness of the market, for a low price, which can directly benefit to entrepreneurs, customers and people. The carpooling is one of these services and the freedom offered by blockchain might allow it to become more affordable, to increase the quality of the customer experience and the number of users, leading to a virtuous circle. It might even affect other services as car sharing and equipment sharing... To some extent, 
it can make consumption more eco-friendly. 
it can make consumption more human-centered and eco-friendly.
(environmentally friendly???)
Sources:
https://polygon.technology/lightpaper-polygon.pdf
https://github.com/maticnetwork/whitepaper