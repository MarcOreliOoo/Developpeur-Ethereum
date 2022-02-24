import React, { useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';



export default function Navigation({handleConnect,web3,accounts,contract,wfStatus,setStatus}){
	useEffect(function(){
		(async function(){
			if(contract){
				const actualStatus = await contract.methods.wfStatus().call();
				setStatus(actualStatus);
			}		
		})();
	},[]);
	

	return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
		<Container>
		<Navbar.Brand href="#home">Voting System</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		<Navbar.Collapse id="responsive-navbar-nav me-auto">
			{web3===null ? <button className="btn btn-primary" onClick={handleConnect}>Connect</button> :
			<Nav className="me-auto">
				<Navbar.Text>
					{wfStatus}
				</Navbar.Text>
				<Navbar.Text>
					Connected with : {accounts[0]}
				</Navbar.Text>
			</Nav>}
		</Navbar.Collapse>
		</Container>
	</Navbar>
}