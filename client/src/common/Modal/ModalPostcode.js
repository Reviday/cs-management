import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import ReactDOM from 'react-dom';
import './Modal.scss';

// 우편 번호 검색 API용 모달창
const Postcode = (props) => {
  const setAddress = props.setAddress; //

  const boxStyle = props.style || {};
  const title = props.title || '';

  const handleComplete = (data) => {
    /**
     * data 객체 정보 (필요할 것 같은 요소만 작성해놓음)
     *
     *  # 주소
     * address: "서울 강남구 강남대로 708"
     * addressEnglish: "708, Gangnam-daero, Gangnam-gu, Seoul, Korea"
     *  # 지번 주소
     * jibunAddress: "서울 강남구 압구정동 386-1"
     * jibunAddressEnglish: "386-1, Apgujeong-dong, Gangnam-gu, Seoul, Korea"
     *  # 도로명 주소
     * roadAddress: "서울 강남구 강남대로 708"
     * roadAddressEnglish: "708, Gangnam-daero, Gangnam-gu, Seoul, Korea"
     *  # 건물명
     * buildingName: "한남대교레인보우카폐"
     *  # 새 우편번호
     * zonecode: "06000"
     *
     * ### 자세한 API 데이터 항목 관련하여 아래 사이트 참조 ###
     * url: http://postcode.map.daum.net/guide#info
     */

    let fullAddress = data.address; // 건물명 포함 주소
    let extraAddress = '';
    
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
 
    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

    // 데이터 반환
    setAddress({
      ...data,
      fullAddress: fullAddress
    });
    // 모달창 종료
    props.hide();
  };

  if (props.set.view) {
    return ReactDOM.createPortal(
      <React.Fragment>

        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal_layout">
            <div className="modal_box" style={boxStyle}>
              <div className="modal_top">
                <div className="m_title _left">
                  {title}
                </div>
                <div className="m_title _right">
                  <div className="m_close" onClick={props.hide} onKeyDown={props.hide} />
                </div>
              </div>
              <DaumPostcode
                onComplete={handleComplete}
                height="450"
                autoClose
              />
            </div>
          </div>
        </div>

      </React.Fragment>, document.body
    );
  }
  return null;
};


export default Postcode;
