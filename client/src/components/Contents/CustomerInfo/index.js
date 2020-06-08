import React, { useState } from 'react';
import BorderButton from 'common/Button/BorderButton';

const CustomerInfo = (props) => {
  
  const addCostomer = () => {
    console.log('btn click');
  };
    
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
                onHandle={e => addCostomer(e)}
                name="고객등록"
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

export default CustomerInfo;
