import React from 'react';
import Table from 'common/Table';
import Paging from 'common/Paging';

const CustomerInfoPage = (props) => {
  const selectCustomer = props.selectCustomer;
  const orderList = props.orderList;
  const orderTotal = props.orderTotal || 0;

  // Order Table Header Set
  const orderHeaderSet = [
    { field: 'site', text: '지점', sort: '' },
    { field: 'name', text: '고객명', sort: '' },
    { field: 'product', text: '품명', sort: '' },
    { field: 'order_date', text: '주문 날짜', sort: '' },
    { field: 'price', text: '금액', sort: '' },
    { field: 'price_txt', text: '결제 상태', sort: '' }, // 추후 price_chk로 변경해야 함.
    { field: 'progressBtn', text: '진행사항' },
    { field: 'manager', text: '담당자' },
  ];
    
  return (
    <div className="flex_box">
      <div className="ct_box">
        <div className="name_title">
          고객명
        </div>
        <div className="name_text">
          {selectCustomer?.name}
        </div>

        <div className="name_title" style={{ marginTop: '50px' }}>
          고객 정보
        </div>
        <div className="customer_info_table">
          <table>
            <tbody>
              <tr className="tr_top">
                <td className="td_title">
                  고객명
                </td>
                <td className="td_data">
                  {selectCustomer?.name}
                </td>
                <td className="td_title">
                  연락처
                </td>
                <td className="td_data">
                  {selectCustomer?.telno}
                </td>
              </tr>
              <tr>
                <td className="td_title">
                  주소
                </td>
                <td className="td_data" colSpan="3">
                  {selectCustomer?.address}
                </td>
              </tr>
              <tr>
                <td className="td_title">
                  고객 성향
                </td>
                <td className="td_data" colSpan="3">
                  {selectCustomer?.tendency}
                </td>
              </tr>
              <tr>
                <td className="td_title">
                  메모
                </td>
                <td className="td_data" colSpan="3">
                  {selectCustomer?.memo}
                </td>
              </tr>
              <tr className="tr_bottom">
                <td className="td_title">
                  선호하는 스타일
                </td>
                <td className="td_data">
                  {selectCustomer.interest_style}
                </td>
                <td className="td_title">
                  선호하는 원단
                </td>
                <td className="td_data">
                  {selectCustomer.interest_skin}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="name_title" style={{ marginTop: '50px' }}>
          고객 구매 내역
        </div>
        <div className="ct_box">
          <Table
            headerSet={orderHeaderSet}
            data={orderList}
            onClick={orderData => viewModal('showOrder', orderData)}
            recordLimit="none"
          />
          <div className="ct_box_footer">
            <div className="rows_flex">
              <Paging
                onClick={start => getOrderList(category, start)}
                totalCount={orderTotal}
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
    </div>
  );
};

export default CustomerInfoPage;
