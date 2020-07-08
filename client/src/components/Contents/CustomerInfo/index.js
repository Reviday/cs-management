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
  const [siteList, setSiteList] = useState([]); // 지점 리스트
  const [progress, setProgress] = useState([]); // 진행상황 리스트
  const [customerTotal, setCustomerTotal] = useState(0); // 고객 수
  const [customerData, setCustomerData] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const [customerOrderList, setCustomerOrderList] = useState([]);

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

  const priceType = [
    { code: 0, text: '미결제' },
    { code: 1, text: '현금 결제' },
    { code: 2, text: '카드 결제' }
  ];

  const addCustomer = () => {
    console.log('btn click');
  };

  // 진행 상황 버튼
  const ProgressBtn = (data) => {
    let name = '';
    let addClass = '';

    for (let i in progress) {
      if (progress[i].order_status === data.order_status) {
        name = progress[i].status_name;
        addClass = `type${progress[i].order_status}`;
        break;
      }
    }

    const onHandle = () => {
      viewModal('progress', data);
    };

    return (
      <BorderButton
        addClass={`progress ${addClass}`}
        onHandle={e => onHandle(e)}
        name={name}
        disabled
      />
    );
  };

  // progress 정보 가져오기
  const getProgressInfo = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/order/making/statuslist`,
      method: 'post'
    };

    try {
      let setData = await axios(options);
      let result = setData?.data?.data;
      if (result) setProgress(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // Site List 정보 가져오기
  const getSiteList = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/account/siteslist`,
      method: 'post'
    };

    try {
      let setData = await axios(options);
      let result = setData?.data?.data;
      if (result) setSiteList(result);
      console.log(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const getCustomerList = async (start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/customer/select`,
      method: 'post',
      data: {
        start: start || 1
      }
    };

    let countOption = {
      url: `http://${Config.API_HOST.IP}/api/order/making/count`,
      method: 'post',
      data: {
        category: 'customer',
      }
    };

    try {
      setCustomerData([]);
      let listSetData = await axios(options);
      let countSetData = await axios(countOption);

      let result = listSetData?.data?.data; // list result
      let count = countSetData?.data?.data?.total; // count result

      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];

            let convertData = {
              ...row,
              create_at: moment(new Date(row.create_at)).format('YYYY.MM.DD'),
              lastorder: row.lastorder ? moment(new Date(row.lastorder)).format('YYYY.MM.DD') : '최근 주문 내역이 없습니다.'
            };

            items.push(convertData);
          }
        }
      }

      console.log('customer:::', result);
      setCustomerData(items);
      setCustomerTotal(count);
      // 데이터가 존재하면 첫번째 요소를 자동으로 선택
      if (result?.length > 0) setSelectCustomer(result[0]);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const getOrderListByCustomer = async (data, start) => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/order/making`,
      method: 'post',
      data: {
        category: 'order',
        action: 's',
        start: start || 1,
        search_field: 'name',
        search_word: data.name,
        search_telpno: data.telpno.replace(/[^0-9]/g, '')
      }
    };

    try {
      console.log('orderlsit:::', options);
      let setData = await axios(options);

      let result = setData.data.data;
      console.log('selec', result);
      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];

            let convertData = {
              ...row,
              price_txt: priceType.filter(type => type.code === row.price_type)[0]?.text,
              order_date: moment(new Date(row.order_date)).format('YYYY.MM.DD'),
              progressBtn: ProgressBtn(row),
            };

            items.push(convertData);
          }
        }
      }

      setCustomerOrderList(items);
      setSelectCustomer(data);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    if (progress.length === 0) getProgressInfo();
    if (siteList.length === 0) getSiteList(); // 지점 리스트
    if (customerData.length === 0) getCustomerList();
  }, [siteList]);

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
            total={customerTotal}
            setSelectCustomer={getOrderListByCustomer}
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
          items={{ type: isModal.type, siteList: siteList }}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerInfo;
