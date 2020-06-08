import React, { useState } from 'react';
import BorderButton from 'common/Button/BorderButton';

const OrderRelease = (props) => {

  const addOrder = () => {
    console.log('btn click');
  };
  
  const onMoreBtn = () => {
    console.log('btn click');
  };

  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
             입고 일정
            </div>
          </div>
          
          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="moreBtn"
                onHandle={e => onMoreBtn(e)}
                name="더보기"
              />
            </div>
          </div>
          <div className="_rt">
            <div className="_addOrder">
              <BorderButton
                addClass="addOrderBtn"
                onHandle={e => addOrder(e)}
                name="주문 등록"
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          content
        </div>

        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              출고 현황
            </div>
          </div>
          <div className="_rt">
            <div className="_more">
              <BorderButton
                addClass="moreBtn"
                onHandle={e => onMoreBtn(e)}
                name="더보기"
                style={{
                  
                }}
              />
            </div>
          </div>
        </div>
        <div className="ct_box">
          content
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrderRelease;
