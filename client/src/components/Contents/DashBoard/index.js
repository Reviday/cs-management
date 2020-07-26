import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

/*  User Import  */
import BorderButton from 'common/Button/BorderButton';
import Calendar from 'common/Calendar';
import Select from 'common/Select/Select';
import Table from 'common/Table';
import Modal from 'common/Modal/ModalCover';
import OrderModalContent from 'components/Contents/OrderRelease/OrderModal';
import ProgressContent from 'components/Contents/OrderRelease/ProgressModal';
import OrderPage from 'components/Contents/OrderRelease/OrderPage';
import DayClickModal from './DayClickModal';
import EventClickModal from './EventClickModal';
import Config from 'config';

/*  CSS  */
import './index.css';

/* Context */
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';
import { ProgressContext } from 'contexts/ProgressContext';

const DashBoard = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [progress] = useContext(ProgressContext); // 진행상황 리스트
  
  const [scheduleList, setScheduleList] = useState([]); // 상담일정 리스트
  const [calState, setCalState] = useState({
    site: '전체',
    s_code: 'all'
  }); // calendar용 state
  const [orderState, setOrderState] = useState({}); // order용 state
  const [orderList, setOrderList] = useState([]); // 금일 입고 예정
  const [orderTotal, setOrderTotal] = useState(0); // 금일 입고 예정 총 개수
  const [more, setMore] = useState({
    order: false
  });
  const [searchData, setSearchData] = useState({ // 검색 시 사용될 데이터(확정 검색 데이터)
    set: false,
    field: '',
    word: ''
  });

  // Modal State
  const [isModal, setIsModal] = useState({
    view: false,
    type: '',
    data: {}
  });

  // close modal
  const toggleModal = () => {
    setIsModal({ ...isModal,
      view: !isModal.view,
      type: '',
      data: {}
    });
  };

  const viewModal = async (type, data) => {
    setIsModal({
      view: true,
      type: type,
      data: data
    });
  };

  const priceType = [
    { code: 0, text: '미결제' },
    { code: 1, text: '현금 결제' },
    { code: 2, text: '카드 결제' }
  ];

  // Receipt Table Header Set
  const HeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'product', text: '품명', sort: '' },
    { field: 'price_txt', text: '결제 상태', sort: '' },
    { field: 'manager', text: '매니저', sort: '' },
    { field: 'order_date', text: '주문 날짜', sort: '' },
    { field: 'complete_date', text: '입고완료 날짜', sort: '' },
    { field: 'progressBtn', text: '진행사항' },
    { field: 'updateBtn', text: '업데이트' },
    { field: 'update_at', text: '업데이트 날짜', sort: '' }
  ];

  // 진행 상황 버튼
  const ProgressBtn = (data) => {
    let name = '';
    let addClass = '';

    for (let i in progress) {
      if (progress[i].order_status === data.order_status) {
        name = progress[i].status_name;
        addClass = `type${progress[i].order_status}`;
        break;
      }
    }

    const onHandle = () => {
      viewModal('progress', data);
    };

    return (
      <BorderButton
        addClass={`progressBtn ${addClass}`}
        onHandle={e => onHandle(e)}
        name={name}
      />
    );
  };

  // 수정 버튼
  const UpdateBtn = (data) => {
    const onHandle = () => {
      viewModal('update', data);
    };

    return (
      <BorderButton
        addClass="_tbBtn updateBtn"
        onHandle={e => onHandle(e)}
        name="수정"
      />
    );
  };

  // 상담 일정 리스트 가져오기
  const getScheduleList = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/promise/selectByAll`,
      method: 'post',
      data: {
        site: calState.s_code === 'all' ? undefined : calState.site,
        now_month: '07'
      }
    };
    try {
      // 데이터 reset
      setScheduleList([]);

      console.log('options:::', options);
      let setData = await axios(options);

      let result = setData?.data?.data; // list result
      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];

            let convertData = {
              ...row,
              // calendar 필수 데이터는 명시
              id: row.id,
              title: row.name,
              start: moment(row.start_date).format('YYYY-MM-DD')
              + (row.start_time ? 'T' + row.start_time : null),
              end: moment(row.end_date).format('YYYY-MM-DD')
              + (row.end_time ? 'T' + row.end_time : null),
            };

            items.push(convertData);
          }
        }
      }

      console.log(items);
      setScheduleList(items);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 주문 리스트 가져오기
  const getOrderList = async (start, data) => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/order/making`,
      method: 'post',
      data: {
        site: userInfo.site,
        category: 'checklist',
        action: 's',
        start: start || 1,
        search_field: data?.field || undefined,
        search_word: data?.word || undefined
      }
    };

    let countOption = {
      url: `http://${Config.API_HOST.IP}/api/order/making/count`,
      method: 'post',
      data: {
        site: userInfo.site,
        category: 'checklist',
        search_field: data?.field || undefined,
        search_word: data?.word || undefined
      }
    };

    try {
      // 데이터 reset
      setOrderList([]);

      let listSetData = await axios(options);
      let countSetData = await axios(countOption);

      let result = listSetData?.data?.data; // list result
      let count = countSetData?.data?.data?.total; // count result
      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];

            let convertData = {
              ...row,
              price_txt: priceType.filter(type => type.code === row.price_type)[0]?.text,
              order_date: moment(new Date(row.order_date)).format('YYYY.MM.DD'),
              complete_date: moment(new Date(row.complete_date)).format('YYYY.MM.DD'),
              progressBtn: ProgressBtn(row),
              updateBtn: UpdateBtn(row),
              update_at: moment(new Date(row.update_at)).format('YYYY.MM.DD')
            };

            items.push(convertData);
          }
        }
      }

      setOrderList(items);
      setOrderTotal(count);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 주문, 상담일정 리스트를 가져온다.
  useEffect(() => {
    if (progress.length > 0 && orderList.length === 0) getOrderList();
    if (scheduleList.length === 0) getScheduleList();
  }, [progress]);

  //  리스트를 가져온다.
  useEffect(() => {
    
  }, []);

  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              {moment(new Date()).format('YYYY년 MM월')}
              <div className="row_input">
                <Select
                  setKey="s_code"
                  setVal="site"
                  useAll
                  list={siteList}
                  value={calState.s_code || 'all'}
                  setValue={(e) => {
                    let selectSite = siteList.filter(item => item.s_code === e);

                    if (selectSite.length === 0) {
                      selectSite = [{ site: '전체', s_code: 'all' }];
                    }

                    setCalState({
                      ...calState,
                      site: selectSite[0].site,
                      s_code: e
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Calendar
            events={scheduleList}
            dayClick={DayClickModal}
            eventClick={EventClickModal}
          />
        </div>

        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              금일 입고 예정
              <div className="row_input">
                <Select
                  setKey="s_code"
                  setVal="site"
                  useAll
                  list={siteList}
                  value={orderState.s_code || 'all'}
                  setValue={(e) => {
                    let selectSite = siteList.filter(item => item.s_code === e);

                    if (selectSite.length === 0) {
                      selectSite = [{ site: '전체', s_code: 'all' }];
                    }

                    setOrderState({
                      ...orderState,
                      site: selectSite[0].site,
                      s_code: e
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="moreBtn"
                onHandle={() => setMore({ order: true })}
                name="더보기"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={HeaderSet}
            data={orderList}
            onClick={data => viewModal('showOrder', data)}
            recordLimit={3}
          />
        </div>
      </div>
      <OrderPage // 금일 입고 예정
        category="order"
        title="금일 입고 예정"
        headerSet={HeaderSet}
        data={orderList}
        total={orderTotal}
        searchData={searchData}
        setSearchData={setSearchData}
        more={more}
        onMoreBtn={() => setMore({ order: false })}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <Modal
        set={isModal}
        hide={toggleModal}
        title={isModal.type === 'progress' ? '진행 절차 업데이트' : isModal.type === 'insertOrder' ? '주문 등록' : '주문 정보'}
        style={{ width: '500px', height: 'fit-content' }}
        contents={isModal.type === 'progress' ? ProgressContent : OrderModalContent}
        items={isModal.type === 'progress' ? { type: isModal.type, progress: progress, getOrderList: getOrderList } : { type: isModal.type, siteList: siteList, getOrderList: getOrderList }}
      />
    </React.Fragment>
  );
};

export default DashBoard;
