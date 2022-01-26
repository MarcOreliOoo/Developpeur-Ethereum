0. truffle init, dépot du contract dans ./contracts...

1. npm install --save dotenv
1.1. créer un fichier .env avec les données privées
1.2. vérifier que console.log(process.env) renvoie les var d'env + tester une variable bidon
1.3. mettre les vraies variables et surtout ajouter ce fichier dans .gitignore

2. npm install --save @truffle/hdwallet-provider

3. truffle-config.js avec paramétrage du network souhaité :
	const HDWalletProvider = require('@truffle/hdwallet-provider');
	require('dotenv').config();
	[...]
	ropsten: {
		provider: function() {
			return new HDWalletProvider(`${process.env.DB_MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.DB_INFURANODE}`)
		},
		network_id: 3,
		gas: 5500000        // Ropsten has a lower block limit than mainnet
	}

3. Dans ./migrations créer 2_deploy_contracts.js
	const simpleStorage = artifacts.require("SimpleStorage");

	module.exports = function (deployer) {
	  deployer.deploy(simpleStorage);
	};

4. truffle deploy --network ropsten
   Deploying 'SimpleStorage'
   -------------------------
   > transaction hash:    0x02829012f6bf620cee53c66646b1aecd01627a36fd7dc045c9bb3192451044be
   > Blocks: 3            Seconds: 16
   > contract address:    0x08940DaD57807fE767D27c7233DEEec8d82fcA8c
   > block number:        11878106
   > block timestamp:     1643231921
   > account:             0x6B9084732B0f209fca6b5581E787898aba81B377
   > balance:             2.498780748142895272
   > gas used:            92727 (0x16a37)
   > gas price:           11.419138861 gwei
   > value sent:          0 ETH
   > total cost:          0.001058862489163947 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001058862489163947 ETH

5. on vérifie avec etherscan la transac associé au compte :
https://ropsten.etherscan.io/address/0x6b9084732b0f209fca6b5581e787898aba81b377

