import React from "react";

export default function AlertComponent({ children }) {
    return <div className="alert alert-danger">
        {children}
    </div>
}