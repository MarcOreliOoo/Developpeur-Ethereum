import React, { useState, useRef } from "react";
import ProposalsList from "./ProposalsList";
import FormField from "../utils/FormField";
import CardComponent from "../utils/CardComponent";
import AlertComponent from "../utils/AlertComponent";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function VotersComponent({web3, accounts, contract, wfStatus}){
	const formProposalCreation = useRef(null);
	const [error,setError] = useState(null);
	
	//create a proposal
	const registeringProposal = async () => {
		const proposalToRegistred = formProposalCreation.current.proposal.value;
		if(proposalToRegistred.trim() !== ''){
			await contract.methods.registeringProposal(proposalToRegistred).send({from: accounts[0]})
			.on("receipt",function(receipt){
				formProposalCreation.current.proposal.value = "";
			})
			.on("error",function(error){
				const parsedError = JSON.stringify(error.message);
				if (parsedError.includes('revert ')) {
					setError(parsedError);
				}
			});
		}
	};

	//seeWinner

	return <>
		<div className="container mt-4">
			<Row>
				{error && <AlertComponent>{error}</AlertComponent>}
			</Row>
			<Row>
				{wfStatus == 1 &&
					<Col>
						<CardComponent title="Make your proposal" >
							<Form ref={formProposalCreation}>
								<FormField name="proposal" label="Proposal :" placeholder="I would like to..." />
							</Form>
							<Button onClick={registeringProposal} type="submit" variant="secondary" size="sm"> Go </Button>
						</CardComponent>
					</Col>
				}
				<Col md="auto">
					<ProposalsList accounts={accounts} contract={contract} wfStatus={wfStatus} />
				</Col>
			</Row>
		</div>
	</>
}