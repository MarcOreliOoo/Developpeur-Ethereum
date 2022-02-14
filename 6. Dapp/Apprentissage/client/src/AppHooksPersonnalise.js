import React, { Component, useState, useEffect } from "react";
import App from "./App";
import "./App.css";

/**
 * Personnalized hook using useState for incrementation
 * @param {initial value of count} initialValue 
 * @param {increment step} step 
 * @returns theHook
 */
function useIncrement(initialValue = 0,step = 1){
	const [count, setCount] = useState(initialValue);
	const increment = function(){
		setCount(c=>c+step);
	}
	return [
		count,
		increment
	]
}

/**
 * Auto Increment valeur avec un useState et un timer
 * @param {*} initialValue 
 * @param {*} step 
 * @returns 
 */
function useAutoIncrement(initialValue = 0,step = 1){
	const[count, setCount] = useState(initialValue);
	useEffect(function(){
		const timer = window.setInterval(function(){
			setCount(c=>c+step);
		},1000);

		//A chaque fois qu'on a un timer, un abonnement à des événements etc. on doit gérer le clear immédiamement.
		return function(){
			clearInterval(timer);
		};
	},[])
	//Avant on retourne un couple, compteur + trigger de l'incrément, comme on est en auto incrément, on retour une valeur unique du compteur
	return count;
}

/**
 * Autoincrémente la valeur avec un useState qui utiliser un hook personnalisé dans un timer
 * @param {*} initialValue 
 * @param {*} step 
 * @returns 
 */
function useAutoIncrementWithUseIncrement(initialValue = 0,step = 1){
	const[count, increment] = useIncrement(initialValue, step);
	useEffect(function(){
		const timer = window.setInterval(function(){
			increment();
		},1000);

		//A chaque fois qu'on a un timer, un abonnement à des événements etc. on doit gérer le clear immédiamement.
		return function(){
			clearInterval(timer);
		};
	},[])
	//Avant on retourne un couple, compteur + trigger de l'incrément, comme on est en auto incrément, on retour une valeur unique du compteur
	return count;
}

/**
 * Exemple of a hook personnalized which toggles or not a button regarding the checkedbox status
 * @param {*} initialValue 
 */
function useToggle(initialValue = true){
	const [value,setValue] = useState(initialValue);
	const toggle = function () {
		setValue(v => !v);
	}
	return [value,toggle];
}


function Compteur(){
	const [count,increment] = useIncrement(10);
	const count2 = useAutoIncrement(10);
	const count3 = useAutoIncrementWithUseIncrement(10,2);
	
	return <>
		<button onClick={increment}>Incrémenter {count}</button>
		<br/>
		<button>Incrémenter {count2}</button>
		<br/>
		<button>Incrémenter {count3}</button>
	</>
}


/**
 *	On ne peut pas retourner en premier paramètre une promesse mais seulement une fonction.
 *	Donc on ne peut pas mettre un await devant la fonction qui irait récupérer des lignes/listes/events etc.
 *	Si on veut travailler avec les promesses, il faut créer une fonction qui va s'auto appeler qui elle sera asynchrone
 *	et s'appellera elle même avec la syntaxe suivante :
 *	useEffect(function(){
 *		(async function(){
 *			
 *		})();
 *	},[]);
 */
function TodoList(){
	const [todo, setTodo] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	useEffect(function(){
		(async function(){
			const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
			const responseData = await response.json();
			if(response.ok){
				setTodo(responseData);
			}else{
				alert(JSON.stringify(responseData));
			}
			setLoading(false); //On a fini le chargement
		})();
	},[]);

	if (loading){
		return 'Chargement...';
	}
	return <ul>
		{todo.map(t => <li key={t.title}>{t.title}</li>)}
	</ul>
}

/**
 * Ce code fonctionne aussi pour un tableau en récup via FETCH.
 * Mais le code est duppliqué, il faudrait utiliser un hook personnalisé pour dédupliquer ça.
 */
function PostTable(){
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true); //Par défaut est en train de charger
	useEffect(function(){
		(async function(){
			const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=10')
			const responseData = await response.json();
			if(response.ok){
				setItems(responseData);
			}else{
				alert(JSON.stringify(responseData));
			}
			setLoading(false); //On a fini le chargement
		})();
	},[]);

	if (loading){
		return 'Chargement...';
	}
	return <table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th>Contenu</th>
			</tr>
		</thead>
		<tbody>
			{items.map(item => <tr key={item.id}>
					<td>{item.name}</td>
					<td>{item.email}</td>
					<td>{item.body}</td>
				</tr>)
			}
		</tbody>
	</table>
}



/**
 * Hook personnalisé pour Fetch data à partir d'une URL
 * @returns 
 */
function useFetch(url){
	const [state,setState] = useState({
		items:[],
		loading:true
	});
	useEffect(function(){
		(async function(){
			const response = await fetch(url)
			const responseData = await response.json();
			if(response.ok){
				setState({
					items:responseData,
					loading:false
				});
			}else{
				alert(JSON.stringify(responseData));
				//En cas d'erreur on ne change pas l'état sauf pour loading qui passe à false;
				/* setState({
					items:[],
					loading: false
				}); */
				//Syntaxe équivalente avec la destructuration :
				setState(s =>({...s, loading:false}));
			}
		})();
	},[]);
	return [state.loading,state.items];
}


function TodoListDeduplique(){
	const [loading, todo] = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
	if (loading){
		return 'Chargement...';
	}
	return <ul>
		{todo.map(t => <li key={t.title}>{t.title}</li>)}
	</ul>
}
function PostTableDeduplique(){
	const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/comments?_limit=10');
	if (loading){
		return 'Chargement...';
	}
	return <table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th>Contenu</th>
			</tr>
		</thead>
		<tbody>
			{items.map(item => <tr key={item.id}>
					<td>{item.name}</td>
					<td>{item.email}</td>
					<td>{item.body}</td>
				</tr>)
			}
		</tbody>
	</table>
}

function Appli (){
	const [compteurVisible, toggleCompteur] = useToggle(true);

	return <div>
		Afficher le compteur <input type="checkbox" onChange={toggleCompteur} checked={compteurVisible} />
			{compteurVisible && <div>
				<Compteur />
				<br />
				<TodoList />
				<br />
				<PostTable />
			</div>}
		<div>
			<TodoListDeduplique />
			<br />
			<PostTableDeduplique />
		</div>
	</div>
}


class AppHooksPersonnalise extends Component {
 	render() {
	    return (
			<div className="AppHooksPersonnalise">
				<hr />
				<Appli />
				<br /> 
      		</div>
    	);
  	}
}

export default AppHooksPersonnalise;
