require('dotenv').config();

var Tx = require('ethereumjs-tx').Transaction;

const Web3 = require('web3');
const rpcURL = `https://ropsten.infura.io/v3/${process.env.DB_INFURANODE}`;
const web3 = new Web3(rpcURL);

const ABI = [
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const SSaddress = '0xdcEAaD9763846dc02377C561a3C1cF089a0426B0'; //Addres of SimpleStorage contract
const account1 = process.env.DB_ADDRESS0;
const privateKey1 = Buffer.from(process.env.DB_PRIVKEY0, 'hex');


web3.eth.getTransactionCount(account1, (err, txCount) => {
	const simpleStorage = new web3.eth.Contract(ABI, SSaddress);
	const data=simpleStorage.methods.set(18).encodeABI();

	//Objet de transaction
	const txObject = {
		nonce:    web3.utils.toHex(txCount),
		gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
		gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')*1.60),
		to: SSaddress,
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
	});
	
/* 	const getData=simpleStorage.methods.get()
	web3.eth.getBalance("0x6B9084732B0f209fca6b5581E787898aba81B377", (err, wei) => { 
		balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
		console.log(balance);
	});
 */
});
