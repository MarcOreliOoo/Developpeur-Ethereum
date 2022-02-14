import React, { Component, useState, useEffect } from "react";
import "./App.css";

const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

/**
 * Use effect = hook utilisé pour créer un effet associé à un changement d'état
 * 	Le UseEffect est asynchrone = il est exécuté en parallèle de l'affichage de la page par exemple
 * !=
 * UseLayoutEffect = similaire à use effect, mais est exécuté avant le rendu du DOM, donc utile pour intervenir sur un changement de "layout" sur le DOM
 */

class AppHooksUseEffect extends Component {
 	render() {
	    return (
			<div className="AppHooksUseEffet">
				<hr />
				<Counter />
      		</div>
    	);
  	}
}

export default AppHooksUseEffect;
