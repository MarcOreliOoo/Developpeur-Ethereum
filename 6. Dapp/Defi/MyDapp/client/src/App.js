import React, { useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";
import Navigation from "./components/Navigation";
import AdminComponent from "./components/AdminComponent";
import VotersComponent from "./components/VotersComponent";
import EventComponent from "./components/EventComponent";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




export default function App() {
	
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([""]);
    const [contract, setContract] = useState(null);
	const [isOwner,setOwner] = useState(false);
	const [wfStatus, setStatus] = useState(0);
	
	const handleConnect = useCallback (async function () {
		console.log("useCallb");
		try {
			// Get network provider and web3 instance.			
			const web3 = await getWeb3();
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			//const accounts = await window.ethereum.request({method: 'eth_accounts'});

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = VotingContract.networks[networkId];
			//const revertB = web3.eth.Contract.handleRevert.true;
			const contract = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address);
			
			// Define if owner is connected
			const actualOwner = await contract.methods.owner().call();
			
			// Set web3, accounts, contract to the state
			setWeb3(web3);
			setContract(contract);
			setAccounts(accounts);
			if(actualOwner === accounts[0]){
				setOwner(true);
			}
			
		} catch (error) {
			// Catch any errors for any of the above operations
			alert(
				`Failed to load web3, accounts, or contract. Did you migrate the contract or install MetaMask? Check console for details.`,
			);
			console.error(error);
		}
	},[]);



	return (
		<Container fluid>
			<Navigation handleConnect={handleConnect} web3={web3} accounts={accounts} contract={contract} setStatus={setStatus} />
			<Container>
				<Row><Col>{isOwner && <AdminComponent web3={web3} accounts={accounts} contract={contract} isOwner={isOwner} wfStatus={wfStatus} />}</Col></Row>
				<Row><Col>{contract && <VotersComponent web3={web3} accounts={accounts} contract={contract} wfStatus={wfStatus}/>}</Col></Row>
				<Row><Col><EventComponent contract={contract} /></Col></Row>
			</Container>
		</Container>
	);
}