import React, { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import Select from 'common/Select/Select';
import Input from 'common/Input/Input';
import InputCustom from 'common/Input/InputCustom';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import Postcode from 'common/Modal/ModalPostcode';
import BorderButton from 'common/Button/BorderButton';
import 'common/Modal/Modal.scss';
import Config from 'config';

const ModalContents = (props) => {
  const items = props.items;
  const selectDate = items?.selectDate || moment(new Date()).format('MM월 DD일 dd요일');
  const [state, setState] = useState({});

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
      <div className="modal_content" style={{ height: 'fit-content', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div" style={{ minHeight: '515px', height: 'fit-content' }}>
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20" />
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
