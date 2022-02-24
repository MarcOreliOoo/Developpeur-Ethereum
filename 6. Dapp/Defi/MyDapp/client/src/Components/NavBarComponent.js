import React, { useState, useEffect, useCallback } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../getWeb3";


export default function NavBarComponent() {
	//const [status, setStatus] = useState(1);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
	
	const Connect = useCallback (async function () {
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
			// Set web3, accounts, contract to the state
			setWeb3(web3);
			setContract(contract);
			setAccounts(accounts);
		} catch (error) {
			// Catch any errors for any of the above operations
			alert(
				`Failed to load web3, accounts, or contract. Did you migrate the contract or install MetaMask? Check console for details.`,
			);
			console.error(error);
		}
	},[]);

	useEffect( () => {
        console.log(accounts[0]);
    }, [accounts]);

	function Status({contract}){
		const [status,setStatus] = useState(1);
		const ctr = {contract};
		// Define the stage
		useEffect(() => {
			(async function(){
				const s = parseInt(await ctr.methods.wfStatus().call(),10);
				setStatus(s);
			})();
		},[status])
		//if(status !== undefined){
			return (
				<Navbar.Text>
					Actual status : {status}
				</Navbar.Text>
			);
		//} else return <></>		
	}


	return (
	<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
		<Container>
		<Navbar.Brand href="#home">Voting System</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		
		<Nav className="me-auto">
			<Status contract={contract} />
		</Nav>
		
		<Navbar.Collapse id="responsive-navbar-nav me-auto">
			<Nav className="ms-auto">
				{web3===null ? <button className="btn btn-primary" onClick={Connect}>Connect</button> : 
				<Navbar.Text>
					Connected with : {accounts[0]}
				</Navbar.Text>}
			</Nav>
		</Navbar.Collapse>
		
		</Container>
	</Navbar>
	);
}
