import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import CustomerTablePage from './CustomerTablePage';
import CustomerInfoPage from './CustomerInfoPage';
import BorderButton from 'common/Button/BorderButton';
import Modal from 'common/Modal/ModalCover';
import CustomerModalContent from './CustomerModal';
import OrderModalContent from 'components/Contents/OrderRelease/OrderModal';
import Config from 'config';

import './index.css';

const CustomerInfo = (props) => {
  const [customerData, setCustomerData] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const [customerOrderList, setCustomerOrderList] = useState({});

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

  const viewModal = async (type, data) => {
    setIsModal({
      ...isModal,
      view: !isModal.view,
      type: type,
      data: data || {}
    });
  };

  const addCustomer = () => {
    console.log('btn click');
  };

  const getCustomerList = async (start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/customer/select`,
      method: 'post',
      data: {
        start: start || 1
      }
    };

    try {
      let setData = await axios(options);

      let result = setData.data.data;

      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];
  
            let convertData = {
              ...row,
              create_at: moment(new Date(row.create_at)).format('YYYY.MM.DD'),
            };
  
            items.push(convertData);
          }
        }
      }

      console.log('customer:::', result);
      setCustomerData(items);
      // 데이터가 존재하면 첫번째 요소를 자동으로 선택
      if (result?.length > 0) setSelectCustomer(result[0]);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const getCustomerById = async (data) => {
    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/customer/selectbyid`,
      method: 'post',
      data: {
        name: data.name,
        telpno: data.telpno.replace(/[^0-9]/g, '')
      }
    };

    try {
      console.log(options);
      let setData = await axios(options);

      let result = setData.data.data;
      console.log('selec', result);

    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
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
                addClass="addCustomerBtn"
                onHandle={() => viewModal('insertCustomer')}
                name="고객등록"
              />
            </div>
          </div>
        </div>
        <div className="ct_flex">
          <CustomerTablePage
            data={customerData}
            setSelectCustomer={getCustomerById}
            getCustomerList={getCustomerList}
          />
          <CustomerInfoPage
            selectCustomer={selectCustomer}
            orderList={customerOrderList}
            viewModal={data => viewModal('showCustomer', data)}
          />
        </div>
        <Modal
          set={isModal}
          hide={toggleModal}
          title={isModal.type === 'showOrder' ? '주문 정보' : 'Customer Card'}
          style={isModal.type === 'showOrder' ? { width: '500px', height: '685px' } : { width: '500px', height: 'fit-content' }}
          contents={isModal.type === 'showOrder' ? OrderModalContent : CustomerModalContent}
          items={{ type: isModal.type }}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerInfo;
