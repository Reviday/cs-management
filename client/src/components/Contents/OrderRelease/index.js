import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import OrderPage from './OrderPage';
import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Modal from 'common/Modal/ModalCover';
import OrderModalContent from './OrderModal';
import Config from 'config';

import './index.css';

// 진행사항 버튼
const ProgressBtn = (category, id, val) => {

  let name = '';
  let addClass = '';

  if (category === 'order') {
    switch (val) {

      case 0:
        name = '제작';
        addClass = 'order';
        break;
      case 1:
        name = '가봉완료';
        addClass = 'basting';
        break;
      case 2:
        name = '제작완료';
        addClass = 'making';
        break;
      case 3:
        name = '2차 수선';
        addClass = 'repair';
        break;
      default: break;
    
    }
  } else if (category === 'ship') {
    switch (val) {

      case 4:
        name = '출고준비';
        addClass = 'ready';
        break;
      case 5:
        name = '출고완료';
        addClass = 'complete';
        break;
      default: break;
    
    }
  }

  const onHandle = () => {
    console.log(`onHandle::: ${category} || ${id} || ${val}`);
  };

  return (
    <BorderButton
      addClass={`progressBtn ${addClass}`}
      onHandle={e => onHandle(e)}
      name={name}
    />
  );
};

const OrderRelease = (props) => {

  const [receiptData, setReceiptData] = useState([]); // 입고
  const [releaseData, setReleaseData] = useState([]); // 출고
  const [delayReceiptData, setDelayReceiptData] = useState([]); // 입고 지연

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
      ...isModal,
      view: !isModal.view,
      type: type,
      data: data
    });
  };

  // Receipt Table Header Set
  const receiptHeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'product', text: '품명', sort: '' },
    { field: 'order_date', text: '주문 날짜', sort: '' },
    { field: 'price_type', text: '결제 상태', sort: '' }, // 추후 price_chk로 변경해야 함.
    { field: 'manager', text: '매니저', sort: '' },
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
    { field: 'order_date', text: '출고요청 날짜', sort: '' },
    { field: 'complete_date', text: '출고완료 날짜', sort: '' },
    { field: 'progressBtn', text: '진행사항' },
    { field: 'updateBtn', text: '업데이트' },
    { field: 'update_at', text: '업데이트 날짜', sort: '' }
  ];

  // 수정 버튼
  const UpdateBtn = (category, id, data) => {
    const onHandle = () => {
      console.log(`onHandle::: ${category} || ${id}`);
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

  const getOrderList = async (category, start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: {
        category: category,
        action: 's',
        start: start || 1
      }
    };
    try {
      console.log('options:::', options);
      let setData = await axios(options);
      // if (setData.data.status === 400) {
      //   setAlertModal({
      //     show: true,
      //     title: '오류 메시지',
      //     content: setData.data.message
      //   });
      //   return false;
      // }

      let result = setData.data.data;
      console.log(result);
      let items = [];
      for (let i in result) {
        if (Object.prototype.hasOwnProperty.call(result, i)) {
          let row = result[i];

          let convertData = {
            ...row,
            order_date: moment(new Date(row.order_date)).format('YYYY.MM.DD'),
            complete_date: moment(new Date(row.complete_date)).format('YYYY.MM.DD'),
            progressBtn: ProgressBtn(category, row.id, row.order_status),
            updateBtn: UpdateBtn(category, row.id, row),
            update_at: moment(new Date(row.update_at)).format('YYYY.MM.DD')
          };

          items.push(convertData);
        }
      }

      // 데이터 set
      if (category === 'order') setReceiptData(items);
      else if (category === 'ship') setReleaseData(items);
      
      // test setting
      setDelayReceiptData(items);
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

  useEffect(() => {
    if (receiptData.length === 0) getOrderList('order');
    if (releaseData.length === 0) getOrderList('ship');
  }, []); // [] : Run useEffect only once.
 
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
          <div className="_rt">
            <div className="_addOrder">
              <BorderButton
                addClass="addOrderBtn"
                onHandle={() => viewModal('insertOrder')}
                name="주문 등록"
              />
            </div>
          </div>
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
                      <span>: 3개</span>
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
                {
                  more.delay
                    && (
                      <div className="ct_box">
                        <Table
                          headerSet={releaseHeaderSet}
                          data={releaseData}
                          onClick={data => viewModal('showOrder', data)}
                          recordLimit={3}
                        />
                      </div>
                    )
                }
              </div>
            )
        }
      </div>

      <OrderPage // 입고 일정
        category="order"
        title="입고 일정"
        headerSet={receiptHeaderSet}
        data={receiptData}
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
        more={more}
        onMoreBtn={onMoreBtn}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <OrderPage // 입고 지연 제품
        category="delay"
        title="입고 지연 제품"
        headerSet={releaseHeaderSet}
        data={releaseData}
        more={more}
        onMoreBtn={onMoreBtn}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <Modal
        set={isModal}
        hide={toggleModal}
        title={isModal.type === 'insertOrder' ? '주문 등록' : '주문 정보'}
        style={{ width: '500px', height: '685px' }}
        contents={OrderModalContent}
        items={{ type: isModal.type }}
      />
    </React.Fragment>
  );
};

export default OrderRelease;
