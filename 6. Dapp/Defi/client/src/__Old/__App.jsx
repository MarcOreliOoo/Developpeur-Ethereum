import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Container from 'react-bootstrap/Container';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import EventBox from "./__EventBox";
import NavBox from "./__NavBox";

class App extends Component {
  state = { whiteList:null, proposalsId:null, proposalsVotedBy:null, totalVoter:0, wfStatus:0, isOwner:false, web3: null, accounts: null, contract: null, eventList : []};

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
			const contract = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address,{handleRevert:true});

			// Set web3, accounts, and contract to the state, and whiteList, proposalId, proposalsVotedBy
			const whiteList = new Set();
			const proposalsId = new Set();
			const proposalsVotedBy = new Set();
			
			
			// Define the stage
			const actualStatus = parseInt(await contract.methods.wfStatus().call(),10);
			console.log("Actual Status : "+actualStatus);
			
			// Define number of voter
			const nbOfVoter = await contract.methods.totalVoter().call();
			console.log("nbOfVoter : "+nbOfVoter);
			
			// Define if owner is connected
			const actualOwner = await contract.methods.owner().call();
			if(actualOwner === accounts[0]){
				this.isOwner = true;
			}
			
			this.setState({ web3, accounts, contract, whiteList, proposalsId, proposalsVotedBy, wfStatus:actualStatus, totalVoter:nbOfVoter, isOwner:this.isOwner});
			
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
			`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	/*<EventBox state={this.state} parentCallBack={this.handleCallback} />
	 handleCallback = (childData)=> { 
		this.setState({whiteList:childData.whiteList, proposalsId:childData.aProposalsId, proposalsVotedBy:childData.aProposalsVotedBy});
	} */

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<NavBox state={this.state} />
				<Container fluid>
					<EventBox state={this.state} />
				</Container>
			</div>
		);
	}
}

export default App;
