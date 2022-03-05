const Dai = artifacts.require("Dai");
const MyDefiProject = artifacts.require("MyDefiProject");

module.exports = async function(deployer, _network, accounts) {
	await deployer.deploy(Dai);

	const dai = await Dai.deployed();
	await deployer.deploy(MyDefiProject, dai.address);

	const myDefiProject = await MyDefiProject.deployed();
	await dai.faucet(myDefiProject.address, 100);
	await myDefiProject.foo(accounts[1], 100);

	const balance0 = await dai.balanceOf(myDefiProject.address);
	const balance1 = await dai.balanceOf(accounts[1]);

	console.log(balance0.toString());
	console.log(balance1.toString());
	console.log(accounts[0]);
	console.log(accounts[1]);
};