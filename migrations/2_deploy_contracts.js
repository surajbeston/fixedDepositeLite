const FixedDeposit= artifacts.require("FixedDeposit");

module.exports = function(deployer) {
  deployer.deploy(FixedDeposit);
};
