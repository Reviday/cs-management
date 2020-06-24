import React from 'react';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Paging from 'common/Paging';

const ReleasePage = (props) => {
  const headerSet = props.headerSet;
  const data = props.data;
  const more = props.more;
  const onMoreBtn = props.onMoreBtn;
  const getOrderList = props.getOrderList;

  return (
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
          headerSet={headerSet}
          data={data}
          recordLimit="none"
        />
        <div className="ct_box_footer">
          <div className="rows_flex">
            <Paging
              onClick={start => getOrderList('ship', start)}
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

export default ReleasePage;
