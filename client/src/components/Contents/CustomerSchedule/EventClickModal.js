import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import moment from 'moment';
import 'moment/locale/ko';

import Select from 'common/Select/Select';
import Input from 'common/Input/Input';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import BorderButton from 'common/Button/BorderButton';
import RangeDatePicker from 'common/DatePicker/RangeDatepicker';
import DatePicker from 'common/DatePicker/Datepicker';
import 'common/Modal/Modal.scss';
import Config from 'config';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';

const ModalContents = (props) => {
  
  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  
  const items = props.items;
  const [state, setState] = useState(
    items.type === 'showEvent'
      ? props.data
      : {
        id: '',
        site: siteList[0].site,
        name: '',
        telpno: '',
        customer_memo: '',
        meeting_category: 1,
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        date: null
      }
  );
  /*
    end_date: "2020-07-23 06:00"
    end_time: "06:00"
    meeting_category: "0"
    memo: "상담전화"
    name: "유진호"
    site: "본점"
    start_date: "2020-07-23 04:00"
    start_time: "04:00"
    telpno: "010-3625-7342"
  */
  const [startTime, setStartTime] = useState(
    items.type === 'showEvent'
      ? props.data.start
      : null
  );
  const [endTime, setEndTime] = useState(
    items.type === 'showEvent'
      ? props.data.end
      : null
  );
  const [view, setView] = useState(false); // categoryList view를 보일지 여부
  const calendarApi = items.calendarApi;

  // meeting_category list
  // 나중에 리스트 불러오는 형식으로 변경할 필요가 있음.
  const categoryList = [
    { meeting_category: 1, status_name: '신규' },
    { meeting_category: 2, status_name: '가봉' },
    { meeting_category: 3, status_name: '완성' },
    { meeting_category: 4, status_name: '수선피팅' },
    { meeting_category: 5, status_name: '대여복 셀렉' },
    { meeting_category: 6, status_name: '기타' },
  ];

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
    type: '',
    id: ''
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

      let checkList = [
        { key: 'site', name: '지점' }, // select
        { key: 'name', name: '고객명' }, // input
        { key: 'telpno', name: '연락처' }, // input
        { ket: 'customer_memo', name: '메모' } // input
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

      // 날짜/시간 체크
      if (!state.date || !startTime || !endTime) {
        validation = false;
        message = '상담일정(시간)을 선택해주시기 바랍니다.';
      }

    }

    // 2. 각 data 별로 적절한 형식인지 체크
    if (validation) {
      // 이름 정규식 체크
      let reg = /^[가-힣]{2,5}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
      if (!reg.test(state.name)) {
        validation = false;
        message = '고객명이 올바르지 않습니다.';
      }

      // 전화번호 정규식 체크
      reg = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
      if (!reg.test(state.telpno)) {
        validation = false;
        message = '전화번호 형식이 올바르지 않습니다.';
      }

      // 존재하는 고객정보인지 확인
      // 필요 여부를 확인하지 못했기 때문에 비활성
      // if (duplCheck()) {
      //   validation = false;
      //   message = '등록되지 않은 고객정보 입니다.';
      // }
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

  const executeEvent = async (type, id) => {
    if (type === 'cancel') { // cancel이 안들어오긴 하지만, 추후 사용 여지를 위해.
      // state값 초기화 후, modal 닫기
      setState({});
      props.hide();
      return false;
    }

    // 권한 부족 시, 수행 안 함
    if (userInfo.auth > 1) return false;
    
    // set options
    let options = {
      url: '',
      method: 'post',
      data: {}
    };

    switch (type) {

      case 'insert':
        options.url = `http://${Config.API_HOST.IP}/api/promise/insert`;
        // data.action = 'i';
        break;
      case 'update':
        options.url = `http://${Config.API_HOST.IP}/api/promise/update`;
        options.data.id = id;
        break;
      case 'delete':
        options.url = `http://${Config.API_HOST.IP}/api/promise/delete`;
        options.data.id = id;
        break;
      default: return false;

    }

    // set options
    options = {
      ...options,
      data: {
        ...options.data,
        site: state.site,
        name: state.name,
        telpno: state.telpno,
        start_date: moment(state.date).format('YYYY-MM-DD')
          + moment(startTime).format(' HH:mm'),
        end_date: moment(state.date).format('YYYY-MM-DD')
        + moment(endTime).format(' HH:mm'),
        customer_memo: sanitizeHtml(state.customer_memo),
        meeting_category: state.meeting_category
      },
    };

    try {
      console.log(options);
      let setData = await axios(options);

      console.log(setData);
      let result = setData.data.data; // true

      // 정상적으로 처리되었을 때,
      // 리스트를 다시 호출하나.. 기존 state에서 update를 할까..
      if (result === true) {
        // 리스트를 다시 불러온다.
        // 아무리 문서를 찾아봐도 calendarApi.addEvent를 사용할 방법이 없음.
        items.getList();
        // items.calendarApi.addEvent({
        //   id: Math.random() * 1000,
        //   title: options.data.name,
        //   start: options.data.start_date,
        //   end: options.data.end_date,
        //   allDay: false
        // });
      }

      // 정상적으로 처리되었고, type이 insert일 때
      if (result === true && type === 'insert') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '일정 등록이 완료되었습니다.',
          type: 'common',
          useExecute: true
        });

      // 정상적으로 처리되었고, type이 update일 때
      } else if (result === true && type === 'update') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '일정 수정이 완료되었습니다.',
          type: 'common',
          useExecute: true
        });

      // 정상적으로 처리되었고, type이 delete일 때
      } else if (result === true && type === 'delete') {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '일정 삭제가 완료되었습니다.',
          type: 'common',
          useExecute: true
        });
        
      // 그 외, result가 true가 아닐 경우.
      // type이 세 가지 안에 포함되지 않으면 상단에서 return 되므로.
      } else {
        setAlertModal({
          show: true,
          title: '오류 메시지',
          content: '문제가 발생하였습니다. 잠시 후 다시 시도해주시기 바랍니다.'
        });
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  return (
    <React.Fragment>
      {console.log(props.set)}
      <div className="modal_content" style={{ height: 'fit-content', overflow: 'hidden', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div" style={{ minHeight: '515px', height: 'fit-content' }}>
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20">
                  {
                  // siteList가 존재하지 않거나, 개수가 0개이면
                  // input 스타일로 처리. 있으면 select 스타일로 처리.
                  userInfo.auth < 2
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
                    disabled={userInfo.auth > 1}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="연락처"
                    value={state.telpno}
                    setValue={e => setState({ ...state, telpno: e })}
                    style={{ width: '300px' }}
                    setReg={/[^0-9]/gi}
                    disabled={userInfo.auth > 1}
                  />
                </div>
                <div className="rows-mb-20">
                  <div className="row_title">
                    상담일정
                  </div>
                  <DatePicker
                    title="상담일정"
                    state={[state.date, date => setState({ ...state, date })]}
                    isClearable={userInfo.auth < 2}
                    disabled={userInfo.auth > 1}
                  />
                </div>
                <div className="rows-mb-20">
                  <div className="row_title">
                    상담시간
                  </div>
                  <RangeDatePicker
                    startTitle="시작시간"
                    endTitle="종료시간"
                    startState={[startTime, setStartTime]}
                    endState={[endTime, setEndTime]}
                    onlyTime
                    isClearable={userInfo.auth < 2}
                    disabled={userInfo.auth > 1}
                  />
                </div>
                <div className="rows-mb-20" style={{ height: '180px' }}>
                  <div className="row_title">
                    메모
                  </div>
                  <div className="needs_area">
                    <textarea
                      value={state.customer_memo}
                      onChange={e => setState({
                        ...state,
                        customer_memo: e.target.value
                      })}
                      disabled={userInfo.auth > 1}
                    />
                  </div>
                </div>
                <div className="rows-mb-20" style={{ height: '40px' }}>
                  <div className="row_title">
                    상담종류
                  </div>
                  {
                    categoryList.map((item) => {
                      if (String(item.meeting_category) === String(state.meeting_category)) {
                        let name = item.status_name;
                        let addClass = `type${item.meeting_category}`;
  
                        return (
                          <div style={{ marginLeft: '100px', padding: '8px' }} key={`${item.meeting_category}-${item.status_name}`}>
                            <BorderButton
                              addClass={`categoryBtn ${addClass}`}
                              onHandle={() => setView(userInfo.auth < 2)}
                              name={name}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                </div>
                <div className="category_list" style={view ? { display: 'block' } : {}}>
                  {
                    categoryList.map((item) => {
                      let name = item.status_name;
                      let addClass = `type${item.meeting_category}${String(item.meeting_category) === String(state.meeting_category) ? ' on' : ''}`;

                      const onHandle = () => {
                        // view를 닫는다.
                        setView(false);
                        // state 설정 후
                        setState({
                          ...state,
                          meeting_category: item.meeting_category,
                          status_name: name
                        });

                      };

                      return (
                        <div className="rows-mb-20" key={`${item.meeting_category}-${item.status_name}`}>
                          <BorderButton
                            addClass={`categoryBtn ${addClass}`}
                            onHandle={e => onHandle(e)}
                            name={name}
                          />
                        </div>
                      );
                    })
                  }
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'addEvent' && userInfo.auth < 2
                      && (
                        <BorderButton
                          addClass="updateBtn"
                          onHandle={() => {
                            // check validate
                            if (!checkValidate()) return false;
                            setConfirmModal({
                              show: true,
                              title: '확인 메시지',
                              content: '상담 일정을 등록하시겠습니까?',
                              type: 'insert'
                            });
                          }}
                          name="등록"
                          style={{ width: '80px' }}
                        />
                      )
                  }
                  {
                    items.type === 'showEvent' && userInfo.auth < 2
                      && (
                        <BorderButton
                          addClass="updateBtn"
                          onHandle={() => {
                            // check validate
                            if (!checkValidate()) return false;
                            setConfirmModal({
                              show: true,
                              title: '확인 메시지',
                              content: '상담 일정을 수정하시겠습니까?',
                              type: 'update',
                              id: state.id
                            });
                          }}
                          name="수정"
                          style={{ width: '80px' }}
                        />
                      )
                  }
                  {
                    items.type === 'showEvent' && userInfo.auth < 2
                      && (
                        <BorderButton
                          addClass="updateBtn"
                          onHandle={() => {
                            // check validate
                            if (!checkValidate()) return false;
                            setConfirmModal({
                              show: true,
                              title: '확인 메시지',
                              content: '상담 일정을 삭제하시겠습니까?',
                              type: 'delete',
                              id: state.id
                            });
                          }}
                          name="삭제"
                          style={{ width: '80px' }}
                        />
                      )
                  }
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
        execute={() => executeEvent(confirmModal.type, confirmModal.id)}
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
