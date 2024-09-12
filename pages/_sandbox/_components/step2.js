import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Step2({ parent, setParent }) {
    const [selectInstance, setSelectInstance] = useState('');
    const [step2Data, setStep2Data] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (parent) {
            setSelectInstance("");
            setLoading(true);
            axios.get(`http://localhost:3000/api/test/params?step=2&parent=${parent}`)
                .then(response => {
                    console.log('Data2 fetched:', response.data);
                    setStep2Data(response.data[0]);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(true);
                });
        }
    }, [parent]);

    const handleSelectInstance = (event) => {
        const value = event.target.value;
        setSelectInstance(event.target.value);
        setParent(value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const { label, params: step2Params } = step2Data;
    const items = step2Params[0].items;

    return (
        <main className={inter.className}>
            <div>
                <label>* {label}: </label>
                <select
                    value={selectInstance}
                    onChange={handleSelectInstance}
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