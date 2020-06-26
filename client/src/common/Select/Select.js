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
  const setValue = props.setValue;

  const onHandle = () => {
    setValue(list.find(e => e._id === selected.current.value));
  };

  return (
    <React.Fragment>
      <div className="row_title">
        {name}
      </div>
      <div className="row_input">
        <select ref={selected} onChange={onHandle}>
          {
            list?.map((item, index) => {
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
