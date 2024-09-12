import { useEffect, useState } from 'react';
import Select from './_components/Select';

export default function Index() {
  const [params, setParams] = useState({});
  const [steps, setSteps] = useState([{ step: 1, parent: null, data: [] }]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [tasks, setTasks] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showMatchedTasks, setShowMatchedTasks] = useState(false);

  useEffect(() => {
    const params = require('/public/data/params.example.v0.1.json');
    const tasksData = require('/public/data/tasks.example.v0.1.json');
    console.log('Loaded params:', params);
    console.log('Loaded tasksData:', tasksData);
    setParams(params);
    setTasks(tasksData); // tasksData가 객체로 설정됨
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
      <div>
        {!showMatchedTasks && (
            <>
              {steps.map(({ step, parent, data }, index) => (
                  <Select key={index} data={data} selectParam={selectParam(step)} />
              ))}
              <button onClick={reset}>Reset</button>
              <button
                  onClick={isAllFieldsFilled ? searchTasks : undefined}
                  disabled={!isAllFieldsFilled}
              >
                Review
              </button>
            </>
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
              <button onClick={reset}>Back</button>
              <button>Execute</button>
            </div>
        )}
      </div>
  );
}
