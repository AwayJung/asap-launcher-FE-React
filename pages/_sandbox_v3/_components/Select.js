// 데이터 기반으로 동적으로 select option을 생성하는 컴포넌트
// 사용자가 드롭다운에서 옵션을 선택 시, selectParam 함수를 통해서 상위 컴포넌트로 전달
import React, { useEffect, useState } from 'react';

const Select = ({ data, selectParam }) => {
  // 드롭다운 옵션
  const [options, setOptions] = useState([]);
  // 선택된 값
  const [selectedValue, setSelectedValue] = useState('');
  // 드롭다운 라벨
  const [label, setLabel] = useState('');
  // 파라미터 키
  const [key, setKey] = useState('');

  // data가 변경될 때마다 options, label 설정
  useEffect(() => {
    if (data.length > 0) {
      setLabel(data[0].label);
      setKey(data[0].value);
      setOptions(data[0].params[0].items);
      setSelectedValue('');
    }
  }, [data]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    selectParam({ key: key, value: event.target.value });
  };

  return (
    <div>
      <label>*{label}:</label>
      <select value={selectedValue} onChange={handleChange}>
        <option value=''>Select an option</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
