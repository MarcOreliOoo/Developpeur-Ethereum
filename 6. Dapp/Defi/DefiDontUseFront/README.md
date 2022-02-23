0. mkdir <FolderName>
1. cd <FolderName> puis truffle init
2. CC .env et truffle-config.js (+Opt LICENSE, .gitattributes)
3. npm install web3
4. npm install ethereumjs-tx
5. npm install --save dotenv
	Si on part de zéro : 
	5.1. créer un fichier .env avec les données privées 
	5.2. vérifier que console.log(process.env) renvoie les var d'env + tester une variable bidon
	5.3. mettre les vraies variables et surtout ajouter ce fichier dans .gitignore
6. npm install --save @truffle/hdwallet-provider