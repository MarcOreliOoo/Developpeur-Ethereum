import React, { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';



export default function Navigation({handleConnect,web3,accounts,contract}){
	const [wfStatus,setStatus] = useState(99);

	useEffect(function(){
		(async function(){
			if(contract){
				const actualStatus = await contract.methods.wfStatus().call();
				setStatus(actualStatus);
			}		
		})();
	},[contract]);
	

	return <></>
}