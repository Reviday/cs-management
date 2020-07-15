import React, { useState } from 'react';
import moment from 'moment';
/*  User Import  */
import BorderButton from 'common/Button/BorderButton';
import Calendar from 'common/Calendar';
/*  CSS  */
import './index.css';

const DashBoard = (props) => {

  const onMoreBtn = () => {
    console.log('btn click');
  };

  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
             전체 일정
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Calendar />
        </div>

        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              입/출고 현황
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
        </div>
        <div className="ct_box">
          <div className="_flex">
            <div className="card">
              <div className="card_cont">
                <div className="cont_header">
                  {moment(new Date()).format('YYYY.MM.DD HH:mm')}
                </div>
                <div className="cont_body">
                  <div className="item_name">
                    전체
                  </div>
                  <div className="item_val">
                    <div className="val_all">
                      64/
                    </div>
                    <div className="val_???">
                      27
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card_cont">
                <div className="cont_header">
                  {moment(new Date()).format('YYYY.MM.DD HH:mm')}
                </div>
                <div className="cont_body">
                  body
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card_cont">
                <div className="cont_header">
                  {moment(new Date()).format('YYYY.MM.DD HH:mm')}
                </div>
                <div className="cont_body">
                  body
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashBoard;
