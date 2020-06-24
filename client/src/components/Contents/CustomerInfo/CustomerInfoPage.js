import React from 'react';
import Table from 'common/Table';
import Paging from 'common/Paging';

const CustomerInfoPage = (props) => {
  const selectCustomer = props.selectCustomer;
    
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
                  {selectCustomer?.phone}
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
                  {/* {selectCustomer.address} */}
                </td>
                <td className="td_title">
                  선호하는 원단
                </td>
                <td className="td_data">
                  {/* {selectCustomer.address} */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="name_title" style={{ marginTop: '50px' }}>
          고객 구매 내역
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoPage;
