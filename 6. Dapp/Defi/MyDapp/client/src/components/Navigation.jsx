import React, { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';



export default function Navigation({handleConnect,web3,accounts,contract}){
	const [wfStatus,setStatus] = useState(99);

	useEffect(function(){
		(async function(){
			if(contract){
				const actualStatus = await contract.methods.wfStatus().call();
				setStatus(actualStatus);
			}		
		})();
	},[contract]);
	

	return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
		<Container>
		<Navbar.Brand href="#home">Voting System</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		{web3===null ? <button className="btn btn-primary ms-auto" onClick={handleConnect}>Connect</button> :
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav>
					<Navbar.Text>
						Actual status : {wfStatus}
					</Navbar.Text>
				</Nav>
				<Nav className="ms-auto">
					<Navbar.Text>
						Connected with : {accounts[0]}
					</Navbar.Text>
				</Nav>
			</Navbar.Collapse>
		}
		</Container>
	</Navbar>
}