import React, { useState } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../getWeb3";

export function LoginForm() {
	const [data,setData] = useState({});

	const handleConnect = async function (){
		try {
			setData(null);

			// Get network provider and web3 instance.			
			const web3 = await getWeb3();
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = VotingContract.networks[networkId];
			//const revertB = web3.eth.Contract.handleRevert.true;
			const contract = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address);

			setData({web3, accounts, contract});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
			`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	}

	return <>
	<div className="container mt-1">
		<button className="btn btn-primary" onClick={handleConnect}>Connect</button>
	</div></>
}