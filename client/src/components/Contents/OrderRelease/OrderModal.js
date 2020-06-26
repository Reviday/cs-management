import React, { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import Input from 'common/Input/Input';
import InputCustom from 'common/Input/InputCustom';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import BorderButton from 'common/Button/BorderButton';
import Config from 'config';
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

  const selected = useRef();

  const onHandle = (e) => {
    setValue(list.find(e => e._id === selected.current.value));
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

  // 일괄 order 처리 함수
  // conf
  const executeOrder = async (type, id) => {

    // data default setting
    let data = {
      category: 'order',
      action: '',
      site: state.site,
      name: state.name,
      telpno: state.telpno,
      address: state.address,
      needs: state.needs,
      product: state.product,
      price: state.price,
      order_status: state.order_status,
      // order_date: state.order_date,
      // complete_date: state.complete_date
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
        return false;
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
      <div className="modal_content" style={{ height: '550px', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content fx_h_380">
              <div className="grid_box">
                <div className="rows-mb-20">
                  <div className="row_title">
                    지점
                  </div>
                  <div className="row_input">
                    <select ref={selected} onChange={onHandle}>
                      {
                        state.list?.map((item, index) => {
                          return (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
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
                    name="상품명"
                    value={state.product}
                    setValue={e => setState({ ...state, product: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="가격"
                    value={state.price}
                    setValue={e => setState({ ...state, price: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="특이사항"
                    value={state.needs}
                    setValue={e => setState({ ...state, needs: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'insertOrder'
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
                                content: '주문을 등록하시겠습니까?',
                                type: 'insert'
                              });
                            }}
                            name="등록"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => executeOrder('cancel')}
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
                                content: '주문을 수정하시겠습니까?',
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
                                content: '주문을 삭제하시겠습니까?',
                                type: 'delete',
                                id: state?.id
                              });
                            }}
                            name="삭제"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => executeOrder('cancel')}
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
        execute={executeOrder(confirmModal.type, confirmModal?.id)}
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
