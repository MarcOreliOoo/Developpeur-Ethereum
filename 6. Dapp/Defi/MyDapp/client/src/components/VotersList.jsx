import React, { useState, useEffect } from "react";
import CardComponent from "../utils/CardComponent";
import ListGroup from "react-bootstrap/ListGroup";
import Button from 'react-bootstrap/Button';

export default function VotersList({accounts, contract, isOwner}){
	const [votersList, setVotersList] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	

	useEffect(function(){
		(async function(){
			if(contract && isOwner){
				const response = await contract.methods.getWhitelist().call({from: accounts[0]});
				setVotersList(response);
				setLoading(false); //On a fini le chargement
			}
		})();
	},[votersList]);

	if (loading){
		return 'Chargement...';
	}
	return <CardComponent title="Whitelist of Voters">
		<ListGroup variant="flush">
			{votersList.map(v =>
				<ListGroup.Item key={v}>{v}
				<Button variant="dark" size="sm">Vote</Button>
				</ListGroup.Item>
			)}
		</ListGroup>
	</CardComponent>
	
}