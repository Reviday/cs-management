import React, { useRef } from 'react';
import './Select.css';

// 보강이 더 필요함.
// 추후, 데이터도 불러올 수 있게 되면 수정할 예정.
function Select(props) {

  /*
    ### props

    name        ─ 좌측 패널에 표기할 input의 이름 : required
    placeholder ─ 표기할 placeholder가 필요한 경우 지정 : (default : 'Input [name]')
  */
  const selected = useRef();
  const name = props.name || 'Input'; // name
  const list = props.list || [];
  const setKey = props.setKey; // list의 원소가 object 형식일 때 사용. value 값을 추출할 key값을 사용.
  const setVal = props.setVal; // list의 원소가 object 형식일 때 사용. option에 표기하기 위한 텍스트를 추출할 key값을 사용.
  const setValue = props.setValue;
  // const defaultValue = props.defaultValue; // Select의 기본 값 설정

  const onHandle = (e) => {
    let findData = list.find(e => String(e[setKey].toString()) === String(selected.current.value));
    // list의 원소가 단일 값일 경우 처리되는 로직.
    if (!findData) {
      findData = list.find(e => e === selected.current.value);
      setValue(findData);
    } else {
      setValue(findData[setKey]);
    }
  };

  return (
    <React.Fragment>
      <div className="row_title">
        {name}
      </div>
      <div className="row_input">
        <select ref={selected} onChange={e => onHandle(e)}>
          {
            list?.map((item, index) => {
              if (typeof item === 'object') {
                return (
                  <option value={item[setKey]} key={index}>
                    {item[setVal]}
                  </option>
                );
              }
              return (
                <option value={item} key={index}>
                  {item}
                </option>
              );
            })
          }
        </select>
      </div>
    </React.Fragment>
  );
}

export default Select;
