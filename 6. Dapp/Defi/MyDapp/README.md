# Objectif
La Dapp Voting doit permettre :
- l’enregistrement d’une liste blanche d'électeurs. 
- à l'administrateur de commencer la session d'enregistrement de la proposition.
- aux électeurs inscrits d’enregistrer leurs propositions.
- à l'administrateur de mettre fin à la session d'enregistrement des propositions.
- à l'administrateur de commencer la session de vote.
- aux électeurs inscrits de voter pour leurs propositions préférées.
- à l'administrateur de mettre fin à la session de vote.
- à l'administrateur de comptabiliser les votes.
- à tout le monde de consulter le résultat.
[Ajouter :] - Ré initialiser l'application

# Arborescence projet
## Smart contract
Disponible sous _contracts/Voting.sol_
## Front 
Disponible sous _client/_ fait en react et bootstrap pour css
## Exécution de la DApp  
Pour lancer la DApp, il faut passer par quelques étapes :
0. Installation package du back : ouvrir une console et à la racine du projet : _npm install_
1. Déploiement : ouvrir une console et à la racine du projet : _truffle migrate --reset [option : --network ropsten]_
2. Installation package du front : ouvrir une console et sous le dossier _client/_, _npm install_
NB : les étapes 0 et 2 supposent que package.json du repo soit dispo sur chacun des deux emplacements.
3. Exécution : Sous le dossier client _npm run start_

# Amélioration du front possible
- Usage des contextes pour éviter une répétion du passage de propriétés de parents à fils entres les composants
- Usage de cookie pour éviter de se reconnecter lorsque le compte est connecté
- Gestion des actions multiples avec un reducer pour plus de propreté  et de clareté
- autres ?

# Réflexion sur la construction du front
L'usage des classes a été supprimées pour ne passer que par des composants fonctions et des hooks associés.
Ci-dessous une piste de réflexion utilisée au moment de la réalisation du Defi pour réfléchir sur le passage d'information/propriétés entres composants
`App
- liste de propositions
- liste de voters
- isOwner
- status
	- Navigation
		- Connection
			- <connecté ? 0x: Se connecter
			- <isOwner
			- < status d'où on en est
		- Menu
			- Voters
				- nb de voters
				- Voter
					- enregistré ?
					- a voté ?
					- a poté pour ?
					- < créer une proposition
					- > voir liste de propositions
			- Propositions
				- < Liste de propositions
					- > voter pour
			- Admin
				- enregistrer participant
				- next*
				- comptabiliser les votes
		- Event`				
