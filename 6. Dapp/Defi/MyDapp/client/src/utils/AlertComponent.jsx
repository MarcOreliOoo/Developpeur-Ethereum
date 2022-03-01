import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
export default function AlertComponent({ children }) {
	const [show, setShow] = useState(true);

	if(typeof(children) === 'object'){
		console.log(children)
		return <></>;
	}
	if (show) {
		return (
			<Alert variant="danger" onClose={() => setShow(false)} dismissible>
		  		<Alert.Heading>Oh snap! You got an error!</Alert.Heading>
		  		<p>{children}</p>
			</Alert>
	  	);
	}
	return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}