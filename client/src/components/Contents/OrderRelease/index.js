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

  const [receiptData, setReceiptData] = useState([]);
  const [releaseData, setReleaseData] = useState([]);

  const [more, setMore] = useState({
    order: false,
    ship: false
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

  const showOrder = (category, id) => {
    console.log(`onHandle::: ${category} || ${id}`);
    console.log(receiptData);

    if (category === 'order') {
      receiptData.filter((order) => {
        console.log(order);
        if (order.id === id) return order;
        return order;
      });
      viewModal('showOrder', receiptData.filter(order => order.id === id));
    } else if (category === 'ship') {
      viewModal('showOrder', releaseData.filter(order => order.id === id));
    }
    
  };

  // 수정 버튼
  const UpdateBtn = (category, id) => {
    const onHandle = () => {
      
      showOrder(category, id);
    };

    return (
      <BorderButton
        addClass="_tbBtn updateBtn"
        onHandle={e => onHandle(e)}
        name="수정"
      />
    );
  };

  // Receipt Table Header Set
  const receiptHeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'product', text: '품명', sort: '' },
    { field: 'order_date', text: '주문 날짜', sort: '' },
    { field: 'complete_date', text: '입고완료 날짜', sort: '' },
    { field: 'progressBtn', text: '진행사항' },
    { field: 'updateBtn', text: '업데이트' },
    { field: 'update_at', text: '업데이트 날짜', sort: '' }
  ];

  // Receipt Temp Data
  const receiptTempItem = [
    {
      id: 1,
      site: '본점',
      name: '유진호',
      product: '정장 1EA, 셔츠 2EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('order', 1, 1),
      updateBtn: UpdateBtn('order', 1),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 2,
      site: '청담',
      name: '최용국',
      product: '캐시미어 코드 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('order', 2, 2),
      updateBtn: UpdateBtn('order', 2),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 3,
      site: '대구',
      name: '이병호',
      product: '헤링본 스포츠 자켓 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('order', 3, 3),
      updateBtn: UpdateBtn('order', 3),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 4,
      site: '청담',
      name: '최용국',
      product: '캐시미어 코드 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('order', 4, 0),
      updateBtn: UpdateBtn('order', 4),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 5,
      site: '대구',
      name: '이병호',
      product: '헤링본 스포츠 자켓 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('order', 5, 1),
      updateBtn: UpdateBtn('order', 5),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    }
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

  // Release Temp Data
  const releaseTempItem = [
    {
      id: 1,
      name: '유진호',
      product: '정장 1EA, 셔츠 2EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('ship', 1, 4),
      updateBtn: UpdateBtn('ship', 1),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 2,
      name: '최용국',
      product: '캐시미어 코드 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('ship', 2, 5),
      updateBtn: UpdateBtn('ship', 2),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 3,
      name: '이병호',
      product: '헤링본 스포츠 자켓 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('ship', 1, 4),
      updateBtn: UpdateBtn('ship', 3),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 4,
      name: '최용국',
      product: '캐시미어 코드 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('ship', 2, 5),
      updateBtn: UpdateBtn('ship', 4),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: 5,
      name: '이병호',
      product: '헤링본 스포츠 자켓 1EA',
      order_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      complete_date: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('ship', 1, 4),
      updateBtn: UpdateBtn('ship', 5),
      update_at: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    }
  ];
  
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

      console.log(setData);
      let result = setData.data.data;
      let items = [];
      for (let i in result) {
        if (Object.prototype.hasOwnProperty.call(result, i)) {
          let row = result[i];

          let convertData = {
            ...row,
            order_date: moment(new Date(row.order_date)).format('YYYY.MM.DD'),
            complete_date: moment(new Date(row.complete_date)).format('YYYY.MM.DD'),
            progressBtn: ProgressBtn(category, row.id, row.order_status),
            updateBtn: UpdateBtn(category, row.id),
            update_at: moment(new Date(row.update_at)).format('YYYY.MM.DD')
          };

          items.push(convertData);
        }
      }

      // 데이터 set
      if (category === 'order') setReceiptData(items);
      else if (category === 'ship') setReleaseData(items);
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 더보기
  const onMoreBtn = (category) => {
    if (category === 'order') {
      setMore({ ...more, order: !more.order });
    } else if (category === 'ship') {
      setMore({ ...more, ship: !more.ship });
    }
  };

  useEffect(() => {
    if (receiptData.length === 0) setReceiptData(receiptTempItem); // getOrderList('order');
    if (releaseData.length === 0) setReleaseData(releaseTempItem); // getOrderList('ship');
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
            recordLimit={3}
          />
        </div>
      </div>
      <OrderPage // 입고 일정
        category="order"
        headerSet={receiptHeaderSet}
        data={receiptData}
        more={more}
        onMoreBtn={onMoreBtn}
        viewModal={viewModal}
        getOrderList={getOrderList}
      />
      <OrderPage // 출고 일정
        category="ship"
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
        style={{ width: '500px', height: '565px' }}
        contents={OrderModalContent}
        items={{ type: isModal.type }}
      />
    </React.Fragment>
  );
};

export default OrderRelease;
