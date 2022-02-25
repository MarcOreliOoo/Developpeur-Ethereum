import React, { useState, useEffect } from "react";

export default function VotersList({accounts, contract, isOwner}){
	const [votersList, setVotersList] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	

	useEffect(function(){
		(async function(){
			if(contract && isOwner){
				const response = await contract.methods.getWhitelist().call({from: accounts[0]});
				setVotersList(response);
				setLoading(false); //On a fini le chargement
				console.log(response)
			}
		})();
	},[]);

	if (loading){
		return 'Chargement...';
	}
	return <ul>
		{votersList.map(v => <li key={v}>{v}</li>)}
	</ul>
}