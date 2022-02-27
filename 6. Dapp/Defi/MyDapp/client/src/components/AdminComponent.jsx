import React, { useState, useRef, useEffect, useCallback } from "react";
import VotersList from "./VotersList";
import EventComponent from "./EventComponent";
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

/*	const endingProposalSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.endingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	const startVotingSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.startVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	const endVotingSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.endVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    }

    const countVote = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.countVote().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    }
*/

	return(
		<div className="container mt-4">
		<Row>
			{error && <AlertComponent>{error}</AlertComponent>}
		</Row>
		<Row>
			<Col>
				{wfStatus == 0 && isOwner && 
				<CardComponent title="Whitelist an address" >
					<Form ref={formAddress}>
						<FormField name="address" label="Address :" placeholder="0x..." />
					</Form>
					<Button onClick={registeringVoters} type="submit" variant="dark" size="sm"> Go </Button>
				</CardComponent>
				}
			</Col>
			<Col>
				{wfStatus == 0 && isOwner && 
				<CardComponent title="Start proposal session" >
					<Button onClick={startingProposalSession} type="submit" variant="dark" size="sm"> Go </Button>
				</CardComponent>
				}
			</Col>
			<Col md="auto">
				<VotersList accounts={accounts} contract={contract} isOwner={isOwner} />
			</Col>
		</Row>
		<Row>
			<EventComponent contract={contract} />
		</Row>
		</div>
	);
}