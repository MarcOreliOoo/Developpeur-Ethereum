import React from "react";
import VotersComponent from "./VotersComponent";
import AdminComponent from "./AdminComponent";
import '../style/DashboardComponent.css';


export default function DashboardComponent() {
	const Admin = true;

	return (
	<>
		<VotersComponent />
		{Admin && <AdminComponent /> }
	</>
	);
}