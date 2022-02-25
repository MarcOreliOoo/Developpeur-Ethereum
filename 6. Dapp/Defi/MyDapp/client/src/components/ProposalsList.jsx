import React, { useState, useEffect } from "react";

export default function ProposalsList({contract}){
	const [proposalsList, setProposalsList] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	

	useEffect(function(){
		(async function(){
			if(contract){
				const response = await contract.methods.getProposalsList().call();
				setProposalsList(response);
				setLoading(false); //On a fini le chargement
			}
		})();
	},[]);

	if (loading){
		return 'Chargement...';
	}
	return <ul>
		{proposalsList.map(p => <li key={p.description}>{p.voteCount}</li>)}
	</ul>
}