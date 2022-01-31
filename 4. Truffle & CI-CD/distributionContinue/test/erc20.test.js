// erc20.test.js 
const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20 = artifacts.require('ERC20Token');
contract('ERC20', function (accounts) {
	const _name = 'ALYRA';
	const _symbol = 'ALY';
	const _initialsupply = new BN(1000);
	const _decimals = new BN(18);
	const owner = accounts[0];
	const recipient = accounts[1];
	const spender = accounts[2];

	beforeEach(async function () {
		this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
	});

	it('a un nom', async function () {
		expect(await this.ERC20Instance.name()).to.equal(_name);
	});
	it('a un symbole', async function () {
		expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
	});
	it('a une valeur décimal', async function () {
		expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
	});
	it('vérifie la balance du propriétaire du contrat', async function (){
		let balanceOwner = await this.ERC20Instance.balanceOf(owner);
		let totalSupply = await this.ERC20Instance.totalSupply();
		expect(balanceOwner).to.be.bignumber.equal(totalSupply);
	});
	it('vérifie si un transfer est bien effectué', async function (){
		let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
		let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
		let amount = new BN(10);

	// Question sur l'ordre dans l'appel des paramètres dans la doc OpenZeppelin c'est : Transfer(address from, address to, uint256 value)
		await this.ERC20Instance.transfer(recipient, amount, {from: owner});
		let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
		let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);

		expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
		expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
	});
	it('vérifie si approve fonctionne bien', async function(){
		//on doit vérifier que le compte qui approve, le contrat a le droit de ne dépenser que le montant qui a été approved de ce compte là
		let balanceSpenderBeforeApprove = await this.ERC20Instance.balanceOf(spender);
		let amountToApprove = new BN(5);
		
		await this.ERC20Instance.approve(spender, amountToApprove, {from: owner});
		
		let balanceSpenderAfterApprove = await this.ERC20Instance.balanceOf(spender);
		expect(balanceSpenderAfterApprove).to.be.bignumber.equal(balanceSpenderBeforeApprove);
		
		let amountAllowed = await this.ERC20Instance.allowance(owner, spender);
		expect(amountAllowed).to.be.bignumber.equal(amountToApprove);
	});
	it('vérifie si un approve est bien effectué', async function (){
		let allowanceSpenderBeforeApprove = await this.ERC20Instance.allowance(owner, spender);
		let amount = new BN(10);

		await this.ERC20Instance.approve(spender, amount, {from: owner});

		let allowanceSpenderAfterApprove = await this.ERC20Instance.allowance(owner, spender);

		expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(allowanceSpenderBeforeApprove.add(amount));
	});
	/* it('vérifier si transferFrom fonctionne bien', async function(){
		transferFrom(address sender, address recipient, uint256 amount) → bool
		let balanceSenderBeforeTransferFrom = await this.ERC20Instance.balanceOf(sender);
		let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
		let amount = new BN(10);
		
		//vérif que amount < allowance
		//transfer
		//vérif que transfer ok
		//vérif que montant déduit de allowance
		//Vérif que balances sont à jour
		
		await this.ERC20Instance.transfer(sender, recipient, amount);
		
		let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
		let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
	}); */
	it('vérifie si un transfer from est bien effectué', async function (){
		let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
		let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
		let amount = new BN(10);

		await this.ERC20Instance.approve(spender, amount, {from: owner});
		await this.ERC20Instance.transferFrom(owner, recipient, amount, {from: spender});

		let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
		let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);

		expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
		expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
	});
});
