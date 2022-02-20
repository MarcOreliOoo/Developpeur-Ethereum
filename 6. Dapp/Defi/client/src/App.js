import React, { useState } from "react";

import { LoginForm } from "./App/LoginForm";

export default function App() {
	const [user, setUser] = useState(null);

	return(
		user ? <div>Hi tu es connecté !</div>:<LoginForm setUser={setUser}/>
	);
}
