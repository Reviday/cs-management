import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Modal = (props) => {

  const ModalContent = props.contents || null;
  const boxStyle = props.style || {};
  const data = props.set.data || {};
  // 정해져 있는 props, 그 외 함수 및 변수 등을 Content에 props로 전달할 때 사용.
  const items = props.items || {};
  const title = props.title || '';

  if (props.set.view) {
    return ReactDOM.createPortal(
      <React.Fragment>

        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal_layout">
            <div className="modal_box" style={boxStyle}>
              <div className="modal_top">
                <div className="m_title _left">
                  {title}
                </div>
                <div className="m_title _right">
                  <div className="m_close" onClick={props.hide} onKeyDown={props.hide} />
                </div>
              </div>
              {
                ModalContent !== null
                  ? <ModalContent hide={props.hide} data={data} items={items} />
                  : <div>Contents does not exist.</div>
              }
            </div>
          </div>
        </div>

      </React.Fragment>, document.body
    );
  }
  return null;
};


export default Modal;
