import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Alert = (props) => {
  /*
    # 해당 컴포넌트를 사용하는 곳에서는 다음과 같은 useState가 필수로 필요함.
    const [alertModal, setAlertModal] = useState({
      show: false,
      title: '',
      content: ''
    });

    # 해당 컴포넌트를 사용하는 곳에서는 다음과 같은 함수가 필수로 필요함.
    const toggleAlert = () => {
      setAlertModal({
        show: false,
        title: '',
        content: ''
      });
    };

    ### props

    view    ─ Alert를 보이게 할지 여부를 값으로 가짐.
              alertModal의 useState 값 중, show를 의미 : required
    title   ─ Alert 창의 제목을 의미.
              alertModal의 useState 값 중, title을 의미 : required
    content ─ Alert 창의 내용을 의미.
              alertModal의 useState 값 중, content를 의미 : required
    hide    ─ Alert 창을 x 버튼으로 종료시킬때(초기화) 사용.
              toggleModal을 의미 : required

  */
  if (props.view) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal_layout">
            <div className="modal_box_tp1">
              <div className="modal_top">
                <div className="m_title _left">
                  {props.title}
                </div>
                <div className="m_title _right">
                  <div className="m_close" onClick={props.hide} onKeyDown={props.hide} />
                </div>
              </div>
              <div className="modal_content_center">
                <div className="_alert">{props.content}</div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>, document.body
    );
  }
  return null;
};


export default Alert;
