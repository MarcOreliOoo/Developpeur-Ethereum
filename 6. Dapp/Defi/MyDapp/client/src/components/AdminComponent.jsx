import React, { useState, useRef, useEffect, useCallback } from "react";
import VotersList from "./VotersList";
import FormField from "../utils/FormField";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function AdminComponent({web3, accounts, contract, isOwner}){
	const formAddress = useRef(null);

	const handleRegisteringVoters = async () => {
		const voterToregistred = formAddress.current.address.value;
		if(voterToregistred.trim() !== '' && web3.utils.isAddress(voterToregistred)){
			await contract.methods.registeringUniqueAd(voterToregistred).send({from: accounts[0]})
			.on("receipt",function(receipt){
				console.log(receipt);
			})
			.on("error",function(error, receipt){
				console.log(error);
				console.log(receipt);
			});
		}
	};
    
/*
	const startingProposalSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.startingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	const endingProposalSession = async () => {
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
		<Row>
		<Col>
			<Card>
				<Card.Header as="h5">Autoriser un nouveau compte</Card.Header>
				<Card.Body>
					<Form ref={formAddress}>
						<FormField name="address" label="Address :" placeholder="0x..." />
					</Form>
					<Button onClick={handleRegisteringVoters} type="submit" variant="dark"> Go </Button>
				</Card.Body>
			</Card>
		</Col>
		<Col>
			<VotersList accounts={accounts} contract={contract} isOwner={isOwner} />
		</Col>
		</Row>
	);
}



