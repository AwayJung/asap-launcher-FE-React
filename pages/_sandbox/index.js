import { useState } from "react";
import Step1 from "./_components/step1";
import Step2 from "./_components/step2";
import Step3 from "./_components/step3";

export default function Index() {
    const [selectDiskModel, setSelectDiskModel] = useState('');
    const [selectInstance, setSelectInstance] = useState('');
    const [selectApp, setSelectApp] = useState('');

    const handleReview = () => {
        // 리뷰 버튼 로직
        console.log('Review button clicked');
    };

    const handleReset = () => {
        setSelectDiskModel('');
        setSelectInstance('');
        setSelectApp('');
    };

    const resetStep = () => {
        setSelectInstance('');
        setSelectApp('');
    };

    const handleSelectDiskModel = (value) => {
        setSelectDiskModel(value);
    };

    const handleSelectInstance = (value) => {
        setSelectInstance(value);
    };

    const handleSelectApp = (value) => {
        setSelectApp(value);
    };

    // console.log("selectApp value:", selectApp);

    // console.log("selectInstance value:", selectInstance);

    return (
        <div>
            <Step1 setParent={handleSelectDiskModel} resetStep={resetStep}/>
            {selectDiskModel && <Step2 parent={selectDiskModel} setParent={handleSelectInstance} />}
            {selectInstance && <Step3 parent={selectInstance} setParent={handleSelectApp}/>}

            <div>
                <button
                    disabled={!selectDiskModel || !selectInstance || !selectApp}
                    onClick={handleReview}>Review</button>
                    <button disabled={!selectDiskModel} onClick={handleReset}>Reset</button>
            </div>
        </div>
);
}
