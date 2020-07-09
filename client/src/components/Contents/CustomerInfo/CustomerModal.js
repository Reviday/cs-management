import React, { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import Select from 'common/Select/Select';
import Input from 'common/Input/Input';
import InputCustom from 'common/Input/InputCustom';
import Alert from 'common/Modal/ModalAlert';
import Confirm from 'common/Modal/ModalConfirm';
import Postcode from 'common/Modal/ModalPostcode';
import BorderButton from 'common/Button/BorderButton';
import 'common/Modal/Modal.scss';
import Config from 'config';

const ModalContents = (props) => {
  const items = props.items;
  const siteList = items.siteList || [];
  const [state, setState] = useState(
    items.type === 'insertCustomer'
      ? {
        site: siteList[0].site,
        s_code: siteList[0].s_code,
        name: '',
        telpno: '',
        zipcode: '',
        address: '',
        detail_addr: '',
        product: '',
        interest_style: '',
        interest_skin: '',
        birth: '',
        customer_memo: ''
      }
      : {
        ...props.data,
        customer_memo: props.data.memo
      }
  );
  const [img, setImg] = useState([]);
  const upload = useRef('');


  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: ''
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

  // Postcode State
  const [isPostcode, setIsPostcode] = useState({
    view: false
  });

  // close postcode
  const togglePostcode = () => {
    setIsPostcode({
      view: !isPostcode.view
    });
  };

  const viewPostcode = async () => {
    setIsPostcode({
      view: !isPostcode.view
    });
  };

  // 고객 정보 중복 체크
  const duplCheck = async () => {
    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}/api/customer/check`,
      method: 'post',
      data: {
        name: state.name,
        telpno: state.telpno
      },
    };

    try {
      let setData = await axios(options);

      let result = setData.data.data; // true or false
      console.log('중복체크:', state.name, state.telpno, result);

      return result;
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const checkValidate = () => {
    let validation = true;
    let message = '';


    /**
     * check validate
     */

    // 1. 각 data 별로 빈 값이 존재하는지 체크
    if (validation) {
      let checkList = ['site', 'name', 'zipcode', 'address', 'telpno'];
      for (let key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key) && checkList.indexOf(key) > -1) {
          if (state[key] === undefined || state[key] === '') {
            validation = false;
            message = '비어있는 필수항목이 있습니다. (필수항목 : 지점, 이름, 우편번호, 주소, 연락처)';
          }
        }
      }
    }

    // 2. 고객 정보 중복 체크 (name, telpno)
    if (validation && !duplCheck()) {
      validation = false;
      message = '이미 등록된 고객 정보입니다. 고객 이름과, 연락처를 확인해주시기 바랍니다.';
    }


    // validation에서 체크되지 않은 항목이 존재하면 alert창 출력
    if (!validation) {
      setAlertModal({
        show: true,
        title: '오류 메시지',
        content: message
      });
    }

    return validation;
  };


  // 일괄 처리 함수
  const executeCustomer = async (type) => {
    if (type === 'cancel') {
      // state값 초기화 후, modal 닫기
      setState({});
      setImg([]);
      props.hide();
    }

    // check validate
    // if (checkValidate()) return false;

    const formData = new FormData();
    console.log(img[0]);
    formData.append('file', img);
    for (let key in state) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        formData.append(key, state[key]);
      }
    }

    // set options
    let options = {
      url: `http://${Config.API_HOST.IP}/api/customer/${type}`,
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
      console.log(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 주소 검색
  const setAddress = (data) => {
    // data 요소 중 fullAddress와 zonecode만 가져올 것
    setState({
      ...state,
      zipcode: data.zonecode,
      address: data.fullAddress
    });
  };

  // 이미지 업로드용 함수
  const uploadImg = (files = []) => {
    let fileList = [];
    if (files.length > 0) {
      // for (let i in files) {
      //   if (Object.prototype.hasOwnProperty.call(files, i)) {
      //     fileList.push(files[i]);
      //   }
      // }
      setImg(img.concat(files[0]));
    }
  };

  return (
    <React.Fragment>
      <div className="modal_content" style={{ height: 'fit-content', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div" style={{ minHeight: '515px', height: 'fit-content' }}>
          <div className="box_layout noshadow">
            <div className="_content">
              <div className="grid_box">
                <div className="rows-mb-20">
                  {
                    // siteList가 존재하지 않거나, 개수가 0개이면
                    // input 스타일로 처리. 있으면 select 스타일로 처리.
                    siteList && siteList.length > 0
                      ? (
                        <Select
                          name="지점"
                          setKey="s_code"
                          setVal="site"
                          list={siteList}
                          setValue={e => setState({ ...state, site: e })}
                        />
                      )
                      : (
                        <Input
                          name="지점"
                          value={state.site}
                          setValue={() => {}} // 값을 바꾸지 않음.
                          style={{ width: '120px' }}
                          disabled
                        />
                      )
                  }
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="고객명"
                    value={state.name}
                    setValue={e => setState({ ...state, name: e })}
                    style={{ width: '150px' }}
                    disabled={items.type === 'showCustomer'}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="연락처"
                    value={state.telpno}
                    setValue={e => setState({ ...state, telpno: e })}
                    style={{ width: '300px' }}
                    setReg={/[^0-9]/gi}
                    disabled={items.type === 'showCustomer'}
                  />
                </div>
                <div className="rows-mb-20">
                  <InputCustom
                    name="주소"
                    topObj={{
                      value: state.zipcode,
                      setValue: e => setState({ ...state, zipcode: e }),
                      placeholder: '우편번호',
                      style: { width: '100px' },
                      disabled: true
                    }}
                    middleObj={{
                      value: state.address,
                      setValue: e => setState({ ...state, address: e }),
                      placeholder: '주소',
                      style: { width: '300px', marginBottom: '7px' },
                      disabled: true
                    }}
                    bottomObj={{
                      value: state.detail_addr,
                      setValue: e => setState({ ...state, detail_addr: e }),
                      placeholder: '상세주소',
                      style: { width: '300px' },
                      disabled: items.type === 'showCustomer'
                    }}
                    btnObj={{
                      addClass: 'addr_searchBtn',
                      value: '주소 검색',
                      onClick: viewPostcode,
                      disabled: items.type === 'showCustomer'
                    }}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="고객선호 스타일"
                    value={state.interest_style}
                    setValue={e => setState({ ...state, interest_style: e })}
                    style={{ width: '300px', marginTop: '7px' }}
                    titleStyle={{ fontSize: '15px', lineHeight: '16px' }}
                    disabled={items.type === 'showCustomer'}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="고객선호 원단"
                    value={state.interest_skin}
                    setValue={e => setState({ ...state, interest_skin: e })}
                    style={{ width: '300px', marginTop: '7px' }}
                    titleStyle={{ fontSize: '15px', lineHeight: '16px' }}
                    disabled={items.type === 'showCustomer'}
                  />
                </div>
                <div className="rows-mb-20">
                  <Input
                    name="메모"
                    value={state.memo}
                    setValue={e => setState({ ...state, memo: e })}
                    style={{ width: '300px' }}
                    disabled={items.type === 'showCustomer'}
                  />
                </div>
                <div className="rows-mb-20">
                  {/* TO-DO: showCustomer에 대한 처리 필요 */}
                  <div className="row_title">
                    사진등록
                  </div>
                  <div className="row_input" style={{ width: '360px' }}>
                    <div className={`img_list${img.length > 0 ? ' on' : ''}`}>
                      {
                        img.map((item, index) => {
                          let key = `${index}_${item.name}`;
                          return (
                            <div key={key}>
                              <span>{item.name}</span>
                              <div
                                className="removeBtn"
                                onClick={() => {
                                  setImg(
                                    img.filter(target => target !== item)
                                  );
                                  console.log(upload.current);
                                }}
                              />
                            </div>
                          );
                        })
                      }
                    </div>
                    {
                      items.type !== 'showCustomer'
                        && (
                          <React.Fragment>
                            <input
                              className="img_upload"
                              type="button"
                              value="사진첨부"
                              onClick={() => upload.current.click()}
                              disabled={items.type === 'showCustomer'}
                            />
                            <input
                              ref={upload}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={e => uploadImg(e.target.files)}
                              style={{ display: 'none' }}
                              disabled={items.type === 'showCustomer'}
                            />
                          </React.Fragment>
                        )
                    }
                  </div>
                </div>
                <div className="rows" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  {
                    items.type === 'insertCustomer'
                      && (
                        <React.Fragment>
                          <BorderButton
                            addClass="insertBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
                              setConfirmModal({
                                show: true,
                                title: '확인 메시지',
                                content: '고객을 등록하시겠습니까?',
                                type: 'insert'
                              });
                            }}
                            name="등록"
                            style={{ width: '80px' }}
                          />
                        </React.Fragment>
                      )
                  }
                  {
                    items.type === 'update'
                      && (
                        <React.Fragment>
                          <BorderButton
                            addClass="updateBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
                              setConfirmModal({
                                show: true,
                                title: '확인 메시지',
                                content: '고객 정보를 수정하시겠습니까?',
                                type: 'update'
                              });
                            }}
                            name="수정"
                            style={{ width: '80px' }}
                          />
                          <BorderButton
                            addClass="deleteBtn"
                            onHandle={() => {
                              // check validate
                              if (!checkValidate()) return false;
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
                        </React.Fragment>
                      )
                  }
                  <BorderButton
                    addClass="cancelBtn"
                    onHandle={() => executeCustomer('cancel')}
                    name="취소"
                    style={{ width: '80px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Confirm
        view={confirmModal.show}
        title={confirmModal.title}
        content={confirmModal.content}
        hide={toggleConfirm}
        execute={() => executeCustomer(confirmModal.type)}
      />
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        hide={toggleAlert}
      />
      <Postcode
        set={isPostcode}
        hide={togglePostcode}
        title="우편번호 검색"
        setAddress={setAddress}
      />
    </React.Fragment>
  );
};

export default ModalContents;
