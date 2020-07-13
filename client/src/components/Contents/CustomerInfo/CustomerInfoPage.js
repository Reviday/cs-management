import React, { useState, useContext } from 'react';
import axios from 'axios';

import Table from 'common/Table';
import Paging from 'common/Paging';
import BorderButton from 'common/Button/BorderButton';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import Config from 'config';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';

const CustomerInfoPage = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  const selectCustomer = props.selectCustomer;
  const orderList = props.orderList || [];
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

  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: '',
      type: ''
    });
  };

  // confirmModal State
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleConfirm = () => {
    setConfirmModal({
      show: false,
      title: '',
      content: '',
      type: ''
    });
  };

  const deleteCustomer = async () => {
    const formData = new FormData();
    formData.append('name', selectCustomer.name);
    formData.append('telpno', selectCustomer.telpno.replace(/[^0-9]/g, ''));

    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}/api/customer/delete`,
      method: 'post',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    try {
      console.log(options);
      let setData = await axios(options);
      console.log('setData:::', setData);

      let result = setData.data.data;

      if (result === true) {
        setAlertModal({
          show: true,
          title: '알림 메시지',
          content: '고객 정보가 정상적으로 삭제되었습니다.',
          type: 'common'
        });
      } else if (result === false) {
        setAlertModal({
          show: true,
          title: '에러 메시지',
          content: '요청 수행이 정상적으로 이루어지지 않았습니다.',
          type: 'error'
        });
      }

    } catch (e) {
      console.log('ERROR', e);
    }
  };
    
  return (
    <React.Fragment>
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
                    {selectCustomer?.telpno}
                  </td>
                </tr>
                <tr>
                  <td className="td_title">
                  주소
                  </td>
                  <td className="td_data" colSpan="3">
                    {
                    !selectCustomer.detail_addr
                      ? selectCustomer?.address
                      : (`${selectCustomer?.address}, ${selectCustomer.detail_addr}`)
                  }
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
                    {selectCustomer.interest_style ? selectCustomer.interest_style : ''}
                  </td>
                  <td className="td_title">
                  선호하는 원단
                  </td>
                  <td className="td_data">
                    {selectCustomer.interest_skin ? selectCustomer.interest_skin : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="name_title" style={{ marginTop: '50px' }}>
          고객 구매 내역
          </div>
        
          <div className="ct_box">
            {
            orderList.length > 0
              ? (
                <React.Fragment>
                  <Table
                    headerSet={userInfo?.auth === 0 ? orderHeaderSet : orderHeaderSet.filter(item => item.field !== 'price')}
                    data={orderList}
                    recordLimit="none"
                    tableStyle={{ margin: '0' }}
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
                  </div>
                </React.Fragment>
              )
              : (
                <div>주문 정보가 없습니다.</div>
              )
          }
          </div>

          <div className="name_title" style={{ marginTop: '50px' }}>
          고객 사진
          </div>
          <div className="ct_box">
            {
            // 데이터가 없거나, 존재하지만 빈 값만 있을 경우 후자를 출력
            // 데이터가 1개 존재하는데, 빈 값이여서 출력이 안되는 경우도 있음
            !selectCustomer.custom_image || selectCustomer.custom_image.length === 0
              || (selectCustomer.custom_image && selectCustomer.custom_image.length === 1 && selectCustomer.custom_image[0] === '')
              ? <div>등록된 사진이 없습니다.</div>
              : (
                <ul className="img_list">
                  {
                    selectCustomer.custom_image.map((image) => {
                      if (!image || image === '') return null;
                      return (<li key={image}>{image}</li>);
                    })
                  }
                </ul>
              )
          }
          </div>
          <div className="rows" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <BorderButton
              addClass="insertBtn"
              onHandle={() => props.viewModal(selectCustomer)}
              name="수정"
              style={{ width: '80px' }}
            />
            <BorderButton
              addClass="deleteBtn"
              onHandle={() => {
                setConfirmModal({
                  show: true,
                  title: '확인 메시지',
                  content: '고객 정보를 삭제하시겠습니까?',
                  type: 'delete'
                });
              }}
              name="삭제"
              style={{ width: '80px' }}
            />
          </div>
        </div>
      </div>
      <Confirm
        view={confirmModal.show}
        title={confirmModal.title}
        content={confirmModal.content}
        hide={toggleConfirm}
        execute={deleteCustomer}
      />
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        type={alertModal.type}
        hide={toggleAlert}
      />
    </React.Fragment>
  );
};

export default CustomerInfoPage;
