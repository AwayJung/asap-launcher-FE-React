import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Step1({ setParent, resetStep }) {
    const [selectDiskModel, setSelectDiskModel] = useState('');
    const [step1Data, setStep1Data] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/test/params?step=1')
            .then(response => {
                console.log('Data fetched:', response.data);
                setStep1Data(response.data[0]);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(true);
            });
    }, []);

    const handleSelectDiskModel = (event) => {
        const value = event.target.value;
        setSelectDiskModel(value);
        setParent(value);
        resetStep();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const { label, params: step1Params } = step1Data;
    const items = step1Params[0].items;

    return (
        <main className={inter.className}>
            <div>
                <label>* {label}: </label>
                <select
                    value={selectDiskModel}
                    onChange={handleSelectDiskModel}
                >
                    <option value="" disabled>Select Options</option>
                    {items.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
        </main>
    );
}
