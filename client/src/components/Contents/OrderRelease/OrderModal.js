import React, { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import BorderButton from 'common/Button/BorderButton';
import 'common/Modal/Modal.scss';

const ModalContents = (props) => {
  const [state, setState] = useState(props.data);
  const items = props.items;

  const selected = useRef();

  const onHandle = (e) => {
    setValue(list.find(e => e._id === selected.current.value));
  };

  const checkValidate = () => {
    let validate = true;

    return true;
  };

  const insertOrder = async () => {
    // check validate
    if (checkValidate()) return false;

    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: {
        category: 'order',
        action: 'i',
        site: state.site,
        name: state.name,
        telpno: state.telpno,
        address: state.address,
        needs: state.needs,
        product: state.product,
        price: state.price,
        order_status: 0
        // 날짜는 BACK-END 에서
      }
    };
    try {
      console.log('options:::', options);
      let setData = await axios(options);
      // if (setData.data.status === 400) {
      //   setAlertModal({
      //     show: true,
      //     title: '오류 메시지',
      //     content: setData.data.message
      //   });
      //   return false;
      // }

      console.log(setData);
      let result = setData.data.data;
      console.log(result);


    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const calcelOrder = () => {
    // state값 초기화 후, modal 닫기
    setState({});
    props.hide();
  };

  const updateOrder = async () => {
    // check validate
    if (checkValidate()) return false;

    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/order/making`,
      method: 'post',
      data: {
        category: 'order',
        action: 'u',
        site: state.site,
        name: state.name,
        telpno: state.telpno,
        address: state.address,
        needs: state.needs,
        product: state.product,
        price: state.price,
        order_status: state.order_status,
        // order_date: state.order_date,
        // complete_date: state.complete_date
      }
    };
    try {
      console.log('options:::', options);
      let setData = await axios(options);
      // if (setData.data.status === 400) {
      //   setAlertModal({
      //     show: true,
      //     title: '오류 메시지',
      //     content: setData.data.message
      //   });
      //   return false;
      // }

      console.log(setData);
      let result = setData.data.data;

      console.log(result);
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const deleteOrder = () => {

  };

  return (
    <React.Fragment>
      <div className="modal_content" style={{ height: '550px', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content fx_h_380">
              <div className="grid_box">
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    지점
                  </div>
                  <div className="order_row_input">
                    <select ref={selected} onChange={onHandle}>
                      {
                        state.list?.map((item, index) => {
                          return (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    고객명
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="고객명" style={{ width: '150px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    연락처
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="연락처" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    주소
                  </div>
                  <div className="order_row_input" style={{ width: '360px' }}>
                    <input type="text" placeholder="우편번호" style={{ width: '100px' }} />
                    <input className="addr_searchBtn" type="button" value="주소 검색" />
                    <input type="text" placeholder="상세주소" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    상품명
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="상품명" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    가격
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="가격" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    특이사항
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="특이사항" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'insertOrder'
                      ? (
                        <React.Fragment>
                          <BorderButton
                            addClass="insertBtn"
                            onHandle={() => insertOrder()}
                            name="등록"
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => calcelOrder()}
                            name="취소"
                          />
                        </React.Fragment>
                      )
                      : (
                        <React.Fragment>
                          <BorderButton
                            addClass="updateBtn"
                            onHandle={() => updateOrder()}
                            name="수정"
                          />
                          <BorderButton
                            addClass="deleteBtn"
                            onHandle={() => deleteOrder()}
                            name="삭제"
                          />
                          <BorderButton
                            addClass="cancelBtn"
                            onHandle={() => calcelOrder()}
                            name="취소"
                          />
                        </React.Fragment>
                      )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalContents;
