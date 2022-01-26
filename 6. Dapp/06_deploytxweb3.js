require('dotenv').config();


var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

//Noeud ropsten via ID projet Infura
const rpcURL = `https://ropsten.infura.io/v3/${process.env.DB_INFURANODE}`;
const web3 = new Web3(rpcURL);

const account1 = process.env.DB_ADDRESS0;
const privateKey1 = Buffer.from(process.env.DB_PRIVKEY0, 'hex');


/*
Pour déployer un smart contract via web3.js, il faut passer par les trois étapes suivantes :

1- Construire un objet de transaction
2- Signer la transaction
3- Envoyer la transaction
*/ 

// Deploy the contract
web3.eth.getTransactionCount(account1, (err, txCount) => {
	//Bytecode from remix once compiled contract
	const data = '0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea2646970667358221220621b004348182090993209e1ac240f4afda9ce0872d638761289ca63d69be72264736f6c634300060b0033';
	//const data = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212206c6dff0f8a1123a816e855982e32c28b2428cb1dc4979a58b7d863579f573ec364736f6c63430008090033';


	//Objet de transaction
	const txObject = {
		nonce:    web3.utils.toHex(txCount),
		gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
		gasPrice: web3.utils.toHex(web3.utils.toWei('100', 'gwei')*1.60),
		data: data
	}

	//Signature de la transaction
	var tx = new Tx(txObject, {'chain':'ropsten'});
	tx.sign(privateKey1);

	const serializedTx = tx.serialize();
	const raw = '0x' + serializedTx.toString('hex');

	//Envoi de la transaction
	web3.eth.sendSignedTransaction(raw, (err, txHash) => {
		console.log('txHash:', txHash, 'err:', err);
		// Use this txHash to find the contract on Etherscan!
		var receipt = web3.eth.getTransactionReceipt(txHash).then(console.log);
	});
});
