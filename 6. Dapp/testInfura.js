require('dotenv').config();

const Web3 = require('web3');
const rpcURL = `https://ropsten.infura.io/v3/${process.env.DB_INFURANODE}`;
const web3 = new Web3(rpcURL);

web3.eth.getBalance(process.env.DB_ADDRESS0, (err, wei) => { 
	balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
	console.log(balance);
});
