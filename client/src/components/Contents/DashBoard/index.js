import React, { useState, useRef, useContext } from 'react';
import moment from 'moment';
/*  User Import  */
import BorderButton from 'common/Button/BorderButton';
import Calendar from 'common/Calendar';
import Select from 'common/Select/Select';
import Modal from 'common/Modal/ModalCover';
/*  CSS  */
import './index.css';

/* Context */
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';
import { ProgressContext } from 'contexts/ProgressContext';

const DashBoard = (props) => {

  const selected = useRef();
  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [progress] = useContext(ProgressContext); // 진행상황 리스트
  const [calState, setCalState] = useState({}); // calendar용 state
  const [orderState, setOrderState] = useState({}); // order용 state
  

  const onMoreBtn = () => {
    console.log('btn click');
  };

  return (
    <React.Fragment>
      <div className="ct_layout">
        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              {moment(new Date()).format('YYYY년 MM월')}
              <div className="row_input">
                <Select
                  setKey="s_code"
                  setVal="site"
                  useAll
                  list={siteList}
                  value={calState.s_code || 'all'}
                  setValue={(e) => {
                    let selectSite = siteList.filter(item => item.s_code === e);

                    if (selectSite.length === 0) {
                      selectSite = [{ site: '전체', s_code: 'all' }];
                    }

                    setCalState({
                      ...calState,
                      site: selectSite[0].site,
                      s_code: e
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ct_box">
          <Calendar />
        </div>

        <div className="ct_title">
          <div className="_lt">
            <div className="_title">
              금일 입고 예정
              <div className="row_input">
                <Select
                  setKey="s_code"
                  setVal="site"
                  useAll
                  list={siteList}
                  value={orderState.s_code || 'all'}
                  setValue={(e) => {
                    let selectSite = siteList.filter(item => item.s_code === e);

                    if (selectSite.length === 0) {
                      selectSite = [{ site: '전체', s_code: 'all' }];
                    }

                    setOrderState({
                      ...orderState,
                      site: selectSite[0].site,
                      s_code: e
                    });
                  }}
                />
              </div>
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
