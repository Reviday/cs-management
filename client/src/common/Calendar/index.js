import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import koLocale from '@fullcalendar/core/locales/ko';

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

const renderSidebarEvent = (event) => {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  );
};

const renderEventContent = (eventInfo) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const createEventId = () => {
  return String(eventGuid++);
};

const convertEvents = (data) => {
//   let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  return {
    id: createEventId(),
    title: data.title,
    start: new Date(data.date).toISOString().replace(/T.*$/, '')
  };
};

const Calendar = (props) => {

  // const [weekendsVisible, setWeekendsVisible] = useState(true);
  // const [events, setEvents] = useState([]);
  const calendarRef = useRef();
  const [state, setState] = useState({
    // weekendsVisible: true,
    currentEvents: []
  });
  const [data, setData] = useState(props.events || []);

  const eventTimeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
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
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  };

  // Event click
  const handleEventClick = (clickInfo) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //  clickInfo.event.remove();
    // }

    console.log('range:::', clickInfo.event._instance.range);
    console.log('info:::', clickInfo.event._def);
  };

  // Event move
  const handleEventChange = (event) => {
    // console.log(event.event);
    // console.log(event.oldEvent);

    // 변경 전 기간
    console.log(event.oldEvent._instance.range);
    console.log('to');
    // 변경 후 기간
    console.log(event.event._instance.range);

    // event.id와 같은 값
    console.log(event.event._def.publicId);

    /**
     * 추후, 위 id값으로 event update 처리를 수행하면 될 듯.
     */
  };

  const handleEvents = (events) => {
    console.log(state);
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
          <h2 className="h2_date">{moment(new Date()).format('YYYY년 MM월 DD일')}</h2>
          <h2 className="h2_day">{moment(new Date()).format('dd요일')}</h2>
        </div>
        <div className="app-sidebar-section">
          <h2>
            할 일 (To-Do)
            (
            {state.currentEvents.length}
            )
          </h2>
          <ul>
            {
              state.currentEvents.map(renderSidebarEvent)
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
          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]}
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
              locale={koLocale}
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
  );
};

export default Calendar;
