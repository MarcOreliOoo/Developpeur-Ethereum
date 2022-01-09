// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
contract OldVoting is Ownable{
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public wfStatus = WorkflowStatus.RegisteringVoters;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    mapping (address => Voter) private comptesWL;
    Proposal[] public proposals;
    
    uint public winningProposalId;
    uint public nbVote = 0;
    uint public totalVoter = 0;    

    
    modifier atStage(WorkflowStatus _status) {
        require(wfStatus == _status, "Function cannot be called at this time.");
        _;
    }

    modifier senderRegistred(){
        require(comptesWL[msg.sender].isRegistered, "You're not registred.");
        _;
    }

    function nextStage() internal {
        //If we already are in Stage of VotesTallied, then it's a start over
        WorkflowStatus newStatus = (wfStatus != WorkflowStatus.VotesTallied) ? WorkflowStatus(uint(wfStatus) + 1) : WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(wfStatus,newStatus);
        wfStatus = newStatus;
    }

    /*
    *
    *   1) L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    *
    */
    function registeringUniqueAd(address _address) public onlyOwner atStage(WorkflowStatus.RegisteringVoters){
        require(!comptesWL[_address].isRegistered,"Already registered in the whitelist my dear");
        //Création d'un Voter via Structure & Màj Whitelist address => struct
        Voter memory vote;
        vote.isRegistered = true;
        vote.hasVoted = false;
        comptesWL[_address] = vote;
        totalVoter++;
        //Event électeur enregistré
        emit VoterRegistered(_address);
    }

    /*
    *
    *   1) L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    *
    */
    function registeringWL(address[] memory arrayWL) public onlyOwner atStage(WorkflowStatus.RegisteringVoters){
        Voter memory vote;
        for(uint i=0;i<arrayWL.length;i++){
            if(!comptesWL[arrayWL[i]].isRegistered){
                vote = Voter(true,false,0);
                comptesWL[arrayWL[i]] = vote;
                totalVoter++;
                emit VoterRegistered(arrayWL[i]);
            }
        }
    }

    /* 
    *
    * 2) L'administrateur du vote commence la session d'enregistrement de la proposition.
    *
    */
    function startingProposalSession() public onlyOwner atStage(WorkflowStatus.RegisteringVoters){
        require(totalVoter > 0,"There is not enough address in the WL");
        //WL terminée, on passe à l'étape d'apès
        nextStage();
    }

    /* 
    *
    *   3) Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
    *
    */
    function registeringProposal(string memory _description) public atStage(WorkflowStatus.ProposalsRegistrationStarted) senderRegistred{
        proposals.push(Proposal(_description,0));
        emit ProposalRegistered(proposals.length);
    }

    /* 
    *
    *   4) L'administrateur de vote met fin à la session d'enregistrement des propositions.
    *
    */
    function endingProposalSession() public onlyOwner atStage(WorkflowStatus.ProposalsRegistrationStarted){
        //Proposal session over but... do we have at least one vote ?
        require(proposals.length >= 1,"Not enough proposition to start a vote");
        nextStage();
    }

    /* 
    *
    *   5) L'administrateur du vote commence la session de vote.
    *
    */
    function startVotingSession() public onlyOwner atStage(WorkflowStatus.ProposalsRegistrationEnded){
        nextStage();
    }

    /* 
    *
    *   6) Les électeurs inscrits votent pour leurs propositions préférées.
    *
    */
    function votingFor(uint _proposalId) public atStage(WorkflowStatus.VotingSessionStarted) senderRegistred{
        //N'a pas déjà voté
        require(!comptesWL[msg.sender].hasVoted,"You already voted");        
        //Vote pour une propal existante
        require(proposals.length >= _proposalId,"Proposal wished doesnt exist");

        //Mise à jour du "à voter"
        comptesWL[msg.sender].hasVoted = true;
        comptesWL[msg.sender].votedProposalId = _proposalId;

        //Mise à jour du count de vote pour la proposition votée
        proposals[_proposalId].voteCount++;
        //Le nb de vote total augmente
        nbVote++;

        //emit
        emit Voted(msg.sender,_proposalId);
    }


    /* 
    *
    *   7) L'administrateur du vote met fin à la session de vote.
    *
    */
    function endVotingSession() public onlyOwner atStage(WorkflowStatus.VotingSessionStarted){
        require(nbVote > 0,"We need at least one vote");
        nextStage();
    }


    /* 
    *
    *   8) L'administrateur du vote comptabilise les votes.
    *
    */
    function countVote() public onlyOwner atStage(WorkflowStatus.VotingSessionEnded){
        uint maxCount=0;
        for(uint i = 0;i<proposals.length;i++){
            if(proposals[i].voteCount > maxCount){
                maxCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        nextStage();
    }

    /* 
    *
    *   9) Tout le monde peut vérifier les derniers détails de la proposition gagnante.
    *
    */
    function getWinner() public view atStage(WorkflowStatus.VotesTallied) returns(uint, string memory, uint){
        return (winningProposalId,proposals[winningProposalId].description,proposals[winningProposalId].voteCount);
    }


    /*
    *   10) Réinitialise l'app de vote
    */
    function reInitStatus() public onlyOwner atStage(WorkflowStatus.VotesTallied) {
        nextStage();
        
        //Re init la liste des proposals, la liste des WL, la winningProposal, le totalVoter etc.)
    }

}
