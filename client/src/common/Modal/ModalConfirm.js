import React from 'react';
import ReactDOM from 'react-dom';
import BorderButton from 'common/Button/BorderButton';
import './Modal.scss';

const Confirm = (props) => {
  /*
    # 해당 컴포넌트를 사용하는 곳에서는 다음과 같은 useState가 필수로 필요함.
    const [confirmModal, setConfirmModal] = useState({
      show: false,
      title: '',
      content: ''
    });

    # 해당 컴포넌트를 사용하는 곳에서는 다음과 같은 함수가 필수로 필요함.
    const toggleConfirm = () => {
      setAlertModal({
        show: false,
        title: '',
        content: ''
      });
    };

    ### props

    view    ─ Confirm 창을 보이게 할지 여부를 값으로 가짐.
              confirmModal의 useState 값 중, show를 의미 : required
    title   ─ Confirm 창의 제목을 의미.
              confirmModal의 useState 값 중, title을 의미 : required
    content ─ Confirm 창의 내용을 의미.
              confirmModal의 useState 값 중, content를 의미 : required
    hide    ─ Confirm 창을 x 버튼으로 종료시킬때(초기화) 사용.
              toggleModal을 의미 : required
    execute - Confirm 창에서 '확인'을 누를 경우 실행시킬 함수

  */

  const confirm = () => {
    // execute가 존재하지 않으면 false return
    if (!props.execute) return false;
    props.execute();

    props.hide();
  };

  const cancel = () => {
    // 추후, cancel시 발생시킬 이벤트 추가할 경우 이곳에.

    props.hide();
  };

  if (props.view) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal_layout">
            <div className="modal_box_tp1" style={{ height: '160px' }}>
              <div className="modal_top">
                <div className="m_title _left">
                  {props.title}
                </div>
                <div className="m_title _right">
                  <div className="m_close" onClick={props.hide} onKeyDown={props.hide} />
                </div>
              </div>
              <div className="modal_content_center" style={{ height: '80px' }}>
                <div className="_confirm">{props.content}</div>
              </div>
              <div className="modal_btn_center">
                <div className="_confirmBtn">
                  <BorderButton
                    addClass="confirm"
                    onHandle={e => confirm(e)}
                    name="확인"
                  />
                  <BorderButton
                    addClass="cancel"
                    onHandle={e => cancel(e)}
                    name="취소"
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </React.Fragment>, document.body
    );
  }
  return null;
};


export default Confirm;
