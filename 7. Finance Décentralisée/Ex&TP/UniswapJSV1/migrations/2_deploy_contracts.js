//const Dai = artifacts.require("Dai");
const MyDefiProject = artifacts.require("MyDefiProject");

module.exports = async function(deployer, _network, accounts) {
//	await deployer.deploy(Dai);

//	const dai = await Dai.deployed();
	const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
	await deployer.deploy(MyDefiProject, daiAddress);

	//const myDefiProject = await MyDefiProject.deployed();
	//await dai.faucet(myDefiProject.address, 100);
	//await myDefiProject.foo(accounts[1], 100);

	//const balance0 = await dai.balanceOf(myDefiProject.address);
	//const balance1 = await dai.balanceOf(accounts[0]);

	//console.log(accounts[0]);
};