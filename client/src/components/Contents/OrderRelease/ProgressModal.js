import React, { useState, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';

import DatePicker from 'common/DatePicker/RangeDatepicker';
import BorderButton from 'common/Button/BorderButton';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import Config from 'config';

const ModalContents = (props) => {
  const progress = props.items.progress || [];
  const items = props.items;
  const [state, setState] = useState(props.data);
  const [view, setView] = useState(false); // progress list를 보여줄지 여부
  const [startDate, setStartDate] = useState(
    props.data.order_date
      ? new Date(props.data.order_date) : null
  );
  const [endDate, setEndDate] = useState(
    props.data.complete_date
      ? new Date(props.data.complete_date) : null
  );

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
    // startDate는 필수 요소로 체크
    if (validation && (!startDate || startDate === '')) {
      validation = false;
      message = '주문 날짜를 선택해주시기 바랍니다.';
    }


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

  const updateProgress = async () => {
    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}/api/order/making`,
      method: 'post',
      data: qs.stringify({
        ...state,
        order_date: startDate,
        complete_date: endDate,
        category: items.type,
        action: 'status_u'
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      console.log('options:::', options);
      let setData = await axios(options);
      console.log('setData:::', setData);

      let result = setData.data.data;
      console.log('result:::', result);
      if (result) {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '주문 수정이 완료되었습니다.'
        });
        // 모달창 종료 및 데이터 다시 가져오기.
        props.hide();
        items.getOrderList('order');
        items.getOrderList('ship');
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const viewProgressList = () => {

  };

  return (
    <React.Fragment>
      {console.log('check:::', state)}
      <div className="modal_content" style={{}}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20 pro_title">
                  진행 절차 업데이트
                </div>
                {/* <div className="rows-mb-20" style={{ height: '60px' }}>
                  <div className="row_title">
                    진행 절차 업데이트
                  </div>
                </div> */}
                <div className="_progress">
                  <div className="rows-mb-20">
                    {
                      progress.map((item) => {
                        if (String(item.order_status) === String(state.order_status)) {
                          let name = item.status_name;
                          let addClass = `type${item.order_status} on`;
    
                          return (
                            <div className="rows-mb-20" key={`${item.order_status}-${item.status_name}`}>
                              <BorderButton
                                addClass={`progressBtn ${addClass}`}
                                onHandle={() => setView(true)}
                                name={name}
                              />
                            </div>
                          );
                        }
                        return null;
                      })
                    }
                  </div>
                </div>
                <div className="pro_list" style={view ? { display: 'block' } : {}}>
                  {
                    progress.map((item) => {
                      let name = item.status_name;
                      let addClass = `type${item.order_status}${String(item.order_status) === String(state.order_status) ? ' on' : ''}`;

                      const onHandle = () => {
                        // view를 닫는다.
                        setView(false);
                        // state 설정 후
                        setState({
                          ...state,
                          order_status: item.order_status,
                          status_name: name
                        });

                      };

                      return (
                        <div className="rows-mb-20" key={`${item.order_status}-${item.status_name}`}>
                          <BorderButton
                            addClass={`progressBtn ${addClass}`}
                            onHandle={e => onHandle(e)}
                            name={name}
                          />
                        </div>
                      );
                    })
                  }
                </div>
                <div className="rows-mb-20" style={{ height: '60px', marginTop: '30px' }}>
                  <div className="row_title">
                    주문날짜
                  </div>
                  <DatePicker
                    startTitle="주문날짜"
                    endTitle="완료날짜"
                    startState={[startDate, setStartDate]}
                    endState={[endDate, setEndDate]}
                  />
                </div>
                <div className="rows-mb-20" style={{ height: '170px' }}>
                  <div className="row_title">
                    특이사항
                  </div>
                  <div className="needs_area">
                    <textarea
                      value={state.needs}
                      onChange={e => setState({
                        ...state,
                        needs: e.target.value
                      })}
                    />
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
        execute={() => updateProgress(state)}
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
