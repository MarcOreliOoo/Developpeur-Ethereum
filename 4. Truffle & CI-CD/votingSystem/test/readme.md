
# voting.test.js

### Objectifs
* Réalisation de tests unitaires du smart contract voting.sol
* Utilisation par la pratique des framework Mocha & Chai
* Utilisation des briques applicatives @openzeppelin/test-helpers

### Principes employés
On parcourt l'ensemble des fonctions du contrat, et pour chaque fonction :
* Un bloc `context` permet de définir le contenu de la liste de test unitaire associée à cette fonction. Certains contextes peuvent avoir des blocs describe pour étoffer la sortie de test.

```
context("1) L\'administrateur du vote enregistre une liste blanche d\'électeurs identifiés par leur adresse Ethereum.", function() {
  ...
});
```
* Chacun des `context` est suivi par un `beforeEach` avec les instructions de bases lancées avant chaque test unitaire `it`
```
beforeEach(async function(){
  this.VOTINGInstance = await VOTING.new({form: owner});
  await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
  await this.VOTINGInstance.startingProposalSession({from:owner});
});
```
* Pour chaque fonction sont testées en début les `modifier`
** Est-ce bien l'admin qui appelle telle fonction ?
** Suis-je au bon stage pour lancer telle fonction ?
```it("It should revert if caller is not the admin", async function (){
  await expectRevert(this.VOTINGInstance.countVote({from:voter1}), "Ownable: caller is not the owner");
});
```
* Trois types d'expectation sont utilisées :
   - Pour l'attente d'une valeur donnée : `expect`
   - Pour "écouter" un événement emit par le contrat : `expectEvent` 
   - Pour catch les retours d'assertions via des `modifier` ou des `require` : `expectRevert`

###
