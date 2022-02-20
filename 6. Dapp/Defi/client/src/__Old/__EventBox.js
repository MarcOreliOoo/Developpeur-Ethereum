import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminBox from "./__AdminBox";
import VoterBox from "./__VoterBox";

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
		//this.props.parentCallBack({whiteList:whiteList, proposalsId:proposalsId, proposalsVotedBy:proposalsVotedBy});
	}

	

	//Pb websocket with contract.events.MyEvent or contract.events.allEvents. Only getPastEvents work with my version of Ganache.
	//FIXME : Update Ganache version and try these solutions
	//Could be worth to add bootstrap toasts with events
	getOneEvent = async () => {
		const { contract, eventList } = this.state;
		contract.events.VoterRegistered(
			{fromBlock: 0, toBlock: 'latest'},
			function(error, event){ }
		).then((event) => eventList.push(event.returnValues.voterAddress));
		this.setState({eventList:eventList});
	}

    render() {
        return ( 
            <div className="EventBox">
				<br></br>
				<Container fluid="sm">
				<Row><Col>
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
											<Badge bg="dark">{Array.from(this.state.proposalsId).length}</Badge>
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
				</Col>
				<Col>
				<Container fluid>
					{(this.state.isOwner) &&
						<AdminBox state={this.state} />	
					}
					<VoterBox state={this.state} />	
				</Container>
				</Col>
				</Row>
				</Container>
			</div>
		);
    }
}

export default EventBox;