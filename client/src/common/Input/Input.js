import React from 'react';
import './Input.css';

function Input(props) {

  /*
    ### props

    type        ─ input 태그의 type을 지정 : (default: text)
    name        ─ 좌측 패널에 표기할 input의 이름 : required
    value       ─ 초기값이 필요할 경우 지정(일반적으로 useState의 value)
    setValue    ─ useState의 setValue로, 입력 시 state값을 변경시키기 위해 필요 : required
    placeholder ─ 표기할 placeholder가 필요한 경우 지정 : (default : 'Input [name]')
    style       ─ input 스타일 조정이 필요할 시 사용
    setReg      ─ 입력 값의 정규식이 필요할 경우 사용
    disabled    ─ 해당 input에 입력 제한을 설정할 경우 사용
  */

  const type = props.type || 'text'; // input type (default: text)
  const name = props.name; // name
  const value = props.value; // input value
  const setValue = props.setValue;
  const placeholder = props.placeholder;
  const style = props.style || {};
  const setReg = props.setReg; // 입력 정규식 설정
  const disabled = props.disabled || false;

  const onHandle = (e) => {
    e.preventDefault();
    if (setReg && setReg.test(e.target.value)) {
      setValue(e.target.value);
    } else if (!setReg) {
      setValue(e.target.value);
    }
  };

  return (
    <React.Fragment>
      <div className="inputName">
        <p>
          {name}
        </p>
      </div>
      <div className="input">
        <input
          type={type}
          value={value}
          placeholder={placeholder || `Insert ${name}`}
          onChange={e => onHandle(e)}
          style={style}
          disabled={disabled}
        />
      </div>
    </React.Fragment>
  );
}

export default Input;
