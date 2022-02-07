import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class EventBox extends Component {

	constructor (props){
		super(props);
		this.state = props.state;
	}

	componentDidMount = async () => {
		//setInterval(this.getAllEvents(), 1000);
		console.log(this.state.totalVoter);
		//this.getAllEvents();
		this.getOneEvent();
	};

	/* componentWillUnmount = async () => {
		//clearInterval();
	}; */

    getAllEvents = async () => {
		const { contract, eventList } = this.state;
		contract.getPastEvents(
			'allEvents',
			{fromBlock: 0, toBlock: 'latest'},
			function(error, events){ }
		).then((allEvents) => {
			for(let anEvent of allEvents){
			  	if (anEvent.event === 'VoterRegistered'){
					//eventList.push({key:anEvent.returnValues.voterAddress,val:anEvent.returnValues.voterAddress});
					eventList.push(anEvent.returnValues.voterAddress);
				}
			}
		});
		this.setState({eventList:eventList});
	}

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
				<h3 className="text-center">Event Box {this.state.wfStatus}</h3>
				<hr></hr>
				<br></br>
				<Container fluid="sm">
				<Row>
					<Card bg="secondary" text="light" style={{ width: '20rem' }}>
						<Card.Header>All events</Card.Header>
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
										this.state.eventList !== null
										&&
										this.state.eventList.map((a) => <tr><td>{a}</td></tr>)
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