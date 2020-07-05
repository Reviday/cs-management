import React, { useState, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';

import Input from 'common/Input/Input';
import Select from 'common/Select/Select';
import InputCustom from 'common/Input/InputCustom';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import BorderButton from 'common/Button/BorderButton';
import Config from 'config';
import 'common/Modal/Modal.scss';

const ModalContents = (props) => {
  const items = props.items;
  const siteList = items.siteList;
  const [state, setState] = useState(
    items.type === 'insertOrder'
      ? {
        site: siteList[0].site,
        name: '',
        telpno: '',
        zipcode: '',
        address: '',
        product: '',
        price: '',
        needs: '',
        price_type: 0,
        order_status: 0,
        manager: ''
      }
      : props.data
  );

  const priceType = [
    { code: 0, text: '미결재' },
    { code: 1, text: '현금 결재' },
    { code: 2, text: '카드 결재' }
  ];

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

  // 일괄 order 처리 함수
  // conf
  const executeOrder = async (type, id) => {

    // data default setting
    let data = {
      category: 'order',
      action: '',
      site: state.site,
      name: state.name,
      telpno: state.telpno.replace(/[^0-9]/g, ''),
      address: state.address,
      needs: state.needs,
      product: state.product,
      price: state.price.replace(/[^0-9]/g, ''),
      order_status: state.order_status,
      price_type: state.price_type,
      manager: state.manager,
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
      data: qs.stringify(data),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      console.log('options:::', options);
      let setData = await axios(options);
      console.log('setData:::', setData);

      let result = setData.data.data; // true

      // 정상적으로 처리되었고, type이 insert일 때
      if (result && type === 'insert') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '주문 등록이 완료되었습니다.'
        });
        // 모달창 종료 및 데이터 다시 가져오기.
        props.hide();
        items.getOrderList('order');
        items.getOrderList('ship');
      // 정상적으로 처리되었고, type이 update일 때
      } else if (result && type === 'update') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '주문 수정이 완료되었습니다.'
        });
        // 모달창 종료 및 데이터 다시 가져오기.
        props.hide();
        items.getOrderList('order');
        items.getOrderList('ship');
      // 정상적으로 처리되었고, type이 delete일 때
      } else if (result && type === 'delete') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '주문 삭제가 완료되었습니다.'
        });
        // 모달창 종료 및 데이터 다시 가져오기.
        props.hide();
        items.getOrderList('order');
        items.getOrderList('ship');
      // 그 외, result가 true가 아닐 경우.
      // type이 세 가지 안에 포함되지 않으면 상단에서 return 되므로.
      } else {
        setAlertModal({
          show: true,
          title: '오류 메시지',
          content: '문제가 발생하였습니다. 잠시 후 다시 시도해주시기 바랍니다.'
        });
      }
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
      <div className="modal_content" style={{ height: '670px', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content fx_h_380">
              <div className="grid_box">
                <div className="rows-mb-20">
                  {
                    // siteList가 존재하지 않거나, 개수가 0개이면
                    // input 스타일로 처리. 있으면 select 스타일로 처리.
                    siteList && siteList.length > 0
                      ? (
                        <Select
                          name="지점"
                          setKey="s_code"
                          setVal="site"
                          list={siteList}
                          setValue={e => setState({ ...state, site: e })}
                        />
                      )
                      : (
                        <Input
                          name="지점"
                          value={state.site}
                          setValue={() => {}} // 값을 바꾸지 않음.
                          style={{ width: '120px' }}
                          disabled
                        />
                      )
                  }
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
                <div className="rows-mb-20">
                  {
                    // siteList가 존재하지 않거나, 개수가 0개이면
                    // input 스타일로 처리. 있으면 select 스타일로 처리.
                    // siteList를 넘기지 않는건, 수정 기능을 제공하지 않기 때문에 input으로 출력
                    siteList && siteList.length > 0
                      ? (
                        <Select
                          name="결제상태"
                          list={priceType}
                          setKey="code"
                          setVal="text"
                          setValue={e => setState({ ...state, price_type: e })}
                        />
                      )
                      : (
                        <Input
                          name="결제상태"
                          value={priceType.filter(item => item.code === state.price_type)[0].text}
                          setValue={() => {}} // 값을 바꾸지 않음.
                          style={{ width: '120px' }}
                          disabled
                        />
                      )
                    }
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="매니저"
                    value={state.manager}
                    setValue={e => setState({ ...state, manager: e })}
                    style={{ width: '300px' }}
                  />
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'insertOrder'
                      && (
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
                      )
                  }
                  {
                    items.type === 'update'
                      && (
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
                        </React.Fragment>
                      )
                  }
                  <BorderButton
                    addClass="cancelBtn"
                    onHandle={() => executeOrder('cancel')}
                    name="취소"
                    style={{ width: '80px' }}
                  />
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
        execute={() => executeOrder(confirmModal.type, confirmModal?.id)}
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
