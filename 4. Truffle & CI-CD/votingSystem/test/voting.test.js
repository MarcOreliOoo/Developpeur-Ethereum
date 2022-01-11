// voting.test.js 
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
//const assertArrays = require('chai-arrays');
//expect.use(assertArrays);

const VOTING = artifacts.require('Voting');

contract('VOTING', function(accounts){
	
/*
    @admin : déploye le contrat
    1) L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    2) L'administrateur du vote commence la session d'enregistrement de la proposition.
    3) Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
    4) L'administrateur de vote met fin à la session d'enregistrement des propositions.
    5) L'administrateur du vote commence la session de vote.
    6) Les électeurs inscrits votent pour leurs propositions préférées.
    7) L'administrateur du vote met fin à la session de vote.
    8) L'administrateur du vote comptabilise les votes.
    9) Tout le monde peut vérifier les derniers détails de la proposition gagnante.
*/
	
	const owner = accounts[0];
	const voter1 = accounts[1];
	const voter2 = accounts[2];
	const voter3 = accounts[3];
	
	const wfRegisteringVoters = new BN(0);
	const wfProposalsRegistrationStarted = new BN(1);
	const wfProposalsRegistrationEnded = new BN(2);
	const wfVotingSessionStarted = new BN(3);
	const wfVotingSessionEnded = new BN(4);
	const wfVotesTallied = new BN(5);
	const wf = ["RegisteringVoters","ProposalsRegistrationStarted","ProposalsRegistrationEnded","VotingSessionStarted","VotingSessionEnded","VotesTallied"];
	
	const propositions = ["Propal A","Propal B","Propal C"];
	
	const votedForPA = new BN(0);
	const votedForPB = new BN(1);
	
	
	//Liste de fonctions utiles
	
	/**
	* @description : fill the proposals of the voting instance for voter1 -> proposal A,voter2 -> proposal B and proposal C
	* @Param votingContext : this.VOTINGInstance
	*/
 	async function setProposals(votingContext){
		let propal = [];
		let receipt = [];
		let x;
		for(let i = 0; i<propositions.length; i++){
			x = i<=1?i+1:2;
			receipt[i] = await votingContext.registeringProposal(propositions[i], {from:accounts[x]});
			//console.log("\t registering proposal : "+propositions[i]+" from accounts["+(x)+"]");
			propal[i] = await votingContext.proposals(i);
			expect(propal[i].description).to.be.equal(propositions[i]);
			expect(propal[i].voteCount).to.be.bignumber.equal(new BN(0));
			expectEvent(receipt[i], "ProposalRegistered", i+1 );
		}
	}
	
 	/*context("1) L\'administrateur du vote enregistre une liste blanche d\'électeurs identifiés par leur adresse Ethereum.", function() {
		
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
		});
		
		describe("====> If caller is not the admin", function(){
			it("It should revert for unique Ad", async function (){
				await expectRevert(this.VOTINGInstance.registeringUniqueAd(voter2, {from:voter1}), "Ownable: caller is not the owner");
			});
			it("It should revert for several Ad", async function (){
				await expectRevert(this.VOTINGInstance.registeringWL([voter2,voter3], {from:voter1}), "Ownable: caller is not the owner");
			});
		});
		
		describe("====> If caller is admin but not at the good stage", function(){
			it("It should revert", async function (){
				//Au lancement le status est par défaut RegisteringVoters = 0
				for(let i = 1; i < wf.length ; i++){
					await this.VOTINGInstance.nextStage({from:owner}); //Passage d'un autre status
					await expectRevert(this.VOTINGInstance.registeringUniqueAd(voter1, {from:owner}), "Function cannot be called at this time.");
					console.log("\t \t Expected revert for : "+ wf[i] + " " + await this.VOTINGInstance.wfStatus());
				}
			});
		});
		
		describe("====> If called is admin at the good stage then...", function(){
			it("it can add a voter and emits an event", async function (){
				let currentWfStatus = await this.VOTINGInstance.wfStatus();
				expect(currentWfStatus).to.be.bignumber.equal(wfRegisteringVoters);
				
				let currentNbOfVoter = await this.VOTINGInstance.totalVoter();
				expect(currentNbOfVoter).to.be.bignumber.equal(new BN(0));
				
				let receipt = await this.VOTINGInstance.registeringUniqueAd(voter1, {from:owner});
				currentNbOfVoter = await this.VOTINGInstance.totalVoter();
				
				expect(currentNbOfVoter).to.be.bignumber.equal(new BN(1));
				expectEvent(receipt, "VoterRegistered", {voterAddress: voter1});
			});
			it("it can add voters and emit events", async function (){
				let currentWfStatus = await this.VOTINGInstance.wfStatus();
				expect(currentWfStatus).to.be.bignumber.equal(wfRegisteringVoters);
				
				let currentNbOfVoter = await this.VOTINGInstance.totalVoter();
				expect(currentNbOfVoter).to.be.bignumber.equal(new BN(0));
				
				let receipt = await this.VOTINGInstance.registeringWL([voter1,voter2,voter3], {from:owner});

				currentNbOfVoter = await this.VOTINGInstance.totalVoter();
				expect(currentNbOfVoter).to.be.bignumber.equal(new BN(3));
				
				expectEvent(receipt, "VoterRegistered", {voterAddress: voter1});
				expectEvent(receipt, "VoterRegistered", {voterAddress: voter2});
				expectEvent(receipt, "VoterRegistered", {voterAddress: voter3});
			});
			it("if voter already in the list it should revert", async function (){
				await this.VOTINGInstance.registeringUniqueAd(voter1, {from:owner});
				await expectRevert(this.VOTINGInstance.registeringUniqueAd(voter1, {from:owner}), "Already registered in the whitelist my dear");
			});
		});
	});

	context("2) L'administrateur du vote commence la session d'enregistrement de la proposition.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
		});
		
		it("It should revert if caller is not the admin", async function (){
				await expectRevert(this.VOTINGInstance.startingProposalSession({from:voter1}), "Ownable: caller is not the owner");
		});
		it("It should revert if there is not enough address in the WL", async function (){
				await expectRevert(this.VOTINGInstance.startingProposalSession({from:owner}), "There is not enough address in the WL");
		});
		it("It should start the proposal session by changing status and emitting an event", async function(){
			await this.VOTINGInstance.registeringWL([voter1,voter2,voter3], {from:owner});
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfRegisteringVoters);
			
			const receipt = await this.VOTINGInstance.startingProposalSession({from:owner});
				
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfProposalsRegistrationStarted);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus} );
		});
	});
	
	
	context("3) Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({from: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
		});
		
		it("It should revert if we are not in the good stage", async function (){
				await expectRevert(this.VOTINGInstance.registeringProposal("Propal X",{from:owner}), "Function cannot be called at this time.");
		});
		it("It should revert if caller is not registred in the whitelist", async function (){
				await this.VOTINGInstance.startingProposalSession({from:owner});
				await expectRevert(this.VOTINGInstance.registeringProposal("Propal X",{from:voter3}), "You're not registred.");
		});
		it("It should save the proposals, check they have 0 vote, and emit events", async function(){
			await this.VOTINGInstance.startingProposalSession({from:owner});
			setProposals(this.VOTINGInstance);
		});
	});

	
	context("4) L'administrateur de vote met fin à la session d'enregistrement des propositions.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
		});
		
		it("It should revert if caller is not the admin", async function (){
			await expectRevert(this.VOTINGInstance.endingProposalSession({from:voter1}), "Ownable: caller is not the owner");
		});
		it("It should revert if it is not the good stage", async function (){
			await expectRevert(this.VOTINGInstance.endingProposalSession({from:owner}), "Function cannot be called at this time.");
		});
		it("It should revert if there is not enough proposals", async function (){
			await this.VOTINGInstance.startingProposalSession({from:owner});
			await expectRevert(this.VOTINGInstance.endingProposalSession({from:owner}), "Not enough proposition to start a vote");
		});
		it("It should end the proposal session by changing status and emitting an event", async function(){
			await this.VOTINGInstance.startingProposalSession({from:owner});
			await setProposals(this.VOTINGInstance);
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfProposalsRegistrationStarted);
			
			const receipt = await this.VOTINGInstance.endingProposalSession({from:owner});
				
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfProposalsRegistrationEnded);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus});
		});
	});

	
	context("5) L'administrateur du vote commence la session de vote.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
		});
		
		it("It should revert if caller is not the admin", async function (){
			await expectRevert(this.VOTINGInstance.startVotingSession({from:voter1}), "Ownable: caller is not the owner");
		});
		it("It should revert if it is not the good stage", async function (){
			await setProposals(this.VOTINGInstance);
			await expectRevert(this.VOTINGInstance.startVotingSession({from:owner}), "Function cannot be called at this time.");
		});
 		it("It should start the voting session and emit an event", async function(){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfProposalsRegistrationEnded);
	
			const receipt = await this.VOTINGInstance.startVotingSession({from:owner});
	
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfVotingSessionStarted);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus});		
		});
	});

	
	context("6) Les électeurs inscrits votent pour leurs propositions préférées.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
			//await setProposals(this.VOTINGInstance);
			//await this.VOTINGInstance.endingProposalSession({from:owner});
		});
		
		it("It should revert if it is not the good stage", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await expectRevert(this.VOTINGInstance.votingFor(votedForPA,{from:voter1}), "Function cannot be called at this time.");
		});
		it("It should revert if voter is not registred", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await expectRevert(this.VOTINGInstance.votingFor(votedForPA,{from:voter3}), "You're not registred.");
		});
		it("It increments voteCount for proposal voted", async function(){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			
			let propA0 = await this.VOTINGInstance.proposals(votedForPA);
			const nbVoteBeforeVoterVotes = new BN(propA0.voteCount);
			expect(nbVoteBeforeVoterVotes).to.be.bignumber.equal(new BN(0));
			
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			
			let propA1 = await this.VOTINGInstance.proposals(votedForPA);
			const nbVoteAfterVoterVotes = new BN(propA1.voteCount);
			expect(nbVoteAfterVoterVotes).to.be.bignumber.equal(nbVoteBeforeVoterVotes.add(new BN(1)));
		});
		it("It should revert if already voted", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			
			await expectRevert(this.VOTINGInstance.votingFor(votedForPB,{from:voter1}), "You already voted");
		});
		it("It should revert if voting for an inexistant proposal", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			
			await expectRevert(this.VOTINGInstance.votingFor(new BN(5),{from:voter1}), "Proposal wished doesnt exist");
		});
		it("It should emit an event", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			
			const receipt = await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			expectEvent(receipt, "Voted", {voter:voter1, proposalId:votedForPA});
		});
		
	});
	
	
	context("7) L'administrateur du vote met fin à la session de vote.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
		});
		
		it("It should revert if caller is not the admin", async function (){
			await expectRevert(this.VOTINGInstance.endVotingSession({from:voter1}), "Ownable: caller is not the owner");
		});
		it("It should revert if it is not the good stage", async function (){
			await expectRevert(this.VOTINGInstance.endVotingSession({from:owner}), "Function cannot be called at this time.");
		});
 		it("It should end the voting session and emit an event", async function(){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter2});
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfVotingSessionStarted);
	
			const receipt = await this.VOTINGInstance.endVotingSession({from:owner});
	
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfVotingSessionEnded);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus});		
		});
		
	});
	
	
	context("8) L'administrateur du vote comptabilise les votes.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
		});
		
		it("It should revert if caller is not the admin", async function (){
			await expectRevert(this.VOTINGInstance.countVote({from:voter1}), "Ownable: caller is not the owner");
		});
		it("It should revert if it is not the good stage", async function (){
			await expectRevert(this.VOTINGInstance.countVote({from:owner}), "Function cannot be called at this time.");
		});
 		it("It counts vote and emit an event", async function(){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter2});
			await this.VOTINGInstance.endVotingSession({from:owner});
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfVotingSessionEnded);
	
			const receipt = await this.VOTINGInstance.countVote({from:owner});
			const winner = await this.VOTINGInstance.winningProposalId();
			
			expect(winner).to.be.bignumber.equal(votedForPA);
	
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfVotesTallied);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus});		
		});
		
	});
	
	
	context("9) Tout le monde peut vérifier les derniers détails de la proposition gagnante.", function() {
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
		});
		
		it("It should revert if it is not the good stage", async function (){
			await expectRevert(this.VOTINGInstance.getWinner({from:voter1}), "Function cannot be called at this time.");
		});
 		it("It returns the winner and some details", async function(){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter2});
			await this.VOTINGInstance.endVotingSession({from:owner});
			await this.VOTINGInstance.countVote({from:owner});
			
			const {0:winnerID, 1:winnerDesc,  2:winnerCount} = await this.VOTINGInstance.getWinner({from:voter1});
			expect(winnerID).to.be.bignumber.equal(votedForPA);
			expect(winnerDesc).to.be.equal("Propal A");
			expect(winnerCount).to.be.bignumber.equal(new BN(2));
		});
		
	});
	*/
	
	context ("10) Réinitialise l'app de vote", function(){
		beforeEach(async function(){
			this.VOTINGInstance = await VOTING.new({form: owner});
			await this.VOTINGInstance.registeringWL([voter1,voter2], {from:owner});
			await this.VOTINGInstance.startingProposalSession({from:owner});
		});
		/*it("It should revert if caller is not the admin", async function (){
			await expectRevert(this.VOTINGInstance.reInitStatus({from:voter1}), "Ownable: caller is not the owner");
		});*/
		it("It should revert if it is not the good stage", async function (){
			await expectRevert(this.VOTINGInstance.reInitStatus({from:owner}), "Function cannot be called at this time.");
		});
		it("It changes the status of workflow", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter2});
			await this.VOTINGInstance.endVotingSession({from:owner});
			await this.VOTINGInstance.countVote({from:owner});
			
			const previousWfStatus = await this.VOTINGInstance.wfStatus();
			expect(previousWfStatus).to.be.bignumber.equal(wfVotesTallied);
			
			const receipt = await this.VOTINGInstance.reInitStatus({from:owner});
		
			const currentWfStatus = await this.VOTINGInstance.wfStatus();
			expect(currentWfStatus).to.be.bignumber.equal(wfRegisteringVoters);
			expectEvent(receipt, "WorkflowStatusChange", {previousStatus: previousWfStatus, newStatus: currentWfStatus} ); 
		});
		it("It delete all proposals, erase the whitelist, reinit winningProposal, et totalVoter", async function (){
			await setProposals(this.VOTINGInstance);
			await this.VOTINGInstance.endingProposalSession({from:owner});
			await this.VOTINGInstance.startVotingSession({from:owner});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter1});
			await this.VOTINGInstance.votingFor(votedForPA,{from:voter2});
			await this.VOTINGInstance.endVotingSession({from:owner});
			await this.VOTINGInstance.countVote({from:owner});
			await this.VOTINGInstance.reInitStatus({from:owner});
			
			//1 tout seul ok, plusieurs : erreur multiple done() call
			/*Error: done() called multiple times in test <Contract: VOTING 10) 
			Réinitialise l'app de vote It delete all proposals, erase the whitelist, reinit winningProposal, et totalVoter> 
			of file D:\Data\Documents\TruffleProjects\Developpeur-Ethereum-Template\4. Truffle & CI-CD\votingSystem\test\voting.test.js*/
			expect(await this.VOTINGInstance.proposals(0).description).to.be.undefined;
			expect(await this.VOTINGInstance.winningProposalId()).to.be.bignumber.equal(new BN(0));
			expect(await this.VOTINGInstance.totalVoter()).to.be.bignumber.equal(new BN(0));
		});
	});	
});