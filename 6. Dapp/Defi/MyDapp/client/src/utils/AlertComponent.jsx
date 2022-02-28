import React from "react";

export default function AlertComponent({ children }) {
	if(typeof(children) === 'object'){
		console.log(children)
		return <></>;
	}

    return <div className="alert alert-danger">
        {children}
    </div>
}