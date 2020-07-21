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
  const name = props.name; // name
  const list = props.list || [];
  const setKey = props.setKey; // list의 원소가 object 형식일 때 사용. value 값을 추출할 key값을 사용.
  const setVal = props.setVal; // list의 원소가 object 형식일 때 사용. option에 표기하기 위한 텍스트를 추출할 key값을 사용.
  const value = props.value;
  const setValue = props.setValue;

  /* 사용 유의! */
  const useAll = props.useAll; // '전체' 선택지를 만들기 위한 props (array가 object 형식일때만 사용. setValue 예외처리는 사용자가 해야함)

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
      {
        name && (
          <div className="row_title">
            {name}
          </div>
        )
      }
      <div className="row_input">
        <select ref={selected} value={value} onChange={e => onHandle(e)}>
          {
            useAll && (<option value="all">전체</option>)
          }
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
