import React, { Component } from "react";
import "./App.css";
import AppPassageValEntrePereFils from "./AppPassageValEntrePereFils";
import AppHooksUseState from "./AppHooksUseState";
import AppHooksUseEffect from "./AppHooksUseEffect";
import AppHooksPersonnalise from "./AppHooksPersonnalise";

class App extends Component {
 	render() {
	    return (
			<div className="App">
				{/* <div className="container mb-3"><AppPassageValEntrePereFils /></div>
				<div className="container mb-5"><AppHooksUseState /></div>
				<div className="container mb-5"><AppHooksUseEffect /></div> */}
				<br/>
				<div className="container mb-5"><AppHooksPersonnalise /></div>
      		</div>
    	);
  	}
}

export default App;
