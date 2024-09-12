import React from 'react';

const Input = ({ label, handleInputChange }) => {
    const handleChange = (event) => {
        handleInputChange(label, event.target.value);
    };

    return (
        <div>
            <label>*{label}:</label>
            <input type="text" onChange={handleChange} />
        </div>
    );
};

export default Input;