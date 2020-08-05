import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';

/*  User Import  */
import BorderButton from 'common/Button/BorderButton';
import Calendar from 'common/Calendar';
import Select from 'common/Select/Select';
import EventClickModal from './EventClickModal';
import Config from 'config';

/*  CSS  */
import './index.css';

/* Context */
import { UserInfoContext } from 'contexts/UserInfoContext';
import { SiteListContext } from 'contexts/SiteListContext';
import { ProgressContext } from 'contexts/ProgressContext';

const DashBoard = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  const [siteList] = useContext(SiteListContext); // 지점 리스트
  const [progress] = useContext(ProgressContext); // 진행상황 리스트
  
  const [scheduleList, setScheduleList] = useState([]); // 상담일정 리스트
  const [calState, setCalState] = useState({
    site: '전체',
    s_code: 'all'
  }); // calendar용 state

  // 상담 일정 리스트 가져오기
  const getScheduleList = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/promise/selectByAll`,
      method: 'post',
      data: {
        site: calState.s_code === 'all' ? undefined : calState.site,
        now_month: '08'
      }
    };
    try {
      // 데이터 reset
      setScheduleList([]);
      let setData = await axios(options);

      let result = setData?.data?.data; // list result
      let items = [];
      if (result) {
        for (let i in result) {
          if (Object.prototype.hasOwnProperty.call(result, i)) {
            let row = result[i];

            let convertData = {
              ...row,
              // calendar 필수 데이터는 명시
              id: row.id,
              title: row.name,
              start: new Date(row.start_date),
              end: new Date(row.end_date)
            };

            items.push(convertData);
          }
        }
      }

      console.log(items);
      setScheduleList(items);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  // 상담일정 리스트를 가져온다.
  useEffect(() => {
    if (scheduleList.length === 0) getScheduleList();
  }, [progress]);

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
          <Calendar
            events={scheduleList}
            eventClick={EventClickModal}
            getList={getScheduleList}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashBoard;
