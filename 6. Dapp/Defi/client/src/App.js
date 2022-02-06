import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";


import AdminBox from "./AdminBox";
import EventBox from "./EventBox";
import VoterBox from "./VoterBox";
import NavBox from "./NavBox";

class App extends Component {
  state = { proposals: [], whiteList: [], totalVoter:0, wfStatus:0, isOwner:false, web3: null, accounts: null, contract: null, eventList : []};



	componentDidMount = async () => {
	try {
		// Get network provider and web3 instance.
		const web3 = await getWeb3();

		// Use web3 to get the user's accounts.
		const accounts = await web3.eth.getAccounts();

		// Get the contract instance.
		const networkId = await web3.eth.net.getId();
		const deployedNetwork = VotingContract.networks[networkId];
		const instance = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address,);

		// Set web3, accounts, and contract to the state, and then proceed with an
		// example of interacting with the contract's methods.
		this.setState({ web3, accounts, contract: instance }, this.defineIfOwner);

	} catch (error) {
		// Catch any errors for any of the above operations.
		alert(
		  `Failed to load web3, accounts, or contract. Check console for details.`,
		);
		console.error(error);
	}
	};

	/**
	 * Définit si le compte connecté est owner du SC ou non
	 */
	defineIfOwner = async () => {
		const { accounts, contract } = this.state;
		let actualOwner = await contract.methods.owner().call();
		if(actualOwner === accounts[0]){
			console.log("YOU ARE THE OWNNNNNNNNNNNNNNNNNNNNNER");
			this.setState({isOwner:true}, this.defineStage);
		} else {
			this.defineStage();
		}	
	};

	/**
	 * Définit à quel stage sommes-nous dans le SC
	 */
	defineStage = async () => {
		const { contract } = this.state;
		let actualStatus = await contract.methods.wfStatus().call();
		console.log("wf : ",actualStatus);
		this.setState({wfStatus:actualStatus}, this.defineInit);
	};
	
	
	defineInit = async () => {
		const { contract } = this.state;

		const _totalVoter = await contract.methods.totalVoter().call();
		//const _proposals = await contract.methods.getProposals().call();

		//Màj state de l'App
		this.setState({totalVoter:_totalVoter});
	};


	

	render() {
	if (!this.state.web3) {
		return <div>Loading Web3, accounts, and contract...</div>;
	}
	return (
		<div className="App">
			<NavBox state={this.state} />
			<div className="App-body">
				<div>
					EventBox sur la gauche tout le long rétractable ?
					<EventBox state={this.state} />
				</div>
				<div>AdminBox ici
					{(this.state.isOwner) &&
						<AdminBox state={this.state} />	
					}
				</div>
				<div>VoterBox ici
						<VoterBox state={this.state} />	
				</div>
			</div>
			
			<div>The nb of voter is: {this.state.totalVoter}</div>
			
			{/* <div>The proposals are: {this.state.proposals}</div> */}
			
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={{ width: '20rem' }}>
				<Card.Header><strong>Liste des comptes autorisés</strong></Card.Header>
				<Card.Body>
					<ListGroup variant="flush">
					<ListGroup.Item>
						<Table striped bordered hover>
						<thead>
							<tr>
							<th>@</th>
							</tr>
						</thead>
						<tbody>
							<tr><td>{this.state.totalVoter}</td></tr>
							<tr><td>{this.state.totalVoter}</td></tr>
						</tbody>
						</Table>
					</ListGroup.Item>
					</ListGroup>
				</Card.Body>
				</Card>
			</div>
		</div>
	);
	}
}

export default App;
