import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Paging from 'common/Paging';

import './index.css';

const CustomerInfo = (props) => {
  
  const addCostomer = () => {
    console.log('btn click');
  };

  // Customer Table Header Set
  const customerHeaderSet = [
    { field: 'id', text: '번호', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'join_date', text: '가입 날짜', sort: '' },
    { field: 'last_order_date', text: '최근 주문날짜', sort: '' }
  ];

  const tempData = [
    { id: 1, name: 'temp1', join_date: '2010-10-10', last_order_date: '2010-10-10' },
    { id: 2, name: 'temp1', join_date: '2010-10-10', last_order_date: '2010-10-10' },
    { id: 3, name: 'temp1', join_date: '2010-10-10', last_order_date: '2010-10-10' },
    { id: 4, name: 'temp1', join_date: '2010-10-10', last_order_date: '2010-10-10' },
    { id: 5, name: 'temp1', join_date: '2010-10-10', last_order_date: '2010-10-10' }
  ];
    
  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              고객 관리
            </div>
          </div>
          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="addCostomerBtn"
                onHandle={e => addCostomer(e)}
                name="고객등록"
              />
            </div>
          </div>
        </div>
        <div className="ct_flex">
          <div className="flex_box">
            <div className="ct_box">
              <div className="rows" style={{ width: 'calc(100% - 100px)' }}>
                <div className="_rt">
                  총 고객: 00명
                </div>
              </div>
              <Table
                headerSet={customerHeaderSet}
                data={tempData}
                recordLimit={5}
                tableStyle={{ marginTop: '10px' }}
              />
            </div>
          </div>
          <div className="flex_box">
            <div className="ct_box">
              <div className="name_title">
                고객명
              </div>
              <div className="name_text">
                홍길동
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </React.Fragment>
  );
};

export default CustomerInfo;
