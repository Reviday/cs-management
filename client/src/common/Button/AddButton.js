import React, { useRef, useState } from 'react';
import './AddButton.scss';
import { Link } from 'react-router-dom';

function AddButton(props) {
  const input = useRef();
  const [name, setName] = useState('');

  const onHandle = (e) => {
    e.preventDefault();
    setName(input.current.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      document.getElementById('addBtn').click();
    }
  };

  return (
    <React.Fragment>
      <div className="inputBtn">
        <Link
          to={{
            pathname: props.url,
            state: {
              name: name
            }
          }}
        >
          <button type="button" className="inputBtnStyle add" id="addBtn" />
        </Link>
        <input
          className="inputBtnTemp"
          required="temp"
          type="text"
          ref={input}
          onChange={e => onHandle(e)}
          onKeyPress={e => handleKeyPress(e)}
        />
        <label alt={props.text} placeholder={props.text} />
      </div>
    </React.Fragment>
  );
}

export default AddButton;
