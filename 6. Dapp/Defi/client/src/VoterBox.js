import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

class VoterBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;
	}

	componentDidMount = async () => {
		//this.setState({wfStatus:1});
		this.displayProposals();
	}
	


	registeringProposal = async () => {
		const { accounts, contract, proposals } = this.state;
		
		let proposalToRegister = this.proposal.value;
		await contract.methods.registeringProposal(proposalToRegister).send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
		proposals.push({proposalToRegister});
		this.setState({proposals});
		this.proposal.value = "";
    };

	displayProposals = async () => {
		//const { proposals } = this.state;
		let proposals=["propal 1","propal 2","propal 3"];
		this.setState({proposals:proposals});
		
	};


    render() {
		let proposalDisplay = this.state.proposals.map((a,index) => <ListGroup.Item key={index}>{a}</ListGroup.Item>);
        return ( 
            <div className="VoterBox">
				<h3 className="text-center">Voter Box {this.state.wfStatus}</h3>
				<hr></hr>
				<br></br>

				{this.state.wfStatus === 1 &&
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Card style={{ width: '20rem' }}>
						<Card.Header><strong>Emettre une proposition</strong></Card.Header>
						<Card.Body>
							<Form.Group>
								<Form.Control type="text" id="proposal" ref={(input) => { this.proposal = input }}/>
							</Form.Group>{' '}
							<Button onClick={ this.registeringProposal } variant="dark" > Go </Button>
						</Card.Body>
					</Card>
				</div>
				}

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Card style={{ width: '20rem' }}>
						<Card.Header><strong>Liste des propositions</strong></Card.Header>
						<Card.Body>
							<ListGroup>
								{proposalDisplay}
							</ListGroup>
						</Card.Body>
					</Card>
				</div>

			</div>
		);
    }
}

export default VoterBox;