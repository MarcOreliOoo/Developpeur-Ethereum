import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class AdminBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;
	}

	componentDidMount = async () => {
		this.setState({wfStatus:1});
	}

    registeringUniqueAd = async () => {
		const { accounts, contract } = this.state;
		let voterToregistred = this.address.value;
		await contract.methods.registeringUniqueAd(voterToregistred).send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
		this.address.value = "";
    };

	startingProposalSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.startingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	endingProposalSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.endingProposalSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	startVotingSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.startVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    };

	endVotingSession = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.endVotingSession().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    }

    countVote = async () => {
		const { accounts, contract } = this.state;
		await contract.methods.countVote().send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
    }

    render() {
        return ( 
            <div className="AdminBox">
				<h3 className="text-center">Admin Box {this.state.wfStatus}</h3>
				<hr></hr>
				<br></br>
			
				{this.state.wfStatus === 0 &&
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Autoriser un nouveau compte</strong></Card.Header>
							<Card.Body>
								<Form.Group>
									<Form.Control type="text" id="address" ref={(input) => { this.address = input }}/>
								</Form.Group>{' '}
								<Button onClick={ this.registeringUniqueAd } variant="dark" > Go </Button>
							</Card.Body>
							
						</Card>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Lancer la session de propositions</strong></Card.Header>
							<Card.Body>
								<Button onClick={ this.startingProposalSession } variant="dark" > Go </Button>
							</Card.Body>
						</Card>
					</div>
				}

				{this.state.wfStatus === 1 &&
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Terminer la session de propositions</strong></Card.Header>
							<Card.Body>
								<Button onClick={ this.endingProposalSession } variant="dark" > Go </Button>
							</Card.Body>
						</Card>
					</div>
				}

				{this.state.wfStatus === 2 &&
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Lancer la session de votes</strong></Card.Header>
							<Card.Body>
								<Button onClick={ this.startVotingSession } variant="dark" > Go </Button>
							</Card.Body>
						</Card>
					</div>
				}

				{this.state.wfStatus === 3 &&
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Terminer la session de votes</strong></Card.Header>
							<Card.Body>
								<Button onClick={ this.endVotingSession } variant="dark" > Go </Button>
							</Card.Body>
						</Card>
					</div>
				}
				
				{this.state.wfStatus === 4 &&
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Card style={{ width: '20rem' }}>
							<Card.Header><strong>Comptabiliser les votes</strong></Card.Header>
							<Card.Body>
								<Button onClick={ this.countVote } variant="dark" > Go </Button>
							</Card.Body>
						</Card>
					</div>
				}
			</div>
		);
    }
}

export default AdminBox;