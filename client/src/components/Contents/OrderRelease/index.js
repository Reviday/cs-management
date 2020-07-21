import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Modal from 'common/Modal/ModalCover';
import OrderPage from './OrderPage';
import OrderModalContent from './OrderModal';
import ProgressContent from './ProgressModal';
import Config from 'config';
import './index.css';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';
import { ProgressContext } from 'contexts/ProgressContext';

const OrderRelease = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [progress] = useContext(ProgressContext); // 진행상황 리스트
  const [receiptData, setReceiptData] = useState([]); // 입고
  const [releaseData, setReleaseData] = useState([]); // 출고
  const [delayReceiptData, setDelayReceiptData] = useState([]); // 입고 지연
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [releaseTotal, setReleaseTotal] = useState(0);
  const [delayTotal, setDelayTotal] = useState(0);
  const [searchData, setSearchData] = useState({ // 검색 시 사용될 데이터(확정 검색 데이터)
    set: false,
    field: '',
    word: ''
  });

  const [more, setMore] = useState({
    order: false,
    ship: false,
    delay: false
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
  const receiptHeaderSet = [
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

  // Release Table Header Set
  const releaseHeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'product', text: '품명', sort: '' },
    { field: 'price_txt', text: '결제 상태', sort: '' },
    { field: 'manager', text: '매니저', sort: '' },
    { field: 'order_date', text: '출고요청 날짜', sort: '' },
    { field: 'complete_date', text: '출고완료 날짜', sort: '' },
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

  // 주문 리스트 가져오기
  const getOrderList = async (category, start, data) => {
    let options = {};
    let countOption = {
      url: `http://${Config.API_HOST.IP}/api/order/making/count`,
      method: 'post',
      data: {
        site: userInfo.site,
        category: category,
        search_field: data?.field || undefined,
        search_word: data?.word || undefined
      }
    };

    if (category === 'delay') {
      options = {
        url: `http://${Config.API_HOST.IP}/api/order/making/delay`,
        method: 'post',
        data: {
          site: userInfo.site,
          start: start || 1
        }
      };
    } else {
      options = {
        url: `http://${Config.API_HOST.IP}/api/order/making`,
        method: 'post',
        data: {
          site: userInfo.site,
          category: category,
          action: 's',
          start: start || 1,
          search_field: data?.field || undefined,
          search_word: data?.word || undefined
        }
      };
    }

    try {
      // 데이터 reset
      if (category === 'order') {
        setReceiptData([]);
      } else if (category === 'ship') {
        setReleaseData([]);
      } else if (category === 'delay') {
        setDelayReceiptData([]);
      }

      let listSetData = await axios(options);
      let countSetData = await axios(countOption);
      // if (setData.data.status === 400) {
      //   setAlertModal({
      //     show: true,
      //     title: '오류 메시지',
      //     content: setData.data.message
      //   });
      //   return false;
      // }

      let result = listSetData?.data?.data; // list result
      let count = countSetData?.data?.data?.total; // count result
      console.log(category, result, count);
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

      // 데이터 set
      if (category === 'order') {
        setReceiptData(items);
        setReceiptTotal(count);
      } else if (category === 'ship') {
        setReleaseData(items);
        setReleaseTotal(count);
      } else if (category === 'delay') {
        setDelayReceiptData(items);
        setDelayTotal(count);
      }

    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 더보기
  const onMoreBtn = (category) => {
    setMore({
      order: category === 'order' ? !more.order : false,
      ship: category === 'ship' ? !more.ship : false,
      delay: category === 'delay' ? !more.delay : false
    });
  };

  // 주문 리스트를 가져온다.
  useEffect(() => {
    if (progress.length > 0) {
      if (receiptData.length === 0) getOrderList('order'); // 입고 리스트
      if (releaseData.length === 0) getOrderList('ship'); // 출고 리스트
      if (delayReceiptData.length === 0) getOrderList('delay'); // 입고 지연 리스트
    }
  }, [progress]); // [] : Run useEffect only once.

  useEffect(() => {
    if (searchData.set) {
      if (more.order === false) {
        setSearchData({ set: false, field: '', word: '' });
        getOrderList('order');
      } else if (more.ship === false) {
        setSearchData({ set: false, field: '', word: '' });
        getOrderList('ship');
      } else if (more.delay === false) {
        setSearchData({ set: false, field: '', word: '' });
      }
    }
  }, [more]);

  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              입고 일정
            </div>
          </div>

          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="moreBtn"
                onHandle={() => onMoreBtn('order')}
                name="더보기"
              />
            </div>
          </div>
          {
            userInfo?.auth < 2
              && (
                <div className="_rt">
                  <div className="_addOrder">
                    <BorderButton
                      addClass="addOrderBtn"
                      onHandle={() => viewModal('insertOrder')}
                      name="주문 등록"
                    />
                  </div>
                </div>
             )
          }
        </div>
        <div className="ct_box">
          <Table
            headerSet={receiptHeaderSet}
            data={receiptData}
            onClick={data => viewModal('showOrder', data)}
            recordLimit={3}
          />
        </div>

        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              출고 현황
            </div>
          </div>
          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="moreBtn"
                onHandle={() => onMoreBtn('ship')}
                name="더보기"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={releaseHeaderSet}
            data={releaseData}
            onClick={data => viewModal('showOrder', data)}
            recordLimit={3}
          />
        </div>
        {
          delayReceiptData?.length > 0
            && (
              <div className="ct_layout delay_receipt">
                {/* 입고 지연 제품 */}
                <div className="ct_title">
                  <div className="_lt">
                    <div className="_title delay_alert">
                      입고 지연 제품
                      <span>{`: ${delayTotal}개`}</span>
                    </div>
                  </div>
                  <div className="_rt">
                    <div className="_more">
                      <BorderButton
                        addClass="moreBtn"
                        onHandle={() => onMoreBtn('delay')}
                        name="더보기"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </div>

      <OrderPage // 입고 일정
        category="order"
        title="입고 일정"
        headerSet={receiptHeaderSet}
        data={receiptData}
        total={receiptTotal}
        searchData={searchData}
        setSearchData={setSearchData}
        more={more}
        onMoreBtn={onMoreBtn}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <OrderPage // 출고 일정
        category="ship"
        title="출고 일정"
        headerSet={releaseHeaderSet}
        data={releaseData}
        total={releaseTotal}
        searchData={searchData}
        setSearchData={setSearchData}
        more={more}
        onMoreBtn={onMoreBtn}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <OrderPage // 입고 지연 제품
        category="delay"
        title="입고 지연 제품"
        headerSet={receiptHeaderSet}
        data={delayReceiptData}
        total={delayTotal}
        more={more}
        onMoreBtn={onMoreBtn}
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

export default OrderRelease;
