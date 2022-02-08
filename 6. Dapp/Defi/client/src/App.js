import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";


import AdminBox from "./AdminBox";
import EventBox from "./EventBox";
import VoterBox from "./VoterBox";
import NavBox from "./NavBox";

class App extends Component {
  state = { whiteList:null, proposalsId:[], proposalsVotedBy:[], totalVoter:0, wfStatus:0, isOwner:false, web3: null, accounts: null, contract: null, eventList : []};



	componentDidMount = async () => {
	try {
		// Get network provider and web3 instance.
		const web3 = await getWeb3();

		// Use web3 to get the user's accounts.
		const accounts = await web3.eth.getAccounts();

		// Get the contract instance.
		const networkId = await web3.eth.net.getId();
		const deployedNetwork = VotingContract.networks[networkId];
		//const revertB = web3.eth.Contract.handleRevert.true;
		const instance = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address,{handleRevert:true});

		// Set web3, accounts, and contract to the state, and then proceed with an
		// example of interacting with the contract's methods.
		
		const whiteList = new Set();
		
		this.setState({ web3, accounts, contract: instance, whiteList});
		this.defineIfOwner();
		this.defineStage();
		this.defineInit();

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
			this.setState({isOwner:true});
		}
	};

	/**
	 * Définit à quel stage sommes-nous dans le SC
	 */
	defineStage = async () => {
		const { contract } = this.state;
		let actualStatus = await contract.methods.wfStatus().call();
		console.log("wf : ",actualStatus);
		this.setState({wfStatus:actualStatus});
	};
	
	
	defineInit = async () => {
		const { contract } = this.state;
		let nbOfVoter = await contract.methods.totalVoter().call();
		this.setState({totalVoter:nbOfVoter});
	};

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<NavBox state={this.state} />
				<Container fluid>
				<Row>
					<Col md="auto">
						<EventBox state={this.state} />
					</Col>
					<Col>
						<div className="App-body-body">
							{(this.state.isOwner) &&
								<AdminBox state={this.state} />	
							}
							<VoterBox state={this.state} />	
						</div>
					</Col>
				</Row>
				</Container>
			</div>
		);
	}
}

export default App;
