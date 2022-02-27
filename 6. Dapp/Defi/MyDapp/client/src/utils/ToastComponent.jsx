import React, { useState } from "react";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

export default function ToastComponent({headerStrong, headerMuted, body}){
	const [show, setShow] = useState(true);

	return <ToastContainer position="top-end" className="p-3">
		<Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
			<Toast.Header>
				<strong className="me-auto">{headerStrong}</strong>
				<small className="text-muted">{headerMuted}</small>
			</Toast.Header>
			<Toast.Body>{body}</Toast.Body>
		</Toast>
	</ToastContainer>
}


 