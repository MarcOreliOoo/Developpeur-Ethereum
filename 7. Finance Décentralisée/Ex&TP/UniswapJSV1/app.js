const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');

require('dotenv').config();

//ChainId correspond au réseau sur lequel on va se connecter
// Fetcher permet de récupérer les données d'Uniswap

//const chainId = ChainId.MAINNET;
//const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI address mainnet

const chainId = ChainId.KOVAN;
const tokenAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'; // DAI address kovan

//Noeud kovan via ID projet Infura
const rpcURL = `https://kovan.infura.io/v3/${process.env.DB_INFURANODE}`;
const privateKey = Buffer.from(process.env.DB_PRIVKEY0, 'hex');

/**
 * 
 * Attention : tout le déroulé se fait avec Uniswap V2 !!
 * 
 */
const init = async () => {
	
	//Initialisation du dai
	const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
	
	// Uniswap permet l’utilisation directe de WETH. Il suffit de préciser sur quel réseau
	const weth = WETH[chainId];

	//Création d'une nouvelle paire sur le market avec le Fetcher
	const pair = await Fetcher.fetchPairData(dai, weth);

	//Pour créer un nouveau router en se basant sur notre paire et faciliter les interactions, il suffit d’initier un nouveau router grâce à la librairie Route d’Uniswap
	const route = new Route([pair], weth);
	//Affiche combien de DAI pour 1 WETH
	console.log("route.midPrice : "+route.midPrice.toSignificant(6));
	//Affiche combien de WETH pour 1 DAI
	console.log("route.midPrice.invert)() : "+route.midPrice.invert().toSignificant(6));
	
	//Pour le "vrai" prix à l’instant t, il faut créer un "trade" en spécifiant un amount de token (en wei).
	const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
	//The execution price represents the average DAI/WETH price for this trade
	console.log("trade.executionPrice : "+trade.executionPrice.toSignificant(6));
	//the next mid price, if the trade were to complete successfully before the reserves changed
	console.log("trade.nextMidPrice : "+trade.nextMidPrice.toSignificant(6));

	const slippageTolerance = new Percent('50', '10000'); // tolérance prix 50 bips = 0.050%

	const _tokenIn = dai;
	const _tokenOut = weth;
	const _fee = 500; // 0.05%
	const _recipient = "";
	const _deadline = Math.floor(Date.now() / 1000) + 60 * 20; // le délai après lequel le trade n’est plus valable 
	const _amountIn = trade.minimumAmountOut(slippageTolerance).raw; // minimum des tokens à récupérer avec une tolérance de 0.050%
	const _amountOutMinimum = 0; //Mettre à 0 de manière naive (ce sera forcément plus). En vrai, utiliser un oracle pour déterminer cette valeur précisément.
	const _sqrtPriceLimitX96 = 0; // Assurer le swap au montant exact - limite de prix que la pool doit respecter

	const value = trade.inputAmount.raw; // la valeur des ethers à envoyer 

	let i = 0;

	const provider = ethers.getDefaultProvider('kovan', {infura: rpcURL}); // utilisation du provider infura pour effectuer une transaction  
	const signer = new ethers.Wallet(privateKey); // récupérer son wallet grâce au private key
	const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 
	
	const uniswapABI = [
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "tokenIn",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "tokenOut",
						"type": "address"
					},
					{
						"internalType": "uint24",
						"name": "fee",
						"type": "uint24"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amountIn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amountOutMinimum",
						"type": "uint256"
					},
					{
						"internalType": "uint160",
						"name": "sqrtPriceLimitX96",
						"type": "uint160"
					}
				],
				"internalType": "struct ISwapRouter.ExactInputSingleParams",
				"name": "params",
				"type": "tuple"
			}
		],
		"name": "exactInputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	}
	]
	
	// Récupère le smart contract d’Uniswap avec l’adress du smart contract et l’ABI.
	// Grâce à ethers on peut passer la fonction et la structure à utiliser en solidity
	const uniswap = new ethers.Contract('0xE592427A0AEce92De3Edee1F18E0157C05861564', uniswapABI, account);
	//0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D

	
	
	const tx = await uniswap.exactInputSingle({
		tokenIn: _tokenIn,
		tokenOut: _tokenOut,
		fee: _fee,
		recipient: _recipient,
		deadline: _deadline,
		amountIn: _amountIn,
		amountOutMinimum: _amountOutMinimum,
		sqrtPriceLimitX96: _sqrtPriceLimitX96,
	},{ value, gasPrice: 20e9 }); // envoyer la transaction avec les bons paramètres 
	console.log(`Transaction hash: ${tx.hash}`); // afficher le hash de la transaction 

	const receipt = await tx.wait(); // récupérer la transaction receipt 
	console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}
 
init();
