import React, { useState, useEffect } from "react";
import ToastComponent from "../utils/ToastComponent";
import timeSince from "../utils/timeSince";

export default function EventComponent({contract}){
	const [eventEmitted,setEventEmitted] = useState();
	const [dateTime,setDateTime] = useState(Date.now());
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	
	useEffect(function(){
		(async function(){
			if(contract){
				const timer = window.setInterval(function(){
					contract.once(
						"VoterRegistered",
						function(error, event){
							
							setEventEmitted(event.returnValues.voterAddress);
							setDateTime(Date.now());
						});
					setLoading(false); //On a fini le chargement
					},1000);
				return function(){
					clearInterval(timer);
				};
			}
		})();
	},[]);
	return <>{eventEmitted && !loading && <ToastComponent headerStrong="VoterRegistered" headerMuted={timeSince(dateTime)} body={eventEmitted}/>}</>
}
