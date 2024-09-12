import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, theme, Button, Form, Space, Select as AntSelect } from 'antd';
import Select from './components/Select';

const { Header, Content, Footer } = Layout;
// const { Option } = AntSelect;

const items = [{ key: '1', label: 'ASAP Launcher' }];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function ASAPLauncher() {
  const [params, setParams] = useState({});
  const [steps, setSteps] = useState([{ step: 1, parent: null, data: [] }]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [tasks, setTasks] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showMatchedTasks, setShowMatchedTasks] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const params = require('/public/data/params.example.v0.1.json');
    const tasksData = require('/public/data/tasks.example.v0.1.json');
    console.log('Loaded params:', params);
    console.log('Loaded tasksData:', tasksData);
    setParams(params);
    setTasks(tasksData);
    const initialData = searchParams(params.data, 1, null);
    setSteps([{ step: 1, parent: null, data: initialData }]);
  }, []);

  const selectParam = (step) => (param) => {
    console.log(`Selected param key: ${param.key}, value: ${param.value}`);

    updateStep(step, param.value);
    updateSelectedParams(step, param);
  };

  const updateStep = (step, selectedValue) => {
    const updatedSteps = steps.slice(0, step);
    const nextStep = step + 1;
    const filteredData = searchParams(params.data, nextStep, selectedValue);
    if (filteredData.length > 0) {
      updatedSteps.push({
        step: nextStep,
        parent: selectedValue,
        data: filteredData,
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
        const selectedParamsString = selectedParams
            .map(param => `${param.step}:${param.key}`)
            .join('>');

        console.log('Selected Params String:', selectedParamsString);
        console.log('Tasks Data:', tasks.data);

        if (Array.isArray(tasks.data)) {
            const matchedTasks = tasks.data.filter(task =>
                task.params.startsWith(selectedParamsString)
            );
            console.log('Matched Tasks:', matchedTasks);
            setFilteredTasks(matchedTasks);
        } else {
            console.error('Tasks data is not an array:', tasks.data);
        }

        setShowMatchedTasks(true);
    }

  const reset = () => {
    const initialData = searchParams(params.data, 1, null);
    setSteps([{ step: 1, parent: null, data: initialData }]);
    setSelectedParams([]);
    setFilteredTasks([]);
    setShowMatchedTasks(false);
  };

  const updateSelectedParams = (step, param) => {
    setSelectedParams((prevParams) => {
      const updatedParams = prevParams.filter(p => p.step < step);
      updatedParams.push({ step, key: param.key, value: param.value });
      updatedParams.sort((a, b) => a.step - b.step);

      return updatedParams;
    });
  };

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
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
                    {steps.map((_, index) => (
                        <Breadcrumb.Item key={index}>Phase {index + 1}</Breadcrumb.Item>
                    ))}
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {!showMatchedTasks && (
                        <Form layout="vertical" style={{ maxWidth: 600 }}>
                            {steps.map(({ step, data }, index) => (
                                <Select key={index} data={data} selectParam={selectParam(step)} />
                            ))}
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
                    )}

                    {showMatchedTasks && (
                        <div>
                            <h3>Matched Tasks:</h3>
                            <ul>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => (
                                        <li key={index}>{task.name}</li>
                                    ))
                                ) : (
                                    <li>No tasks matched.</li>
                                )}
                            </ul>
                            <Space>
                                <Button onClick={reset}>Back</Button>
                                <Button type="primary">Execute</Button>
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
        </Layout>
    );
}