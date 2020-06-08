import React, { useRef } from 'react';
import './Select.css';


function Select(props) {

  /*
    ### props

    name        ─ 좌측에 들어갈 Select의 명칭을 의미 : required
    column      ─ option의 Text로 사용될 list의 컬럼 이름(이 값이 지정되어 있지 않을 경우 list를 단일 원소의 배열로 봄)
    setValue    ─ Select로 선택된 값을 set 하기위한 useState : required
    list        ─ Select Option List : required
    default     ─ Select의 기본값을 설정(option값 중 default) : default 또는 defaultText 중 하나는 required
    defaultText ─ Select의 기본값 대신 표기할 Text 설정
    style       ─ select에 지정할 style
  */

  const name = props.name;
  const column = props.column;
  const setValue = props.setValue;
  const list = props.list;
  const defaultValue = props.default; // 기본 값(우선)
  const defaultText = props.defaultText; // 기본 텍스트
  const style = props.style || {};

  const selected = useRef();

  const onHandle = (e) => {
    setValue(list.find(e => e._id === selected.current.value));
  };

  return (
    <React.Fragment>
      {
        name ? (
          <div className="inputName">
            <p>
              {name}
            </p>
          </div>
        )
          : ''
      }

      <div className="select">
        <select name="" id="" defaultValue={defaultValue || defaultText} ref={selected} onChange={onHandle} style={style}>
          { defaultText && <option disabled hidden>{defaultText}</option> }
          {
            list.map((item, index) => {
              return (
                <option value={item._id || item} key={item._id || index}>
                  {column ? item[column] : item}
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
