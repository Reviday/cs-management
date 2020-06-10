import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Paging from 'common/Paging';
import Modal from 'common/Modal/ModalCover';
import OrderModalContent from './OrderModal';
import Config from 'config';

import './index.css';

// 진행사항 버튼
const ProgressBtn = (title, id, val) => {

  let name = '';
  let addClass = '';

  if (title === 'order') {
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
  } else if (title === 'out') {
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
    console.log(`onHandle::: ${title} || ${id} || ${val}`);
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
const UpdateBtn = (type, id) => {
  const onHandle = () => {
    console.log(`onHandle::: ${type} || ${id}`);
  };

  return (
    <BorderButton
      addClass="updateBtn"
      onHandle={e => onHandle(e)}
      name="수정"
    />
  );
};

const OrderRelease = (props) => {

  const [receiptData, setReceiptData] = useState([]);
  const [releaseData, setReleaseData] = useState([]);

  const [more, setMore] = useState({
    receipt: false,
    release: false
  });

  // Modal State
  const [isModal, setIsModal] = useState({
    view: false,
    data: {
    }
  });

  // close modal
  const toggleModal = () => {
    setIsModal({ ...isModal,
      view: !isModal.view,
      data: {}
    });
  };

  const viewModal = async () => {
    setIsModal({
      ...isModal,
      view: !isModal.view,
      data: {
      }
    });
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
  
  const getOderList = async (title, start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: {
        mode: 'l',
        size: 10,
        start: start || 1,
        title: title // title : 'order' or 'out'
      }
    };
    try {
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
            progressBtn: ProgressBtn(title, row.id, row.order_status),
            updateBtn: UpdateBtn(title, row.id),
            update_at: moment(new Date(row.update_at)).format('YYYY.MM.DD')
          };

          items.push(convertData);
        }
      }

      // 데이터 set
      if (title === 'order') setReceiptData(items);
      else if (title === 'out') setReleaseData(items);
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const getReceiptList = () => {
    console.log('getReceiptList');
  };

  const getReleaseList = () => {
    console.log('getReleaseList');
  };
  
  // 더보기
  const onMoreBtn = (type) => {
    if (type === 'receipt') {
      setMore({ ...more, receipt: !more.receipt });
    } else if (type === 'release') {
      setMore({ ...more, release: !more.release });
    }
  };

  useEffect(() => {
    if (receiptData.length === 0) getOderList('order');
    if (releaseData.length === 0) getOderList('out');
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
                onHandle={() => onMoreBtn('receipt')}
                name="더보기"
              />
            </div>
          </div>
          <div className="_rt">
            <div className="_addOrder">
              <BorderButton
                addClass="addOrderBtn"
                onHandle={e => viewModal(e)}
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
                onHandle={() => onMoreBtn('release')}
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
      <div className={`ct_layout abs ${more.receipt ? 'on' : ''}`}>
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
                onHandle={() => onMoreBtn('receipt')}
                name="접기"
              />
            </div>
          </div>
          <div className="_rt">
            <div className="_addOrder">
              <BorderButton
                addClass="addOrderBtn"
                onHandle={e => viewModal(e)}
                name="주문 등록"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={receiptHeaderSet}
            data={receiptData}
            recordLimit="none"
          />
          <div className="ct_box_footer">
            <Paging
              onClick={getReceiptList}
              totalCount={100} // total 가져오는 로직 필요.
              listCount={10}
              displayCount={10}
              current={1}
            />
          </div>
        </div>
      </div>
      <div className={`ct_layout abs ${more.release ? 'on' : ''}`}>
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
                onHandle={() => onMoreBtn('release')}
                name="접기"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={releaseHeaderSet}
            data={releaseData}
            recordLimit="none"
          />
          <div className="ct_box_footer">
            <Paging
              onClick={getReleaseList}
              totalCount={100} // total 가져오는 로직 필요.
              listCount={10}
              displayCount={10}
              current={1}
            />
          </div>
        </div>
      </div>
      <Modal
        set={isModal}
        hide={toggleModal}
        title=""
        style={{ width: '500px', height: '550px' }}
        contents={OrderModalContent}
      />
    </React.Fragment>
  );
};

export default OrderRelease;
