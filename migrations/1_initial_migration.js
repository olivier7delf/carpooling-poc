const CarpoolingFactory = artifacts.require("CarpoolingFactory");

module.exports = async function(deployer) {
  await deployer.deploy(CarpoolingFactory);
};
