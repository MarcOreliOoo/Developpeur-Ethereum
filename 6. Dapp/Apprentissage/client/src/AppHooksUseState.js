import React, { Component, useState } from "react";
import "./App.css";



/**
 * Compteur simple sur bouton
 * @returns Un bouton cliquable qui incrémente
 */
function Compteur () {
	//Count la clé, SetCount le callback mettant à jour cette clé
	//Pas de useState dans conditions ou boucle
	const [count,setCount] = useState(0);
	const handleClick = function (e) {
		e.preventDefault();

		setCount(n=>n+1);
	}
	return <button onClick={handleClick}>Nombre : {count}</button>
}

/**
 * Démontre qu'il n'y a pas de fusion d'objet contrairement au setState de Class :
 * Par défaut, le a:1 serait remplacé par count:10
 * @returns Un div cliquable avec modification de l'état
 */
 function DivStateSansFusion () {
	const [state,setState] = useState({
		a:1
	});

	const handleClick = function (e) {
		e.preventDefault();
		setState({count:10});
	}
	return <div onClick={handleClick}>{JSON.stringify(state)}</div>
}


/**
 * Démontre comment avoir fusion d'objet en utilisant une fonction qui récup l'état précédent
 * le count:10 est ajouté à a:1
 * @returns Un div cliquable avec modification de l'état
 */
 function DivStateAvecFusion () {
	const [state,setState] = useState({
		a:1
	});

	const handleClick = function (e) {
		e.preventDefault();
		setState(oldState => {
			return {...oldState, count:10}
		});
	}
	return <div onClick={handleClick}>{JSON.stringify(state)}</div>
}


/**
 * Exemple plusieurs hook au sein d'un composant fonction
  */
 function PlusieursAppelsUseState () {
	const [count,setCount1] = useState(0);
	const [count2,setCount2] = useState(0);

	const handleClick = function (e) {
		e.preventDefault();
		setCount1(n => n+1);
	}
	const handleClick2 = function (e) {
		e.preventDefault();
		setCount2(n => n+2);
	}

	return <>
		<button onClick={handleClick}>Incrémenter : {count} </button>
		<button onClick={handleClick2}>Incrémenter : {count2} </button>
	</>
}

/**
 * Création d'un Hook personnalisé pour incrémenter, i.e. allègement de la logique
 */
function useIncrement(init, pas){
	const [count, setCount] = useState(init);
	const increment = () => {
		setCount(c => c+pas);
	}
	return [count,increment];
}

function CompteurAvecHookDansFonction(){
	const [count,increment] = useIncrement(0,3);
	return <button onClick={increment}>IncrémenterAvecHookCreer : {count}</button>
}

class AppHooksUseState extends Component {
 	render() {
	    return (
			<div className="AppHooksUseState">
				<hr />
				<Compteur />
				<DivStateSansFusion />
				<DivStateAvecFusion />
				<PlusieursAppelsUseState />
				<CompteurAvecHookDansFonction />
      		</div>
    	);
  	}
}

export default AppHooksUseState;
