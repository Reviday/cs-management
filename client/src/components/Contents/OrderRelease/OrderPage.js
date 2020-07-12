import React, { useEffect, useRef } from 'react';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Paging from 'common/Paging';

const OrderPage = (props) => {
  const category = props.category; // category is 'order' or 'ship'
  const title = props.title;
  const headerSet = props.headerSet;
  const data = props.data;
  const total = props.total;
  const setSearchData = props.setSearchData; // 검색 시, 확정된 state 값을 고정시기 위한 state
  const more = props.more;
  const onMoreBtn = props.onMoreBtn;
  const viewModal = props.viewModal;
  const getOrderList = props.getOrderList;

  const searchField = useRef(props?.searchData?.field || 'default');
  const searchWord = useRef(props?.searchData?.word || '');

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
    getOrderList(category, 1, data);
  };

  useEffect(() => {
    if (more[category] === false) {
      
      if (searchField.current.value) {
        searchField.current.value = 'default';
      }
      if (searchWord.current.value) {
        searchWord.current.value = '';
      }
    }
  }, [more]);

  return (
    <div className={`ct_layout abs ${more[category] ? 'on' : ''}`}>
      <div className="ct_title">
        <div className="_lt">
          <div className={`_title ${category === 'delay' && 'delay_alert'}`}>
            {title}
            {
              category === 'delay'
                && (<span>{`: ${total}개`}</span>) // 추후에 개수 넘기면 수정
            }
          </div>
        </div>
        <div className="_rt">
          <div className="_more">
            <BorderButton
              addClass="moreBtn"
              onHandle={() => onMoreBtn(category)}
              name="접기"
            />
          </div>
        </div>
        {
          category === 'order'
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
        {
          category === 'receipt'
            ? (
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
            : null
        }
        
      </div>
      <div className="ct_box">
        <div className="rows _count">
          {`${category === 'order' ? `입고 ${total} 건` : category === 'ship' ? `출고 ${total} 건` : ''}`}
        </div>
        <Table
          tableStyle={{ margin: '10px 50px' }}
          headerSet={headerSet}
          data={data}
          onClick={data => viewModal('showOrder', data)}
          recordLimit="none"
        />
        <div className="ct_box_footer">
          <div className="rows_flex">
            <Paging
              onClick={start => getOrderList(category, start, props.searchData)}
              totalCount={total}
              listCount={10}
              displayCount={10}
              current={1}
            />
          </div>
          {
            // delay는 검색 기능 제한
            category !== 'delay'
              && (
              <div className="rows_flex">
                <div className="search_field">
                  <select ref={searchField} name="sel_field" defaultValue="default">
                    <option value="default" disabled hidden>검색영역</option>
                    <option value="site">지점</option>
                    <option value="name">고객명</option>
                    <option value="order_state">진행상황</option>
                  </select>
                  <input ref={searchWord} type="text" className="search" placeholder="Search" />
                  <button type="button" className="search_btn" onClick={onHandle} />
                </div>
              </div>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
