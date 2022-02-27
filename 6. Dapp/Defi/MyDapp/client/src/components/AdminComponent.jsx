import React, { useState, useRef } from "react";
import VotersList from "./VotersList";
import FormField from "../utils/FormField";
import CardComponent from "../utils/CardComponent";
import AlertComponent from "../utils/AlertComponent";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




export default function AdminComponent({web3, accounts, contract, isOwner, wfStatus}){
	const formAddress = useRef(null);
	const [error,setError] = useState(null);

	const registeringVoters = async () => {
		const voterToregistred = formAddress.current.address.value;
		if(voterToregistred.trim() !== '' && web3.utils.isAddress(voterToregistred)){
			await contract.methods.registeringUniqueAd(voterToregistred).send({from: accounts[0], handleRevert:true})
			.on("receipt",function(receipt){
				formAddress.current.address.value = "";
			})
			.on("error",function(error){
				const parsedError = JSON.stringify(error.message);
				if (parsedError.includes('revert ')) {
					setError(parsedError);
				}
			});
		}
	};
    
	const startingProposalSession = async () => {
		await contract.methods.startingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error){
			setError(error);
		});
    };

	const endingProposalSession = async () => {
		await contract.methods.endingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error){
			setError(error);
		});
    };

	const startVotingSession = async () => {
		await contract.methods.startVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error){
			setError(error);
		});
    };

	const endVotingSession = async () => {
		await contract.methods.endVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error){
			setError(error);
		});
    };

	const countVote = async () => {
		await contract.methods.countVote().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error){
			setError(error);
		});
    };

	return(
		<div className="container mt-4">
		<Row>
			{error && <AlertComponent>{error}</AlertComponent>}
		</Row>
		<Row>
			{wfStatus == 0 && isOwner &&
				<Col>
					<CardComponent title="Whitelist an address" >
						<Form ref={formAddress}>
							<FormField name="address" label="Address :" placeholder="0x..." />
						</Form>
						<div className="d-grid gap-2"><Button onClick={registeringVoters} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			{wfStatus == 0 && isOwner && 
				<Col>
					<CardComponent title="Start proposal session" >
						<div className="d-grid gap-2"><Button onClick={startingProposalSession} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			{wfStatus == 1 && isOwner && 
				<Col>
					<CardComponent title="End proposal session" >
						<div className="d-grid gap-2"><Button onClick={endingProposalSession} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			{wfStatus == 2 && isOwner &&
				<Col>
					<CardComponent title="Start voting session" >
						<div className="d-grid gap-2"><Button onClick={startVotingSession} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			{wfStatus == 3 && isOwner &&
				<Col>
					<CardComponent title="End voting session" >
						<div className="d-grid gap-2"><Button onClick={endVotingSession} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			{wfStatus == 4 && isOwner && 
				<Col>
					<CardComponent title="Count vote" >
						<div className="d-grid gap-2"><Button onClick={countVote} type="submit" variant="secondary" size="sm"> Go </Button></div>
					</CardComponent>
				</Col>
			}
			<Col md="auto">
				<VotersList accounts={accounts} contract={contract} isOwner={isOwner} />
			</Col>
		</Row>
		</div>
	);
}