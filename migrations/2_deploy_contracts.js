// const Carpooling = artifacts.require("Carpooling");

// // 0, "nantes","bordeaux",3,20,1636630368,0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,0,false

// module.exports = async function(deployer) {
//   var accs = await web3.eth.getAccounts();
//   var conflictOwner = accs[0];
//   var userCertificationAddress = accs[7];

//   await deployer.deploy(Carpooling, 0, "nantes","bordeaux",3,20,1636630368,conflictOwner,0,false);
// };

const CarpoolingFactory = artifacts.require("CarpoolingFactory");

// 0, "nantes","bordeaux",3,20,1636630368,0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,0,false

module.exports = async function(deployer) {
  var accs = await web3.eth.getAccounts();
  var conflictOwner = accs[0];
  // CarpoolingFactory.defaults({
  //   from: accs[0],
  //   gas: 47123880000,
  //   gasPrice: 10000000
  // })
  await deployer.deploy(CarpoolingFactory);
};
