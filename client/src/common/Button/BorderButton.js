import React from 'react';
import './BorderButton.css';

function BorderButton(props) {

  /*
    ### props

    name      ─ button에 표기할 text : required
    addClass  ─ button에 추가할 Class가 필요한 경우 지정
    style     ─ button의 style 조정이 필요한 경우 지정
    onHandle  ─ button 클릭 시 수행할 함수(event를 넘김)
  */

  const name = props.name;
  const addClass = props.addClass;
  const style = props.style || {};
  const onHandle = (e) => {
    if (!props.onHandle || props.onHandle === '') return false;

    props.onHandle(e);
  };

  return (
    <button
      type="button"
      className={!addClass ? 'BorderButton' : `BorderButton ${addClass}`}
      onClick={e => onHandle(e)}
      style={style}
    >
      {name}
    </button>
  );
}

export default BorderButton;
