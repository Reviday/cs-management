import React from 'react';
import './Input.css';

// Input Custom
function InputCustom(props) {

  /*
    ### props object

    type        ─ input 태그의 type을 지정 : (default: text)
    name        ─ 좌측 패널에 표기할 input의 이름 : required
    value       ─ 초기값이 필요할 경우 지정(일반적으로 useState의 value)
    setValue    ─ useState의 setValue로, 입력 시 state값을 변경시키기 위해 필요 : required
    placeholder ─ 표기할 placeholder가 필요한 경우 지정 : (default : 'Input [name]')
    style       ─ input 스타일 조정이 필요할 시 사용
    setReg      ─ 입력 값의 정규식이 필요할 경우 사용
    disabled    ─ 해당 input에 입력 제한을 설정할 경우 사용
  */

  // 각각의 top, bottom Object는 위의 요소를 갖는다.
  const name = props.name || 'Input'; // name
  const topObj = props.topObj || {}; // 상단 input에 설정할 값
  const bottomObj = props.bottomObj || {}; // 하단 input에 설정할 값
  const btnObj = props.btnObj || {}; // 버튼 input에 설정할 값

  const onHandle = (e, type) => {
    e.preventDefault();
    if (type === 'top') {
      if (topObj.setReg && topObj.setReg.test(e.target.value)) {
        topObj.setValue(e.target.value);
      } else if (!topObj.setReg) {
        topObj.setValue(e.target.value);
      }
    } else if (type === 'bottom') {
      if (bottomObj.setReg && bottomObj.setReg.test(e.target.value)) {
        bottomObj.setValue(e.target.value);
      } else if (!bottomObj.setReg) {
        bottomObj.setValue(e.target.value);
      }
    }
    
  };

  return (
    <React.Fragment>
      <div className="row_title">
        {name}
      </div>
      <div className="row_input" style={{ width: '360px' }}>
        <input
          type={topObj?.type || 'text'}
          value={topObj?.value}
          placeholder={topObj?.placeholder}
          onChange={e => onHandle(e, 'top')}
          style={topObj?.style}
          disabled={topObj?.disabled}
        />
        <input
          className={btnObj.addClass}
          type="button"
          value={btnObj.value}
          onClick={btnObj.onClick}
          disabled={btnObj.disabled}
        />
        <input
          type={bottomObj?.type || 'text'}
          value={bottomObj?.value}
          placeholder={bottomObj?.placeholder}
          onChange={e => onHandle(e, 'bottom')}
          style={bottomObj?.style}
          disabled={bottomObj?.disabled}
        />
      </div>
    </React.Fragment>
  );
}

export default InputCustom;
