import React, { useState, useContext } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import koLocale from '@fullcalendar/core/locales/ko';

/*  User Import  */
import Modal from 'common/Modal/ModalCover';
import BorderButton from 'common/Button/BorderButton';

/*  Context  */
import { UserInfoContext } from 'contexts/UserInfoContext';

/*  CSS  */
import './index.css';

/** **************************************************************************
MIT License

Copyright (c) 2020 Adam Shaw

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*************************************************************************** */

let eventGuid = 0;

const renderEventContent = (eventInfo) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const renderSidebarEvent = (event) => {
  return (
    <li key={event.id}>
      {/* <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b> */}
      <b>{formatDate(event.start, { hour: 'numeric', minute: '2-digit' })}</b>
      <i>{event.title}</i>
    </li>
  );
};

const createEventId = () => {
  return String(eventGuid++);
};

const Calendar = (props) => {

  const [userInfo] = useContext(UserInfoContext);
  // const [weekendsVisible, setWeekendsVisible] = useState(true);
  // const [events, setEvents] = useState([]);
  const [locale, setLocale] = useState(koLocale);
  const [selectDate, setSelectDate] = useState(new Date());
  const [state, setState] = useState({
    // weekendsVisible: true,
    currentEvents: []
  });
  const [data, setData] = useState(props.events || []); // 없어도 될 것 같기도

  const calendarApi = FullCalendar.prototype.getApi();

  // Modal State
  const [isModal, setIsModal] = useState({
    view: false,
    type: '',
    data: {}
  });

  // close modal
  const toggleModal = () => {
    setIsModal({ ...isModal,
      view: !isModal.view,
      type: '',
      data: {}
    });
  };

  const viewModal = async (type, data) => {
    setIsModal({
      view: true,
      type: type,
      data: data
    });
  };

  // calendar에 표기되는 event time format
  const eventTimeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  };

  // 사용자가 탐색할 수 있는 날짜와 이벤트가 진행되는 위치 제한
  // 오늘 날 기준으로 전/후 2년까지로 제한.
  const validRange = {
    start: moment().subtract(2, 'years').format('YYYY-MM-DD'),
    end: moment().add(2, 'years').format('YYYY-MM-DD'),
  };


  /*
[
      { id: 0, title: 'event 1', date: '2020-07-01' },
      { id: 12312, title: 'event 3', date: '2020-07-01' },
      { id: 2, title: 'event 2', date: '2020-07-14' },
      { id: 3, title: 'event 5', date: '2020-07-14T12:00:00' }
    ]
  */

  // const handleWeekendsToggle = () => {
  //   console.log(weekendsVisible);
  //   console.log(events);
  //   console.log(props.events);
  //   setWeekendsVisible(!weekendsVisible);
  //   // setState({
  //   //   ...state,
  //   //   weekendsVisible: !state.weekendsVisible
  //   // });
  // };

  // Date Click
  const handleDateSelect = (selectInfo) => {
    setSelectDate(moment(selectInfo.startStr));
    // viewModal('day', {});
    // let title = prompt('Please enter a new title for your event');
    // let calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  };

  // Event click
  const handleEventClick = (clickInfo) => {
    // 현재, 정상적으로 new Date를 날려도 내부적으로 +9 시간이 추가되어서 나오는 문제가 있어서,
    // modal로 날려주기 전에 -9을 하여 정상적인 시간을 강제적으로 만들 생각.
    let start = new Date(clickInfo.event._instance.range.start);
    let end = new Date(clickInfo.event._instance.range.end);
    // let calendarApi = clickInfo.view.calendar;

    console.log(calendarApi);

    console.log('clickinfo:::', clickInfo.view.calendar);

    viewModal('showEvent', {
      ...clickInfo.event.extendedProps,
      id: clickInfo.event._def.publicId,
      start: start.setHours(start.getHours() - 9),
      end: end.setHours(end.getHours() - 9),
      date: start.setHours(start.getHours() - 9)
    });

    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //  clickInfo.event.remove();
    // }

    console.log('range:::', clickInfo.event._instance.range);
    console.log('info:::', clickInfo.event._def);
    console.log('extendedProps:::', clickInfo.event.extendedProps);
  };

  // Event move
  const handleEventChange = (event) => {
    // console.log(event.event);
    // console.log(event.oldEvent);

    // 변경 전 기간
    // console.log(event.oldEvent._instance.range);
    // console.log('to');
    // 변경 후 기간
    // console.log(event.event._instance.range);

    // event.id와 같은 값
    // console.log(event.event._def.publicId);

    /**
     * 추후, 위 id값으로 event update 처리를 수행하면 될 듯.
     */
  };

  const handleEvents = (events) => {
    console.log('handleEvent:::', state.currentEvents);
    console.log('handleEvent after:::', events);
    // setState({
    //   currentEvents: events
    // });
    // setEvents(events);
    setState({
      currentEvents: events
    });
  };

  const renderSidebar = () => {
    return (
      <div className="app-sidebar">
        <div className="app-sidebar-section">
          
          <h2 className="h2_date">
            {moment(selectDate).format('YYYY년 MM월 DD일')}
            {
              userInfo.auth < 2
                && (
                  <div className="_rt">
                    <div className="_more">
                      <BorderButton
                        addClass="moreBtn"
                        onHandle={() => viewModal('addEvent')}
                        style={{ width: '100px' }}
                        name="일정 추가"
                      />
                    </div>
                  </div>
                )
            }
          </h2>
          <h2 className="h2_day">{moment(selectDate).format('dd요일')}</h2>
        </div>
        <div className="app-sidebar-section">
          <h2>
            오전
            (
            {state.currentEvents
              .filter(event => moment(new Date(event.start)).format('YYYY-MM-DD a') === moment(selectDate).format('YYYY-MM-DD 오전')).length}
            )
          </h2>
          <ul>
            {
              state.currentEvents
                .filter(event => moment(new Date(event.start)).format('YYYY-MM-DD a') === moment(selectDate).format('YYYY-MM-DD 오전'))
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .map(renderSidebarEvent)
            }
          </ul>
          <h2>
            오후
            (
            {state.currentEvents.filter((event) => {
              if (moment(new Date(event.start)).format('YYYY-MM-DD a') === moment(selectDate).format('YYYY-MM-DD 오후')) {
                console.log(event.start);
              }
              return moment(new Date(event.start)).format('YYYY-MM-DD a') === moment(selectDate).format('YYYY-MM-DD 오후');
              
            }).length}
            )
          </h2>
          <ul>
            {
              state.currentEvents
                .filter(event => moment(new Date(event.start)).format('YYYY-MM-DD a') === moment(selectDate).format('YYYY-MM-DD 오후'))
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .map(renderSidebarEvent)
            }
          </ul>
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   if (props.events?.length > 0) {
  //     let convertEvents = [];
  //     for (let i = 0; i < props.events.length; i++) {
  //       let item = {
  //         id: props.events[i].id,
  //         title: props.events[i].title,
  //         start: new Date(props.events[i].start_date).toISOString().replace(/T.*$/, ''),
  //         end: new Date(props.events[i].end_date).toISOString().replace(/T.*$/, ''),
  //       };
  //       convertEvents.push(item);
  //     }
  //     // setState({
  //     //   ...state,
  //     //   currentEvents: convertEvents
  //     // });
  //     setinitEvents(convertEvents);
  //   }
  //   // if (events.length === 0) setEvents(props.events);
  // }, [props.events]);

  return (
    <React.Fragment>
      <div className="mypage-body">
        <div className="body-wrapper box">
          <div className="body-info-container">
            {/* <label htmlFor="week_chkbox">
              <input
                type="checkbox"
                id="week_chkbox"
                checked={state.weekendsVisible}
                onChange={handleWeekendsToggle}
              />
              toggle weekends
            </label> */}
            
            {/* 시험용 기능 */}
            <label htmlFor="locale_chkbox">
              <input
                type="checkbox"
                id="locale_chkbox"
                checked={locale}
                onChange={() => {
                  if (locale) {
                    setLocale(undefined);
                  } else {
                    setLocale(koLocale);
                  }
                }}
              />
              한국어
            </label>
            <div className="calendar-wrapper">
              {console.log('cal_state::', state, props.events)}
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin, momentTimezonePlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView="dayGridMonth"
                editable
                selectable
                selectMirror
                dayMaxEvents
                timeZone="Asia/Seoul"
                locale={locale}
                validRange={validRange}
                // weekends={state.weekendsVisible}
                // initialEvents={props.events} // alternatively, use the `events` setting to fetch from a feed
                events={props.events}
                eventTimeFormat={eventTimeFormat}
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                // you can update a remote database when these fire:
                // eventAdd={function(){}}
                eventChange={handleEventChange}
                //   eventRemove={function(){}}
                //   dateClick={e => onClick(e)}
              />
            </div>
          </div>
        </div>
        {renderSidebar()}
      </div>
      <Modal
        set={isModal}
        hide={toggleModal}
        title={isModal.type === 'showEvent' ? '일정 상세' : '일정 등록'}
        style={{ width: '600px', height: 'fit-content' }}
        contents={props.eventClick}
        items={{ type: isModal.type, calendarApi: calendarApi }}
      />
    </React.Fragment>
  );
};

export default Calendar;
