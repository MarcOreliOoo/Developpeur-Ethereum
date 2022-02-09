import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

export class Proposition extends Component {
	constructor(props){
		super(props);
		this.state = {
			key : props.key,
			desc : props.desc,
			count : props.count
		}
		console.log("Dans constructor de Proposition");
	}
	render () {
		console.log("Dans render de Proposition");
		return(
			<Card style={{ width: '18rem' }}>
				<Card.Body>
					<Card.Title>{this.props.key}</Card.Title>
					<Card.Text>
						{this.props.desc}
					</Card.Text>
				<Button variant="primary">Voter</Button>
			</Card.Body>
			</Card>
		);
	}
}

export class Propositions extends Component {
	constructor (props){
		super(props);
		this.state = props.state;
		this.proposalsToDisplay = [];

		this.displayProposals();
	}

	componentDidMount = async () => {
		this.displayProposals.bind(this);
	}

	displayProposals = async () => {
		const { contract, proposalsId } = this.state;
		
		let tabl = Array.from(proposalsId);
		console.log(proposalsId);
		
		/* for(let p in tabl){
			let proposal = await contract.methods.proposals(p).call();
			this.proposalsToDisplay.push({
				key:p,
				desc:proposal.description,
				count:proposal.voteCount
			});
		} */
		//this.setState({proposalsToDisplay:proposalsToDisplay});
	};

	render (){
		return (
			<div>
				{/*this.proposalsToDisplay.map((p) => <Proposition key={p.key} desc={p.pdesc} count={p.pcount}/>)*/}
			</div>
		);	
	}
}

class VoterBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;
	}

	registeringProposal = async () => {
		const { accounts, contract } = this.state;
		
		let proposalToRegister = this.proposal.value;
		await contract.methods.registeringProposal(proposalToRegister).send({from: accounts[0]})
		.on("receipt",function(receipt){
			console.log(receipt);
		})
		.on("error",function(error, receipt){
			console.log(error);
			console.log(receipt);
		});
		this.proposal.value = "";
    };

	canVote (user){
		if(this.state.whiteList.has(user)){
			return true;
		}
		return false;
	}


    render() {
		// = this.state.proposalsId.map((a,index) => <ListGroup.Item key={index}>{a}</ListGroup.Item>);

		//Gérer le cas où on n'a pas le droit de voter
		//Ajouter un bouton voter sur liste des propositions si le droit de voter + status = 3

        return ( 
            <div className="VoterBox">
				<br></br>
				<h3 className="text-center">Voter Box {this.state.wfStatus}</h3>
				<hr></hr>
				<br></br>

				{this.state.wfStatus === 1 &&
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Card style={{ width: '20rem' }}>
						<Card.Header><strong>Emettre une proposition</strong></Card.Header>
						<Card.Body>
							<div className="form-floating mb-3">
								<input type="text" className="form-control" id="proposal" ref={(input) => { this.proposal = input }}/>
								<label htmlFor="Your proposal">Your proposal</label>
							</div>
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
								{<Propositions state={this.state}/>}
							</ListGroup>
						</Card.Body>
					</Card>
				</div>

			</div>
		);
    }
}

export default VoterBox;