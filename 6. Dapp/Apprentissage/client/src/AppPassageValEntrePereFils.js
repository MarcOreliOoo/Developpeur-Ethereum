import React, { Component } from "react";
import "./App.css";


/**
 * Appelle et passage de valeur de parent à fils et de fils à parent (sans handleClick, change etc. mais juste un callback simple)
 */

class AppPassageValEntrePereFils extends Component {
 	state = { appValueA: 10, appValueB : 100 };

	funcBidon = (obj) => {
		this.setState({appValueA : obj});
	}

	render() {
	    return (
			<div className="AppPassageValEntrePereFils">
				<Chield1 prop1={this.state} prop2={this.funcBidon} />
				<br />
				Dans App this.state.appValueA : {this.state.appValueA}
				<br />
				Dans App this.state.a : {this.state.a}
      		</div>
    	);
  	}
}

export class Chield1 extends Component{
	constructor(props){
		super(props);
		this.state = {
			a:5
		};
	}
	componentDidMount() {
		this.props.prop2(this.state.a);
	}
	
	render(){
		return(
			<span>
				<hr />
				Dans Chield1 This.state.a : {this.state.a}<br /> 
				Dans Chield1 This.props.prop1.appValueA : {this.props.prop1.appValueA}<br /> 
				Dans Chield1 This.props.prop1.appValueB : {this.props.prop1.appValueB}
			</span>
		);
	}
}

export default AppPassageValEntrePereFils;

/**
 * From Parent to a chield
 * @returns 
 */

function Parent(){
    const data = 'Data from parent';
    return(
        <div>
            <Child dataParentToChild = {data}/>
        </div>
    )
}
function Child ({dataParentToChild}){
    return(
        <div>
            {dataParentToChild}
        </div>
    )
}
/**
 * From Chield to a Parent
 * @returns 
 */

export default function Parent() {
  const [data, setData] = useState("");

  const childToParent = (childdata) => {
    setData(childdata);
  };

  return (
    <div className="App">
      {data}
      <div>
        <Child childToParent={childToParent} />
      </div>
    </div>
  );
}

export function Child({ childToParent }) {
  const data = "This is data from Child Component to the Parent Component. OK";
  return (
    <div>
      <button onClick={() => childToParent(data)}>Click Child</button>
    </div>
  );
}


export default Parent;
