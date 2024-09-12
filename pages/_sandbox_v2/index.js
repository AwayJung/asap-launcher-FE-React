import { useEffect, useState } from "react";
import Input from './_components/Input';
import Select from './_components/Select';

export default function Index() {
    const [steps, setSteps] = useState([{ step: 1, parent: null, data: [] }]);
    const [params, setParams] = useState({});
    const [reviewData, setReviewData] = useState({});
    const [reviewMode, setReviewMode] = useState(false);

    // 초기 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = require('/public/data/params.example.v0.1.json');
                setParams(params);
                // 초기데이터 검색해서 initialData에 저장
                const initialData = searchParams(params.data, 1, null);
                setSteps([{ step: 1, parent: null, data: initialData }]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // step, parent에 따라 데이터 검색
    function searchParams(params, step, parent) {
        const result = [];
        params.forEach((_items) => {
            _items.forEach((_item) => {
                step = parseInt(step);
                if (_item.step === step) {
                    if (step > 1 && parent) {
                        _item.parents.forEach((_parent) => {
                            if (_parent === parent) {
                                result.push(_item);
                            }
                        });
                    } else if (step === 1) {
                        result.push(_item);
                    }
                }
            });
        });
        return result;
    }


    // select 컴포넌트에서 사용하는 콜백 함수 반환하는 함수
    const handleSelectChange = (step) => (label, selectedValue) => {
        selectChange(step, label, selectedValue);
    }

    // Input 컴포넌트 사용하는 콜백함수 반환하는 함수
    const handleInputChange = (step) => (label, value) => {
        updateReviewData(step, label, value, 'input');
    }

    // select 컴포넌트 값이 변경될 때 호출
    const selectChange = (step, label, selectedValue) => {
        const updatedSteps = steps.slice(0, step).map(s =>
            s.step === step ? { ...s, selectedValue } : s
        );
        // 다음 단계 step
        const newStep = step + 1;
        const filteredData = searchParams(params.data, newStep, selectedValue);

        if (filteredData.length > 0) {
            updatedSteps.push({ step: newStep, parent: selectedValue, data: filteredData, selectedValue: "" });
        }
        setSteps(updatedSteps);
        updateReviewData(step, label, selectedValue, 'select');
    };

    // reviewData 상태 업데이트
    const updateReviewData = (step, label, value, type) => {
        setReviewData(prev => {
            const newReviewData = { ...prev };
            // 현재 단계 이후의 모든 데이터 삭제
            Object.keys(newReviewData).forEach(key => {
                if (parseInt(key.replace('step', '')) > step) {
                    delete newReviewData[key];
                }
            });
            // 현재 단계 데이터 업데이트
            newReviewData[`step${step}`] = {
                ...newReviewData[`step${step}`],
                [type]: { label, value }
            };
            return newReviewData;
        });
    }


    // 초기 상태로 리셋
    const reset = () => {
        const initialData = searchParams(params.data, 1, null);
        setSteps([{ step: 1, parent: null, data: initialData, selectedValue: "" }]);
        setReviewData({});
        setReviewMode(false);
    };

    // review 모드로 전환
    const handleReview = () => {
        setReviewMode(true);
    };

    // 폼타입에 따라서 적절한 컴포넌트 렌더링 (select, input)
    const renderFormType = (item, stepData, formType) => {
        if (formType === 'select') {
            return (
                <Select
                    key={`${stepData.step}-${item.value}-select`}
                    data={[item]}
                    handleSelectChange={handleSelectChange(stepData.step)}
                    value={stepData.selectedValue}
                />
            );
        } else if (formType === 'input') {
            return (
                <Input
                    key={`${stepData.step}-${item.value}-input`}
                    label={item.label}
                    handleInputChange={handleInputChange(stepData.step)}
                />
            );
        }
        return null;
    };

    //  모든 필드가 채워졌는지 확인하는 함수
    const isAllFieldsFilled = () => {
        return steps.every((step, index) => {
            const stepReviewData = reviewData[`step${index + 1}`];
            if (!stepReviewData) return false;

            return step.data.every(item => {
                if (Array.isArray(item.params[0].form)) {
                    return item.params[0].form.every(formType =>
                        stepReviewData[formType] && stepReviewData[formType].value !== ""
                    );
                } else {
                    return stepReviewData[item.params[0].form] && stepReviewData[item.params[0].form].value !== "";
                }
            });
        });
    };

    // 최소 한개의 필드가 채워졌는지 확인
    const isAnyFieldFilled = () => {
        return Object.keys(reviewData).length > 0;
    };


    return (
        <div>
            {!reviewMode ? (
                <>
                    {steps.map((stepData, index) => (
                        <div key={index}>
                            {stepData.data.map((item) => (
                                <div key={item.value}>
                                    {Array.isArray(item.params[0].form) ? (
                                        item.params[0].form.map((formType) =>
                                            renderFormType(item, stepData, formType)
                                        )
                                    ) : (
                                        renderFormType(item, stepData, item.params[0].form)
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={reset} disabled={!isAnyFieldFilled()}>Reset</button>
                    <button onClick={handleReview} disabled={!isAllFieldsFilled()}>Review</button>
                </>
            ) : (
                <div>
                    {Object.entries(reviewData).map(([step, data]) => (
                        <div key={step}>
                            {data.select && `${data.select.label}: ${data.select.value}`}
                            {data.select && data.input && <br />}
                            {data.input && `${data.input.label}: ${data.input.value}`}
                        </div>
                    ))}
                    <button onClick={reset}>Reset</button>
                </div>
            )}
        </div>
    );
}