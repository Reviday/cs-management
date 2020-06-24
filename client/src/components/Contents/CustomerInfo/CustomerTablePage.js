import React from 'react';
import Table from 'common/Table';
import Paging from 'common/Paging';

const CustomerTablePage = (props) => {
  const data = props.data || [];
  const getCustomerList = props.getCustomerList;
  

  const customerHeaderSet = [
    { field: 'id', text: '번호', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'join_date', text: '가입 날짜', sort: '' },
    { field: 'last_order_date', text: '최근 주문날짜', sort: '' }
  ];
    
  return (
    <div className="flex_box">
      <div className="ct_box">
        <div className="rows" style={{ width: 'calc(100% - 100px)' }}>
          <div className="_rt">
            총 고객: 00명
          </div>
        </div>
        <Table
          headerSet={customerHeaderSet}
          data={data}
          recordLimit={5}
          tableStyle={{ marginTop: '10px' }}
        />
        <div className="ct_box_footer">
          <div className="rows_flex">
            <Paging
              onClick={start => getCustomerList(start)}
              totalCount={100} // total 가져오는 로직 필요.
              listCount={10}
              displayCount={10}
              current={1}
            />
          </div>
          <div className="rows_flex">
            <div className="search_field">
              <select name="sel_field" defaultValue="default">
                <option value="default" disabled hidden>검색영역</option>
                <option value="site">지점</option>
                <option value="name">고객명</option>
                <option value="product">품명</option>
              </select>
              <input type="text" className="search" placeholder="Search" />
              <button type="button" className="search_btn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTablePage;
