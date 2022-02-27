import React, { useState, useEffect } from "react";
import CardComponent from "../utils/CardComponent";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


export default function ProposalsList({accounts, contract, wfStatus}){
	const [proposalsList, setProposalsList] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger

	useEffect(function(){
		(async function(){
			if(contract){
				const response = await contract.methods.getProposalsList().call();
				setProposalsList(response);
				setLoading(false);
			}
		})();
	},[proposalsList]);

	const votingFor = async () => {
		if(contract){
			await contract.methods.votingFor().send({from: accounts[0]})
			.on("receipt",function(receipt){
				console.log(receipt);
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
	let cpt = 0;

	return <>
		<CardComponent title="List of proposals">
			<Table striped bordered hover size="sm" responsive="sm" >
			<thead>
				<tr>
					<th>@</th>
					<th>Proposal description</th>
					{wfStatus == 3 && <th>Proposal voting</th>}
					{wfStatus == 4 && <th>Proposal count</th>}
				</tr>
			</thead>
			<tbody>
				{proposalsList.map(p =>
					<tr key={p}>
						<td>{cpt++}</td>
						<td>{p.description}</td>
						{wfStatus == 3 && 
							<td className="d-grid gap-2"><Button onClick={votingFor} type="submit" variant="secondary" size="sm"> Vote </Button></td>
						}
						{wfStatus == 4 && <td>{p.count}</td>}
					</tr>
				)}
			</tbody>
			</Table>
		</CardComponent>
	</>
}