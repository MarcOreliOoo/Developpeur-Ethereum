import React, { useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Navigation from "./components/Navigation";
import VotersComponent from "./components/VotersComponent";



export default function App() {
	
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
	//const [wfStatus,setStatus] = useState(9);
	
	
	const handleConnect = useCallback (async function () {
		console.log("useCallb");
		try {
			// Get network provider and web3 instance.			
			const web3 = await getWeb3();
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = VotingContract.networks[networkId];
			//const revertB = web3.eth.Contract.handleRevert.true;
			const contract = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address);
			
			//Getting Status of the workflow
			//const actualStatus = await contract.methods.wfStatus().call();
			
			// Set web3, accounts, contract to the state
			setWeb3(web3);
			setContract(contract);
			setAccounts(accounts);
			//setStatus(actualStatus);
			
		} catch (error) {
			// Catch any errors for any of the above operations
			alert(
				`Failed to load web3, accounts, or contract. Did you migrate the contract or install MetaMask? Check console for details.`,
			);
			console.error(error);
		}
	},[]);

	return (<Container fluid>
			<Navigation handleConnect={handleConnect} web3={web3} accounts={accounts} contract={contract} />
			<VotersComponent />

		</Container>
	);
}