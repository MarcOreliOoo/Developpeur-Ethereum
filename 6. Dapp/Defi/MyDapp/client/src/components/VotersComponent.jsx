import React, { useState, useEffect } from "react";
import ProposalsList from "./ProposalsList";

export default function VotersComponent({web3, accounts, contract, wfStatus}){
	const [proposalsList, setProposalsList] = useState([]);
	//create a proposal

	//Proposal List
	
	//voteForAProposal

	//seeWinner

	return <>
		<ProposalsList contract={contract}/>
	</>
}