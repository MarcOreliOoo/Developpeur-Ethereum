import React, { useState, useEffect } from "react";
import CardComponent from "../utils/CardComponent";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


export default function ProposalsList({accounts, contract, wfStatus, isRegistred, hasVoted, setHasVoted}){
	const [proposalsList, setProposalsList] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	const [disable,setDisable] = useState(false);

	useEffect(function(){
		(async function(){
			if(contract){
				const response = await contract.methods.getProposalsList().call();
				setProposalsList(response);
				setLoading(false);
			}
		})();
	},[proposalsList]);

	useEffect(function(){
		setDisable(hasVoted);
	},[hasVoted])

	const votingFor = async (id) => {
		if(contract && isRegistred && !hasVoted && proposalsList.length >= id){
			await contract.methods.votingFor(id).send({from: accounts[0]})
			.on("receipt",function(receipt){
				console.log(receipt);
				setDisable(true);
				setHasVoted(true);
			})
			.on("error",function(error){
				console.log(error);
			});
		}
	};

	if (loading){
		return 'Chargement...';
	}
	if(proposalsList.length==0){
		return <></>
	}

	return <>
		<CardComponent title="List of proposals">
			<Table striped bordered hover size="sm" responsive="sm" >
			<thead>
				<tr>
					<th>#</th>
					<th>Proposal description</th>
					{wfStatus == 3 && <th>Proposal voting</th>}
					{wfStatus == 4 && <th>Proposal count</th>}
				</tr>
			</thead>
			<tbody>
				{proposalsList.map(p => 
					<tr key={proposalsList.indexOf(p)+1}>
						<Proposal id={proposalsList.indexOf(p)+1} proposal={p} wfStatus={wfStatus} onVote={votingFor} disable={disable}/>
					</tr>
				)}
			</tbody>
			</Table>
		</CardComponent>
	</>
}


function Proposal({id, proposal, wfStatus, onVote, disable}){

	const handleVoting = async function(e){
		e.preventDefault();
		await onVote(id);
	}

	return <>
			<td>{id}</td>
			<td>{proposal.description}</td>
			{wfStatus == 3 && 
				<td className="d-grid gap-2">
					<Button onClick={handleVoting} variant="secondary" size="sm" disabled={disable}> Vote </Button>
				</td>
			}
			{wfStatus == 4 && <td>{proposal.count}</td>}
	</>
}