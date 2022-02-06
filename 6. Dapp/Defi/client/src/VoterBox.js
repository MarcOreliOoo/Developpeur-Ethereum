import React, { Component } from "react";

class VoterBox extends Component {

	constructor (props){
		super(props);
		this.state=props.state;
	}

    render() {
        return ( 
            <div className="VoterBox">
				<h3 className="text-center">Voter Box</h3>
				<hr></hr>
				<br></br>
			</div>
		);
    }
}

export default VoterBox;