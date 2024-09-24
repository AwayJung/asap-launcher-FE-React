import React, {useEffect, useState} from 'react';
import {Layout, Menu, Breadcrumb, theme, Button, Form, Space, Radio, message} from 'antd';
import Select from './components/Select';

const {Header, Content, Footer} = Layout;
// const { Option } = AntSelect;

const items = [{key: '1', label: 'ASAP Launcher'}];

const layout = {
    labelCol: {span: 8}, wrapperCol: {span: 16},
};

export default function ASAPLauncher() {
    const [params, setParams] = useState({});
    const [steps, setSteps] = useState([{step: 1, parent: null, data: []}]);
    const [selectedParams, setSelectedParams] = useState([]);
    const [tasks, setTasks] = useState({});
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [showMatchedTasks, setShowMatchedTasks] = useState(false);
    // const [isExecuting, setIsExecuting] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [executionResult, setExecutionResult] = useState(null);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    useEffect(() => {
        const params = require('/public/data/params.example.v0.1.json');
        const tasksData = require('/public/data/tasks.example.v0.1.json');
        console.log('Loaded params:', params);
        console.log('Loaded tasksData:', tasksData);
        setParams(params);
        setTasks(tasksData);
        const initialData = searchParams(params.data, 1, null);
        setSteps([{step: 1, parent: null, data: initialData}]);
    }, []);

    const selectParam = (step) => (param) => {
        console.log('Selected param object:', param);

        updateStep(step, param.value);
        updateSelectedParams(step, param);
    };

    const updateStep = (step, selectedValue) => {
        const updatedSteps = steps.slice(0, step);
        const nextStep = step + 1;
        const filteredData = searchParams(params.data, nextStep, selectedValue);
        if (filteredData.length > 0) {
            updatedSteps.push({
                step: nextStep, parent: selectedValue, data: filteredData,
            });
        }
        setSteps(updatedSteps);
    };

    const isAllFieldsFilled = selectedParams.length === steps.length;

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

    // Task 검색 로직
    function searchTasks() {
        if (!Array.isArray(tasks.data)) {
            console.error('Tasks data is not an array:', tasks.data);
            alert('관리자에게 문의해주세요.');
            setFilteredTasks([]);
            setShowMatchedTasks(false);
            return;
        }

        const selectedParamsString = selectedParams
            .map(param => `${param.step}:${param.key}`)
            .join('>');

        console.log('Selected Params String:', selectedParamsString);
        console.log('Tasks Data:', tasks.data);

        const matchedTasks = tasks.data.filter(task => task.params.startsWith(selectedParamsString));
        console.log('Matched Tasks:', matchedTasks);

        setFilteredTasks(matchedTasks);
        setShowMatchedTasks(matchedTasks.length > 0);

        if (matchedTasks.length === 0) {
            alert('해당 결과가 없습니다.');
        }
    }

    const reset = () => {
        const initialData = searchParams(params.data, 1, null);
        setSteps([{step: 1, parent: null, data: initialData}]);
        setSelectedParams([]);
        setFilteredTasks([]);
        setShowMatchedTasks(false);
        setSelectedTask(null);
    };

    const updateSelectedParams = (step, param) => {
        setSelectedParams((prevParams) => {
            const updatedParams = prevParams.filter(p => p.step < step);
            updatedParams.push({step, key: param.key, value: param.value});
            updatedParams.sort((a, b) => a.step - b.step);

            return updatedParams;
        });
    };

    const executeTask = async () => {
        // selectedParams를 api 요구사항 형식으로 변환
        const paramsObject = selectedParams.reduce((acc, param) => {
            acc[param.key] = param.value;
            return acc;
        }, {});

        // setIsExecuting(true);

        try {
            const response = await fetch('http://localhost:3000/api/test/launch', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    taskId: selectedTask.id,
                    params: paramsObject,
                }),
            });

            const result = await response.json();
            setExecutionResult({
                message: 'The Task was executed',
                task: selectedTask.name
            });
            message.success('작업이 성공적으로 실행되었습니다.');
            console.log('API 응답:', result);
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            message.error('작업 실행 중 오류가 발생했습니다.');
        } finally {
            // setIsExecuting(false);
        }
    };
    console.log('Current Selected Task:', selectedTask);
    return (<Layout>
        <Header
            style={{
                position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center',
            }}
        >
            <div className="demo-logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{
                    flex: 1, minWidth: 0,
                }}
            />
        </Header>
        <Content
            style={{
                padding: '0 48px',
            }}
        >
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                {steps.map((_, index) => (<Breadcrumb.Item key={index}>Phase {index + 1}</Breadcrumb.Item>))}
            </Breadcrumb>
            <div
                style={{
                    padding: 24, minHeight: 380, background: colorBgContainer, borderRadius: borderRadiusLG,
                }}
            >
                {executionResult ? (
                    <div>
                        <h2>{executionResult.message}</h2>
                        <p>Task: {executionResult.task}</p>
                        <Button onClick={() => {
                            setExecutionResult(null);
                            reset();
                        }}>
                            Ok
                        </Button>
                    </div>
                ) : !showMatchedTasks ? (
                    <Form layout="vertical" style={{maxWidth: 600}}>
                        {steps.map(({step, data}, index) => (
                            <Select key={index} data={data} selectParam={selectParam(step)}/>))}
                        <Form.Item>
                            <Space>
                                <Button onClick={reset}>Reset</Button>
                                <Button
                                    type="primary"
                                    onClick={searchTasks}
                                    disabled={!isAllFieldsFilled}
                                >
                                    Review
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                ) : (
                    <div>
                        <h3>Matched Tasks:</h3>
                        <Radio.Group
                            value={selectedTask ? selectedTask.id : null}
                            onChange={(e) => setSelectedTask(filteredTasks.find(task => task.id === e.target.value))}
                            style={{marginBottom: 16, display: 'flex', flexDirection: 'column'}}
                        >
                            {filteredTasks.map((task) => (
                                <Radio key={task.id} value={task.id} style={{marginBottom: 8}}>
                                    {task.name}
                                </Radio>
                            ))}
                        </Radio.Group>
                        <Space>
                            <Button onClick={reset}>Previous</Button>
                            <Button onClick={() => setSelectedTask(null)}>Reset</Button>
                            <Button
                                type="primary"
                                onClick={executeTask}
                                // loading={isExecuting}
                                disabled={!selectedTask}
                            >
                                Execute
                            </Button>
                        </Space>
                    </div>
                )}
            </div>
        </Content>
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            ASAP Launcher ©{new Date().getFullYear()} Created by Wonjung
        </Footer>
    </Layout>);
}