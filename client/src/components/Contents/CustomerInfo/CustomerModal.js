import React, { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import Input from 'common/Input/Input';
import InputCustom from 'common/Input/InputCustom';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import BorderButton from 'common/Button/BorderButton';
import 'common/Modal/Modal.scss';

const ModalContents = (props) => {
  const [state, setState] = useState(props.data);
  const items = props.items;

  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: ''
    });
  };

  // confirmModal State
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleConfirm = () => {
    setConfirmModal({
      show: false,
      title: '',
      content: '',
      type: ''
    });
  };

  const checkValidate = () => {
    let validation = true;
    let message = '';


    /**
     * check validate
     */


    // validation에서 체크되지 않은 항목이 존재하면 alert창 출력
    if (!validation) {
      setAlertModal({
        show: true,
        title: '오류 메시지',
        content: message
      });
    }

    return validation;
  };


  // 일괄 처리 함수
  const executeCustomer = async (type, id) => {
    // check validate
    if (checkValidate()) return false;

    // data setting
    let data = {
      category: 'order',
      action: '',
      /**
       * 고객 테이블 인터페이스 정리 후 작업.
       */
    };

    switch (type) {

      case 'insert':
        data.action = 'i';
        break;
      case 'update':
        data.id = id;
        data.action = 'u';
        break;
      case 'delete':
        data = {
          category: 'order',
          id: id,
          action: 'd',
        };
        break;
      case 'cancel':
        // state값 초기화 후, modal 닫기
        setState({});
        props.hide();
        break;
      default: return false;

    }

    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: data
    };

    try {
      console.log('options:::', options);
      let setData = await axios(options);
      console.log('setData:::', setData);

      let result = setData.data.data;
      console.log(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 주소 검색
  const addrSearch = () => {

  };

  return (
    <React.Fragment>
      <div className="modal_content" style={{ height: 'fit-content', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div" style={{ minHeight: '515px', height: 'fit-content' }}>
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20">
                  <Input
                    name="고객명"
                    value={state.name}
                    setValue={e => setState({ ...state, name: e })}
                    style={{ width: '150px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="연락처"
                    value={state.telpno}
                    setValue={e => setState({ ...state, telpno: e })}
                    style={{ width: '300px' }}
                    setReg={/^[0-9\b]+$/}
                  />
                </div>
                <div className="rows-mb-20">
                  <InputCustom
                    name="주소"
                    topObj={{
                      value: state.zipcode,
                      setValue: e => setState({ ...state, zipcode: e }),
                      placeholder: '우편번호',
                      style: { width: '100px' },
                      disabled: true
                    }}
                    bottomObj={{
                      value: state.address,
                      setValue: e => setState({ ...state, address: e }),
                      placeholder: '상세주소',
                      style: { width: '300px' },
                    }}
                    btnObj={{
                      addClass: 'addr_searchBtn',
                      value: '주소 검색',
                      onClick: addrSearch
                    }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="고객선호 스타일"
                    value={state.any}
                    setValue={e => setState({ ...state, any: e })}
                    style={{ width: '300px', marginTop: '7px' }}
                    titleStyle={{ fontSize: '15px', lineHeight: '16px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="고객선호 원단"
                    value={state.any}
                    setValue={e => setState({ ...state, any: e })}
                    style={{ width: '300px', marginTop: '7px' }}
                    titleStyle={{ fontSize: '15px', lineHeight: '16px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="메모"
                    value={state.memo}
                    setValue={e => setState({ ...state, memo: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  {/* 수정해야함 틀만 만들어놓은거 */}
                  <Input
                    name="사진등록"
                    value={state.memo}
                    setValue={e => setState({ ...state, memo: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'insertCustomer'
                      ? (
                        <React.Fragment>
                          <BorderButton
                            addClass="insertBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
                              setConfirmModal({
                                show: true,
                                title: '확인 메시지',
                                content: '고객을 등록하시겠습니까?',
                                type: 'insert'
                              });
                            }}
                            name="등록"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => executeCustomer('cancel')}
                            name="취소"
                            style={{ width: '80px' }}
                          />
                        </React.Fragment>
                      )
                      : (
                        <React.Fragment>
                          <BorderButton
                            addClass="updateBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
                              setConfirmModal({
                                show: true,
                                title: '확인 메시지',
                                content: '고객 정보를 수정하시겠습니까?',
                                type: 'update',
                                id: state?.id
                              });
                            }}
                            name="수정"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="deleteBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
                              setConfirmModal({
                                show: true,
                                title: '확인 메시지',
                                content: '고객 정보를 삭제하시겠습니까?',
                                type: 'delete',
                                id: state?.id
                              });
                            }}
                            name="삭제"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => executeCustomer('cancel')}
                            name="취소"
                            style={{ width: '80px' }}
                          />
                        </React.Fragment>
                      )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Confirm
        view={confirmModal.show}
        title={confirmModal.title}
        content={confirmModal.content}
        hide={toggleConfirm}
        execute={() => executeCustomer(confirmModal.type, confirmModal?.id)}
      />
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        hide={toggleAlert}
      />
    </React.Fragment>
  );
};

export default ModalContents;
