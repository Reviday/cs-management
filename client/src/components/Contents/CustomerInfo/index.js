import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';

import CustomerTablePage from './CustomerTablePage';
import CustomerInfoPage from './CustomerInfoPage';
import BorderButton from 'common/Button/BorderButton';
import Modal from 'common/Modal/ModalCover';
import CustomerModalContent from './CustomerModal';
import Config from 'config';

import './index.css';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';

// 권한 제한이 존재하는 페이지 (auth < 2)
const CustomerInfo = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [progress, setProgress] = useState([]); // 진행상황 리스트
  const [customerTotal, setCustomerTotal] = useState(0); // 고객 수
  const [customerData, setCustomerData] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const [customerOrderList, setCustomerOrderList] = useState([]);
  const [searchData, setSearchData] = useState({ // 검색 시 사용될 데이터(확정 검색 데이터)
    set: false,
    field: '',
    word: ''
  });

  // Modal State
  const [isModal, setIsModal] = useState({
    view: false,
    type: '',
    data: {}
  });

  // close modal
  const toggleModal = () => {
    setIsModal({
      view: !isModal.view,
      type: '',
      data: {}
    });
  };

  const viewModal = async (type, data) => {
    setIsModal({
      view: true,
      type: type,
      data: data || {}
    });
  };

  const priceType = [
    { code: 0, text: '미결제' },
    { code: 1, text: '현금 결제' },
    { code: 2, text: '카드 결제' }
  ];

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

  const getOrderListByCustomer = async (data, start) => {
    // 권한 값이 1보다 크면 함수 작동이 되지 않는다.
    if (userInfo.auth > 1) return false;

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
      let setData = await axios(options);

      let result = setData.data.data;
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

            // 권한이 부족하면 price 필드를 제거
            if (userInfo?.auth > 0) {
              delete convertData.price;
            }

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


  const getCustomerList = async (start, data) => {
    // 권한 값이 1보다 크면 함수 작동이 되지 않는다.
    if (userInfo.auth > 1) return false;

    let options = {
      url: `http://${Config.API_HOST.IP}/api/customer/select`,
      method: 'post',
      data: {
        start: start || 1,
        search_field: data?.field || undefined,
        search_word: data?.word || undefined
      }
    };

    let countOption = {
      url: `http://${Config.API_HOST.IP}/api/order/making/count`,
      method: 'post',
      data: {
        category: 'customer',
        search_field: data?.field || undefined,
        search_word: data?.word || undefined
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
      if (result?.length > 0) getOrderListByCustomer(result[0]);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    if (progress.length === 0) getProgressInfo();
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
            searchData={searchData}
            setSearchData={setSearchData}
            setSelectCustomer={getOrderListByCustomer}
            getCustomerList={getCustomerList}
          />
          <CustomerInfoPage
            selectCustomer={selectCustomer}
            orderList={customerOrderList}
            viewModal={data => viewModal('update', data)}
            getCustomerList={getCustomerList}
          />
        </div>
        <Modal
          set={isModal}
          hide={toggleModal}
          title="Customer Card"
          style={{ width: '500px', height: 'fit-content' }}
          contents={CustomerModalContent}
          items={{ type: isModal.type, siteList: siteList, getCustomerList: getCustomerList }}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerInfo;
