import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

class NavBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;

		this.enumContent = [
			"RegisteringVoters",
			"ProposalsRegistrationStarted",
			"ProposalsRegistrationEnded",
			"VotingSessionStarted",
			"VotingSessionEnded",
			"VotesTallied"
		];
	}

	componentDidMount = async () => {
		//setInterval(this.getAllEvents(), 1000);
		//this.getWfStatus();
	};

	getWfStatus = async () => {
/* 		const { wfStatus } = this.state;
		switch(wfStatus){
			case 0 :
			  await contract.methods.proposalSessionBegin().send({ from: accounts[0] });
			  break;
			case 1 :
			  await contract.methods.proposalSessionEnded().send({ from: accounts[0] });
			  break;
			case 2 :   
			  await contract.methods.votingSessionStarted().send({ from: accounts[0] });
			  break;     
			case 3 :
			  await contract.methods.votingSessionEnded().send({ from: accounts[0] });
			  break;  
			case 4 :
			  await contract.methods.votesTallied().send({ from: accounts[0] });
			  break;  
			default :
			  break;
		  }
		this.setState({eventList:eventList}); */
	}


    render() {
        return ( 
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Voting System</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							{this.enumContent.map((a) => <Nav.Link>{a}</Nav.Link>)}
							<Navbar.Text>
								<span className="navConnected">Connected with : {this.state.accounts[0]}</span>
							</Navbar.Text>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
    }
}

export default NavBox;