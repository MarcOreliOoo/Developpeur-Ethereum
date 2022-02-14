import React, { Component, useState, useEffect } from "react";
import "./App.css";


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


/**
 * Compteur simple + modif document.title et simili componentDidMount()
 */
function CompteurCompDidMount(){
	const [count,increment] = useIncrement(0,3);
	
	//Deuxième valeur = tableau de dépendance
	//Talbeau vide en deuxième valeur, comportement égale à componentDidMount() d'une classe, c'est à dire n'est exécuté qu'une fois lorsque le composant est monté
	useEffect(() => {
		document.title = "Compteur "+count;
	}, [count])

	return <button onClick={increment}>IncrémenterAvecHookCreer : {count}</button>

}

/**
 * Compteur simple + modif document.title et simili componentDidMount()
 */
 function CompteurCompDidMountSetInterval(){
	const [count,increment] = useIncrement(0,3);
	
	//Deuxième valeur = tableau de dépendance
	//Talbeau vide en deuxième valeur, comportement égale à componentDidMount() d'une classe, c'est à dire n'est exécuté qu'une fois lorsque le composant est monté
	useEffect(() => {
		const timer =  window.setInterval(() => {
			increment();
		},1000);

		return function() {
			clearInterval(timer);
		}
	}, [])

	//Mettre la ligne document.title dans le premier hook n'est pas correct. ça pourrait marcher mais il faut prendre l'habitude de respecter le 1 logique par hook. Donc logique différente => hook différents
	useEffect(() => {
		document.title = "Compteur : "+count;
	},[count])

	return <button onClick={increment}>IncrémenterAvecHookCreer : {count}</button>

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
				<CompteurCompDidMount /><br /> 
				<CompteurCompDidMountSetInterval />
      		</div>
    	);
  	}
}

export default AppHooksUseEffect;
