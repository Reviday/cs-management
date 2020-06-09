import React, { useState } from 'react';
import moment from 'moment';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';

import './index.css';

// 진행사항 버튼
const ProgressBtn = (type, id, val) => {

  let name = '';
  let addClass = '';

  if (type === 'receipt') {
    switch (val) {

      case '입고완료':
        name = '입고완료';
        addClass = 'complete';
        break;
      case '원단입고':
        name = '원단입고';
        addClass = 'receipt';
        break;
      case '제작':
        name = '제작';
        addClass = 'making';
        break;
      default: break;
    
    }
  } else if (type === 'release') {
    switch (val) {

      case '출고완료':
        name = '출고완료';
        addClass = 'complete';
        break;
      case '출고준비':
        name = '출고준비';
        addClass = 'ready';
        break;
      case '제작':
        name = '제작';
        addClass = 'making';
        break;
      default: break;
    
    }
  }

  const onHandle = () => {
    console.log(`onHandle::: ${type} || ${id} || ${val}`);
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

  // Receipt Table Header Set
  const receiptHeaderSet = [
    { field: 'locate', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'items', text: '품명', sort: '' },
    { field: 'orderDate', text: '주문 날짜', sort: '' },
    { field: 'completeDate', text: '입고완료 날짜', sort: '' },
    { field: 'progressBtn', text: '진행사항' },
    { field: 'updateBtn', text: '업데이트' },
    { field: 'updateDate', text: '업데이트 날짜', sort: '' }
  ];

  // Receipt Temp Data
  const receiptTempItem = [
    {
      id: '123',
      locate: '본점',
      name: '유진호',
      items: '정장 1EA, 셔츠 2EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('receipt', '123', '입고완료'),
      updateBtn: UpdateBtn('receipt', '123'),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: '456',
      locate: '청담',
      name: '최용국',
      items: '캐시미어 코드 1EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('receipt', '456', '원단입고'),
      updateBtn: UpdateBtn('receipt', '456'),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      id: '789',
      locate: '대구',
      name: '이병호',
      items: '헤링본 스포츠 자켓 1EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('receipt', '123', '제작'),
      updateBtn: UpdateBtn('receipt', '123'),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    }
  ];

  // Release Table Header Set
  const releaseHeaderSet = [
    { field: 'number', text: '번호', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'items', text: '품명', sort: '' },
    { field: 'orderDate', text: '출고요청 날짜', sort: '' },
    { field: 'completeDate', text: '출고완료 날짜', sort: '' },
    { field: 'progressBtn', text: '진행사항' },
    { field: 'updateBtn', text: '업데이트' },
    { field: 'updateDate', text: '업데이트 날짜', sort: '' }
  ];

  // Release Temp Data
  const releaseTempItem = [
    {
      number: 1,
      name: '유진호',
      items: '정장 1EA, 셔츠 2EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('release', 1, '출고완료'),
      updateBtn: UpdateBtn('release', 1),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      number: 2,
      name: '최용국',
      items: '캐시미어 코드 1EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('release', 2, '출고준비'),
      updateBtn: UpdateBtn('release', 2),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    },
    {
      number: 3,
      name: '이병호',
      items: '헤링본 스포츠 자켓 1EA',
      orderDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      completeDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss'),
      progressBtn: ProgressBtn('release', 1, '출고완료'),
      updateBtn: UpdateBtn('release', 3),
      updateDate: moment(new Date('2018.07.02 04:30:00')).format('YYYY.MM.DD HH:mm:ss')
    }
  ];

  // 주문 등록
  const addOrder = () => {
    console.log('btn click');
  };
  
  // 더보기
  const onMoreBtn = () => {
    console.log('btn click');
  };

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
                onHandle={e => onMoreBtn(e)}
                name="더보기"
              />
            </div>
          </div>
          <div className="_rt">
            <div className="_addOrder">
              <BorderButton
                addClass="addOrderBtn"
                onHandle={e => addOrder(e)}
                name="주문 등록"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={receiptHeaderSet}
            data={receiptTempItem}
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
                onHandle={e => onMoreBtn(e)}
                name="더보기"
                style={{
                  
                }}
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Table
            headerSet={releaseHeaderSet}
            data={releaseTempItem}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrderRelease;
