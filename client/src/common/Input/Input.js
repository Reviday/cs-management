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
    titleStyle  ─ title div 스타일 조정이 필요할 시 사용
    setReg      ─ 입력 값 필터링을 위한 정규식. (입력 제한할 대상의 정규식을 사용 - replace 대상)
    disabled    ─ 해당 input에 입력 제한을 설정할 경우 사용
  */

  const type = props.type || 'text'; // input type (default: text)
  const name = props.name || 'Input'; // name
  const value = props.value; // input value
  const setValue = props.setValue;
  const placeholder = props.placeholder;
  const style = props.style || {};
  const titleStyle = props.titleStyle || {};
  const setReg = props.setReg; // 입력 정규식 설정
  const disabled = props.disabled || false;

  const filterKey = (e) => {
    if (setReg) {
      let strKey = String.fromCharCode(e.keyCode);
      console.log(e.keyCode, strKey, setReg.test(strKey));
      if (!setReg.test(strKey)) e.returnValue = '';
    }
  };

  const onHandle = (e) => {
    e.preventDefault();
    if (setReg) {
      setValue(e.target.value.replace(setReg, ''));
    } else {
      setValue(e.target.value);
    }
    
  };

  return (
    <React.Fragment>
      <div className="row_title" style={titleStyle}>
        {name}
      </div>
      <div className="row_input">
        <input
          type={type}
          value={value}
          placeholder={placeholder || name}
          onChange={e => onHandle(e)}
          style={style}
          disabled={disabled}
        />
      </div>
    </React.Fragment>
  );
}

export default Input;
