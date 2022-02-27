import React, { useState, useEffect } from "react";
import ToastComponent from "../utils/ToastComponent";
import timeSince from "../utils/timeSince";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

export default function EventComponent({contract}){

	const define = {
		eventEmittedName:"",
		eventEmittedContent:""
	};

	const [eventEmitted,setEventEmitted] = useState();
	const [dateTime,setDateTime] = useState(Date.now());
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	const [show,setShow] =  useState(false); //Par défaut n'affiche pas de popup

	/* useEffect(function(){
		(async function(){
			const timer = window.setInterval(function(){
				if(contract){
					contract.once(
						"allEvents",
						function(error, event){
							//console.log(event.event);
							if(event.event == "VoterRegistered") {
								setEventEmitted({
									eventEmittedName:"VoterRegistered",
									eventEmittedContent:event.returnValues.voterAddress});
								setDateTime(Date.now());
								setShow(true);
							} else if (event.event == "WorkflowStatusChange"){
								console.log(event.returnValues.previousStatus);
								setEventEmitted("From "+event.returnValues.previousStatus + " to " +event.returnValues.newStatus);
								setDateTime(Date.now());
								//x = anEvent.returnValues.newStatus;
							} else if (event.event == "ProposalRegistered"){
								setEventEmitted(event.returnValues.proposalId);
								setDateTime(Date.now());
								//proposalsId.add(anEvent.returnValues.proposalId);
							} else if (event.event == "Voted"){
								setEventEmitted({key:event.returnValues.voter,val:event.returnValues.proposalId});
								setDateTime(Date.now());
							}
						}
					);
					setLoading(false);
				}
			},1000);
			return function(){
				clearInterval(timer);
			};
		})();
	},[]); */

	/*useEffect(function(){
		(async function(){
			if(contract){
				const timer = window.setInterval(function(){
					contract.once(
						"VoterRegistered",
						function(error, event){
							//if(event.event == "VoterRegistered") {
								setEventEmitted(event.returnValues.voterAddress);
								setDateTime(Date.now());
							//}
						});
					setLoading(false); //On a fini le chargement
					},1000);
				return function(){
					clearInterval(timer);
				};
			}
		})();
	},[]);*/

	//It works
	useEffect(function(){
		if(contract){
			const timer = window.setInterval(function(){
				contract.events.VoterRegistered().on("data",function(event){
					console.log(event);
					setEventEmitted(event.returnValues.voterAddress);
					setDateTime(Date.now());
					setShow(true);//On affiche la popup
				});
				setLoading(false); //On a fini le chargement
			},1000);
			return function(){
				clearInterval(timer);
			};
		}
	},[]);

	return <>
		<ToastContainer position="top-end" className="p-3">
			<Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
				<Toast.Header>
					<strong className="me-auto">VoterRegistered</strong>
					<small className="text-muted">{timeSince(dateTime)}</small>
				</Toast.Header>
				<Toast.Body>{eventEmitted}</Toast.Body>
			</Toast>
		</ToastContainer>
	</>
}
//{eventEmitted && !loading && <ToastComponent headerStrong="VoterRegistered" headerMuted={timeSince(dateTime)} body={eventEmitted}/>}
/* {eventEmitted.eventEmittedName !="" && !loading && 
			<ToastComponent headerStrong={eventEmitted.eventEmittedName} headerMuted={timeSince(dateTime)} body={eventEmitted.eventEmittedContent} />
		} */