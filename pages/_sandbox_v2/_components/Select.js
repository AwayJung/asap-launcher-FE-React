import React, { useEffect, useState } from 'react';

const Select = ({ data, handleSelectChange, value }) => {
    const [options, setOptions] = useState([]);
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (data.length > 0) {
            setLabel(data[0].label);
            setOptions(data[0].params[0].items);
        }
    }, [data]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        handleSelectChange(label, selectedValue);
    };

    return (
        <div>
            <label>*{label}:</label>
            <select value={value || ""} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                {options.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;