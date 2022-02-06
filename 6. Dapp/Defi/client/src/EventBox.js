import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

class EventBox extends Component {

	constructor (props){
		super(props);
		this.state = props.state;
	}

	componentDidMount = async () => {
		//setInterval(this.getAllEvents(), 1000);
		this.getAllEvents();
	};

	componentWillUnmount = async () => {
		//clearInterval();
	};

    getAllEvents = async () => {
		const { contract, eventList } = this.state;
		//let eventListeTmp = [];
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

    render() {
        return ( 
            <div className="EventBox">
				<h3 className="text-center">Event Box</h3>
				<hr></hr>
				<br></br>
			
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Card bg="secondary" text="light" style={{ width: '50rem' }}>
						<Card.Header>All events</Card.Header>
					<Card.Body>
						<ListGroup variant="flush">
						<ListGroup.Item>
							<Table striped bordered hover>
							<thead>
								<tr><th>VoterRegistered</th></tr>
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
				</div>
			</div>
		);
    }
}

export default EventBox;