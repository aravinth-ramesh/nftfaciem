// const Migrations = artifacts.require("Migrations");

// module.exports = function (deployer) {
//  deployer.deploy(Migrations);
// };

const AvatarNFT = artifacts.require("AvatarNFT");

module.exports = async function (deployer) {
 await deployer.deploy(
  AvatarNFT,
  "Web3 NFT Faciem",
  "W3A",
  "0x12B260c8aE793c8D2729cEc3b04247A52b53963F"
 );
 const avatarNFT = await AvatarNFT.deployed();
};
