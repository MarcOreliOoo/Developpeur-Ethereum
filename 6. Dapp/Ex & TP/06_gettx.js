require('dotenv').config();

const Web3 = require('web3');
const rpcURL = `https://ropsten.infura.io/v3/${process.env.DB_INFURANODE}`;
const web3 = new Web3(rpcURL);

const ABI = [ { "inputs": [ { "internalType": "uint256", "name": "x", "type": "uint256" } ], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true } ];
const SSaddress = "0xdcEAaD9763846dc02377C561a3C1cF089a0426B0";

const simpleStorage = new web3.eth.Contract(ABI, SSaddress);
simpleStorage.methods.get().call((err, data) => {
	console.log(data);
}); 