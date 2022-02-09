import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class EventBox extends Component {

	constructor (props){
		super(props);
		this.state = props.state;
		
		this.anInterval = null;
		
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
		this.anInterval = setInterval(this.getAllEvents.bind(this), 1000);
	};

	componentWillUnmount = async () => {
		clearInterval(this.anInterval);
	};

    getAllEvents = async () => {
		const { contract, whiteList, proposalsId, proposalsVotedBy } = this.state;
		let x;
		contract.getPastEvents(
			'allEvents',
			{fromBlock: 0, toBlock: 'latest'},
			function(error, events){ }
		).then((allEvents) => {
			//var allStatus,lastCoupleOfStatus = [];
			for(let anEvent of allEvents){
			  	if (anEvent.event === 'VoterRegistered'){
					whiteList.add(anEvent.returnValues.voterAddress);
				} else if (anEvent.event === 'WorkflowStatusChange'){
					x = anEvent.returnValues.newStatus;
				} else if (anEvent.event === 'ProposalRegistered'){
					proposalsId.add(anEvent.returnValues.proposalId);
				} else if (anEvent.event === 'Voted'){
					proposalsVotedBy.add({key:anEvent.returnValues.voter,val:anEvent.returnValues.proposalId});
				}
			}
		});
		this.setState({whiteList:whiteList, proposalsId:proposalsId, proposalsVotedBy:proposalsVotedBy});
	}

	//Pb websocket idem with contract.events.MyEvent or contract.events.allEvents
	getOneEvent = async () => {
		const { contract, eventList } = this.state;
		contract.events.VoterRegistered(
			{fromBlock: 0, toBlock: 'latest'},
			function(error, event){ }
		).then((event) => eventList.push(event.returnValues.voterAddress));
		this.setState({eventList:eventList});
	}

    render() {
		console.log("this.enumContent[this.state.wfStatus] : "+this.enumContent[this.state.wfStatus]);
        return ( 
            <div className="EventBox">
				<h3>Global Information</h3>
				<hr></hr>
				<br></br>
				<Container fluid="sm">
				<Row>
					<Card bg="secondary" text="light" style={{ width: '20rem' }}>
						<Card.Body>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Table responsive striped bordered hover>
									<thead>
										<tr><th>
											VoterRegistered 
											<Badge bg="dark">{this.state.totalVoter}</Badge>
											<span className="visually-hidden">unread messages</span>
										</th></tr>
									</thead>
									<tbody>
										{
										this.state.whiteList !== null
										&&
										Array.from(this.state.whiteList).map((a) => <tr><td>{a}</td></tr>)
										}
									</tbody>
									</Table>
								</ListGroup.Item>
								<ListGroup.Item>
									<Table responsive striped bordered hover>
									<thead>
										<tr><th>
											WorkflowStatus Running
											<Badge bg="dark">{this.state.wfStatus}</Badge>
											<span className="visually-hidden">unread messages</span>
										</th></tr>
									</thead>
									<tbody>
										{
										this.state.wfStatus !== null
										&&
										<tr><td>{this.enumContent[this.state.wfStatus]}</td></tr>
										}
									</tbody>
									</Table>
								</ListGroup.Item>
								<ListGroup.Item>
									<Table responsive striped bordered hover>
									<thead>
										<tr><th>
											ProposalRegistered 
											<Badge bg="dark">{this.state.totalVoter}</Badge>
											<span className="visually-hidden">unread messages</span>
										</th></tr>
									</thead>
									<tbody>
										{
										this.state.proposalsId !== null
										&&
										Array.from(this.state.proposalsId).map((a) => <tr><td>{"Proposition "+a}</td></tr>)
										}
									</tbody>
									</Table>
								</ListGroup.Item>
								<ListGroup.Item>
									<Table responsive striped bordered hover>
									<thead>
										<tr><th>
											Voted 
											<span className="visually-hidden">unread messages</span>
										</th></tr>
									</thead>
									<tbody>
										{
										this.state.proposalsVotedBy !== null
										&&
										Array.from(this.state.proposalsVotedBy).map((a) => <tr><td>{a.key+" voted for "+a.val})</td></tr>)
										}
									</tbody>
									</Table>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
  				</Row>
				</Container>
			</div>
		);
    }
}

export default EventBox;