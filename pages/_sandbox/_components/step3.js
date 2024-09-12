import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Step3({ parent, setParent }) {
    const [selectApp, setSelectApp] = useState('');
    const [step3Data, setStep3Data] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (parent) {
            setSelectApp('');
            setLoading(true);
            axios.get(`http://localhost:3000/api/test/params?step=3&parent=${parent}`)
                .then(response => {
                    console.log('Data3 fetched:', response.data);
                    setStep3Data(response.data[0]);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [parent]);

    const handleSelectApp = (event) => {
        const value = event.target.value;
        setSelectApp(value);
        setParent(value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!step3Data) {
        return null;
    }

    const { label, params: step3Params } = step3Data;
    const items = step3Params[0].items;

    return (
        <main className={inter.className}>
            <div>
                <label>* {label}: </label>
                <select
                    value={selectApp}
                    onChange={handleSelectApp}
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
