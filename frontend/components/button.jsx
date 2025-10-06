import React from "react";
import "./button.css";

function Button({ children, onClick, variant = "default", className = "", asLabel = false, htmlFor, ...props }) {
    if (asLabel) {
        // render als <label> i.p.v <button>
        return (
            <label
                htmlFor={htmlFor}
                className={`btn btn-${variant} ${className}`}
                {...props}
                style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
            >
                {children}
            </label>
        );
    }

    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
