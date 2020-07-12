import React, { useRef } from 'react';
import Table from 'common/Table';
import Paging from 'common/Paging';

const CustomerTablePage = (props) => {
  const data = props.data || [];
  const total = props.total || 0;
  const setSelectCustomer = props.setSelectCustomer;
  const getCustomerList = props.getCustomerList;
  
  const searchField = useRef(props?.searchData?.field || 'default');
  const searchWord = useRef(props?.searchData?.word || '');

  const customerHeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'create_at', text: '가입 날짜', sort: '' },
    { field: 'lastorder', text: '최근 주문날짜', sort: '' }
  ];
    

  const onHandle = () => {
    let data = {
      field: searchField.current.value,
      word: searchWord.current.value
    };

    // 검색 데이터 저장
    setSearchData({
      ...data,
      set: true,
    });

    // 검색 데이터 기반으로 리스트를 새로 불러옴
    getCustomerList(1, data);
  };

  return (
    <div className="flex_box">
      <div className="ct_box">
        <div className="rows" style={{ width: 'calc(100% - 100px)' }}>
          <div className="_rt">
            {`총 고객: ${total}명`}
          </div>
        </div>
        <Table
          headerSet={customerHeaderSet}
          data={data}
          recordLimit={10}
          onClick={data => setSelectCustomer(data)}
          tableStyle={{ marginTop: '10px' }}
        />
        <div className="ct_box_footer">
          <div className="rows_flex">
            <Paging
              onClick={start => getCustomerList(start, props.searchData)}
              totalCount={total} // total 가져오는 로직 필요.
              listCount={10}
              displayCount={10}
              current={1}
            />
          </div>
          <div className="rows_flex">
            <div className="search_field">
              <select ref={searchField} name="sel_field" defaultValue="default">
                <option value="default" disabled hidden>검색영역</option>
                <option value="site">지점</option>
                <option value="name">고객명</option>
              </select>
              <input ref={searchWord} type="text" className="search" placeholder="Search" />
              <button type="button" className="search_btn" onClick={onHandle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTablePage;
