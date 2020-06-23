import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import BorderButton from 'common/Button/BorderButton';
import Table from 'common/Table';
import Paging from 'common/Paging';
import Modal from 'common/Modal/ModalCover';
import CustomerModalContent from './CustomerModal';
import Config from 'config';

import './index.css';

const CustomerInfo = (props) => {
  const [customerData, setCustomerData] = useState([]);
  const [selectCutomer, setSelectCustomer] = useState({});

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

  const viewModal = async (type) => {
    setIsModal({
      ...isModal,
      view: !isModal.view,
      type: type,
      data: {}
    });
  };
  
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
    { id: 1, name: '홍길동', join_date: '2010-10-10', last_order_date: '2010-10-10', phone: '010-1234-5678', address: '경기도 성남시 분당구 판교로 255번길 62, 크루셜텍빌딩 8층', tendency: '', memo: '' },
    { id: 2, name: '홍길동2', join_date: '2010-10-10', last_order_date: '2010-10-10', phone: '010-1234-5678', address: '경기도 성남시 분당구 판교로 255번길 62, 크루셜텍빌딩 8층', tendency: '', memo: '' },
    { id: 3, name: '홍길동3', join_date: '2010-10-10', last_order_date: '2010-10-10', phone: '010-1234-5678', address: '경기도 성남시 분당구 판교로 255번길 62, 크루셜텍빌딩 8층', tendency: '', memo: '' },
    { id: 4, name: '홍길동4', join_date: '2010-10-10', last_order_date: '2010-10-10', phone: '010-1234-5678', address: '경기도 성남시 분당구 판교로 255번길 62, 크루셜텍빌딩 8층', tendency: '', memo: '' },
    { id: 5, name: '홍길동5', join_date: '2010-10-10', last_order_date: '2010-10-10', phone: '010-1234-5678', address: '경기도 성남시 분당구 판교로 255번길 62, 크루셜텍빌딩 8층', tendency: '', memo: '' }
  ];

  const getCustomerList = async (start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: {
        category: 'customer',
        action: 's',
        start: start || 1
      }
    };

    try {
      console.log('options:::', options);
      let setData = await axios(options);

      // tempData
      setCustomerData(tempData);
      setSelectCustomer(tempData[0]);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    console.log(customerData);
    if (customerData.length === 0) getCustomerList();
  }, [customerData]);
    
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
                onHandle={e => viewModal('insertCustomer')}
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
                data={customerData}
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
          <div className="flex_box">
            <div className="ct_box">
              <div className="name_title">
                고객명
              </div>
              <div className="name_text">
                {selectCutomer?.name}
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
                        {selectCutomer?.name}
                      </td>
                      <td className="td_title">
                        연락처
                      </td>
                      <td className="td_data">
                        {selectCutomer?.phone}
                      </td>
                    </tr>
                    <tr>
                      <td className="td_title">
                        주소
                      </td>
                      <td className="td_data" colSpan="3">
                        {selectCutomer.address}
                      </td>
                    </tr>
                    <tr>
                      <td className="td_title">
                        고객 성향
                      </td>
                      <td className="td_data" colSpan="3">
                        {selectCutomer.tendency}
                      </td>
                    </tr>
                    <tr>
                      <td className="td_title">
                        메모
                      </td>
                      <td className="td_data" colSpan="3">
                        {selectCutomer.memo}
                      </td>
                    </tr>
                    <tr className="tr_bottom">
                      <td className="td_title">
                        선호하는 스타일
                      </td>
                      <td className="td_data">
                        {/* {selectCutomer.address} */}
                      </td>
                      <td className="td_title">
                        선호하는 원단
                      </td>
                      <td className="td_data">
                        {/* {selectCutomer.address} */}
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
        </div>
        <Modal
          set={isModal}
          hide={toggleModal}
          title="Customer Card"
          style={{ width: '500px', height: '565px' }}
          contents={CustomerModalContent}
          items={{ type: isModal.type }}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerInfo;
