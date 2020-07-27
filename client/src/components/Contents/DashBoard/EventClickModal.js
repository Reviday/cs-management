import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';

import Select from 'common/Select/Select';
import Input from 'common/Input/Input';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import BorderButton from 'common/Button/BorderButton';
import DatePicker from 'common/Input/InputDatepicker';
import 'common/Modal/Modal.scss';
import Config from 'config';

// context
import { SiteListContext } from 'contexts/SiteListContext';

const ModalContents = (props) => {
  const items = props.items;
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [state, setState] = useState({
    name: '',
    telpno: '',
    memo: '',
    counseling_status: 0
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: '',
      type: ''
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

    // 1. 각 data 별로 빈 값이 존재하는지 체크
    if (validation) {
      // 필수로 입력되어야 하는 요소 목록
      // select는 넣을 필요가 없지만 일단 필수 요소이기에 추가.

      /*
      let checkList = [
        { key: 'site', name: '지점' }, // select
        { key: 'name', name: '고객명' }, // input
        { key: 'telpno', name: '연락처' }, // input
        { key: 'zipcode', name: '우편번호' }, // input - API
        { key: 'address', name: '주소' }, // input - API
        { key: 'detail_addr', name: '상세주소' }, // input
      ];

      for (let key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          // state의 해당 key가 필수 목록에 포함되는지 체크
          let checkField = checkList.filter(item => item.key === key);
          if (checkField.length > 0) {
            if (state[key] === undefined || state[key] === '') {
              validation = false;
              message = `${checkField[0].name}을(를) 입력해주시기 바랍니다.`;
              break;
            }
          }
        }
      }
      */
    }


    // validation에서 체크되지 않은 항목이 존재하면 alert창 출력
    if (!validation) {
      setAlertModal({
        show: true,
        title: '알림 메시지',
        content: message,
        type: 'common'
      });
    }

    return validation;
  };

  return (
    <React.Fragment>
      <div className="modal_content" style={{ height: 'fit-content', overflow: 'hidden', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div" style={{ minHeight: '515px', height: 'fit-content' }}>
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20">
                  {
                  // siteList가 존재하지 않거나, 개수가 0개이면
                  // input 스타일로 처리. 있으면 select 스타일로 처리.
                  items.type !== 'showEvent'
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
                    disabled={items.type === 'showEvent'}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="연락처"
                    value={state.telpno}
                    setValue={e => setState({ ...state, telpno: e })}
                    style={{ width: '300px' }}
                    setReg={/[^0-9]/gi}
                    disabled={items.type === 'showEvent'}
                  />
                </div>
                <div className="rows-mb-20">
                  <div className="row_title">
                    상담시간
                  </div>
                  <DatePicker
                    startTitle="시작시간"
                    endTitle="종료시간"
                    startState={[startDate, setStartDate]}
                    endState={[endDate, setEndDate]}
                    useTime
                    isClearable={items.type !== 'showEvent'}
                    disabled={items.type === 'showEvent'}
                  />
                </div>
                <div className="rows-mb-20" style={{ height: '180px' }}>
                  <div className="row_title">
                    메모
                  </div>
                  <div className="needs_area">
                    <textarea
                      value={state.memo}
                      onChange={e => setState({
                        ...state,
                        memo: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="rows-mb-20" style={{ height: '40px' }}>
                  <div className="row_title">
                    상담종류
                  </div>
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  <BorderButton
                    addClass="updateBtn"
                    onHandle={() => {
                    // check validate
                      if (!checkValidate()) return false;
                      setConfirmModal({
                        show: true,
                        title: '확인 메시지',
                        content: '진행사항을 수정하시겠습니까?',
                      });
                    }}
                    name="수정"
                    style={{ width: '80px' }}
                  />
                  <BorderButton
                    addClass="cancelBtn"
                    onHandle={() => { setState({}); props.hide(); }}
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
        execute={() => {}}
      />
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        hide={toggleAlert}
        type={alertModal.type}
        execute={alertModal.useExecute === true ? props.hide : ''}
      />
    </React.Fragment>
  );
};

export default ModalContents;
