import React, { useEffect, useState } from 'react';
import { Select as AntSelect, Form } from 'antd';

const { Option } = AntSelect;

const Select = ({ data, selectParam }) => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [label, setLabel] = useState('');
    const [key, setKey] = useState('');

    useEffect(() => {
        if (data.length > 0) {
            setLabel(data[0].label);
            setKey(data[0].value);
            setOptions(data[0].params[0].items);
            setSelectedValue('');
        }
    }, [data]);

    const handleChange = (value) => {
        setSelectedValue(value);
        if (value !== '') {
            selectParam({ key: key, value: value });
        }
    };

    return (
        <Form.Item
            label={`${label}:`}>
            <AntSelect
                style={{ width: '100%' }}
                value={selectedValue}
                onChange={handleChange}
            >
                <Option value="" disabled>Select an option</Option>
                {options.map((item) => (
                    <Option key={item.value} value={item.value}>
                        {item.label}
                    </Option>
                ))}
            </AntSelect>
        </Form.Item>
    );
};

export default Select;