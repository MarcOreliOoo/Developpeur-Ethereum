import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class AdminBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;
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
    }

	//startingProposalSession

    countVote = async () => {

    }

    nextStage = async () => {

    }

    render() {
        return ( 
            <div className="AdminBox">
				<h3 className="text-center">Admin Box</h3>
				<hr></hr>
				<br></br>
			
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Card style={{ width: '20rem' }}>
						<Card.Header><strong>Autoriser un nouveau compte</strong></Card.Header>
						<Card.Body>
							<Form.Group controlId="formAddress">
								<Form.Control type="text" id="address" ref={(input) => { this.address = input }}/>
							</Form.Group>{' '}
							<Button onClick={ this.registeringUniqueAd } variant="dark" > Autoriser </Button>
						</Card.Body>
					</Card>
				</div>		
			</div>
		);
    }
}

export default AdminBox;