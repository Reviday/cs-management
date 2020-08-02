import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
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
        site: siteList[0].site,
        name: '',
        telpno: '',
        memo: '',
        meeting_category: 1,
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        date: null
      }
  );
  console.log('event data:::', props.data);
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

  const executeEvent = async (type) => {
    if (type === 'cancel') { // cancel이 안들어오긴 하지만, 추후 사용 여지를 위해.
      // state값 초기화 후, modal 닫기
      setState({});
      props.hide();
      return false;
    }

    // 권한 부족 시, 수행 안 함
    if (userInfo.auth > 1) return false;
    
    let data = {};
    // 일단은 insert밖에 없긴한데..
    switch (type) {

      case 'insert':
        // data.action = 'i';
        break;
      case 'update':
        data.id = id;
        data.action = 'u';
        break;
      case 'delete':
        data = {
          id: id,
          action: 'd',
        };
        break;
      default: return false;

    }

    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}/api/promise/insert`,
      method: 'post',
      data: {
        ...data,
        site: state.site,
        name: state.name,
        telpno: state.telpno,
        start_date: moment(state.date).format('YYYY-MM-DD')
          + moment(startTime).format(' HH:mm'),
        end_date: moment(state.date).format('YYYY-MM-DD')
        + moment(endTime).format(' HH:mm'),
        memo: state.memo,
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
        //
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
                    isClearable={userInfo.auth > 1}
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
                    isClearable={userInfo.auth > 1}
                    disabled={userInfo.auth > 1}
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
                  {
                    categoryList.map((item) => {
                      if (String(item.meeting_category) === String(state.meeting_category)) {
                        let name = item.status_name;
                        let addClass = `type${item.meeting_category}`;
  
                        return (
                          <div style={{ marginLeft: '100px', padding: '8px' }} key={`${item.meeting_category}-${item.status_name}`}>
                            <BorderButton
                              addClass={`categoryBtn ${addClass}`}
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
                              type: 'update'
                            });
                          }}
                          name="수정"
                          style={{ width: '80px' }}
                        />
                      )
                  }
                  {
                    items.type === 'showEvent'
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
                              type: 'delete'
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
        execute={() => executeEvent(confirmModal.type)}
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
