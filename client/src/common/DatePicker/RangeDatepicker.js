import React, { useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

import Alert from 'common/Modal/ModalAlert';

import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

registerLocale('ko', ko);
setDefaultLocale('ko');

/** **************************************************************************
The MIT License (MIT)

Copyright (c) 2018 HackerOne Inc and individual contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*************************************************************************** */

const RangeDatepicker = (props) => {
  
  const startTitle = props.startTitle; // start_date 부분 상단 제목
  const endTitle = props.endTitle; // end_date 부분 상단 제목
  const isClearable = props.isClearable; // clear 기능 사용 여부
  const disabled = props.disabled; // disabled 설정

  // 기본 Date Format은 new Date()를 사용하여
  // 출력된 형식을 사용하는 듯 하니 주의.
  const [startDate, setStartDate] = props.startState;
  const [endDate, setEndDate] = props.endState;

  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: '',
      type: ''
    });
  };

  const CustomTimeInput = ({ value, onChange }) => (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ border: 'solid 1px pink' }}
    />
  );

  return (
    <React.Fragment>
      <div className="range_picker_wrapper">
        <div className="start_date">
          <div className="picker_title">
            {startTitle}
          </div>
          <DatePicker
            locale="ko"
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat={props.useTime || props.onlyTime ? props.onlyTime ? 'h:mm aa' : 'MMMM d, yyyy h:mm aa' : 'yyyy년 MM월 dd일'}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeInput={props.useTime}
            // customTimeInput={<CustomTimeInput />}
            showYearDropdown
            showTimeSelect={props.useTime || props.onlyTime}
            showTimeSelectOnly={props.onlyTime}
            timeIntervals={15}
            timeCaption="Time"
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            isClearable={isClearable}
            disabled={disabled}
            readOnly={disabled}
          />
        </div>
        <div className="end_date">
          <div className="picker_title">
            {endTitle}
          </div>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              // startDate가 설정되어 있지 않을 경우.
              if (startDate === null) {
                setAlertModal({
                  show: true,
                  title: '안내 메시지',
                  content: `시작 ${props.onlyTime ? '시간을' : '날짜를'} 먼저 선택하시기 바랍니다.`,
                  type: 'common'
                });
                return false;
              
              // startDate가 endDate보다 크거나 같을 경우
              } if (startDate >= date) {
                setAlertModal({
                  show: true,
                  title: '안내 메시지',
                  content: `시작 ${props.onlyTime ? '시간이' : '날짜가'} 종료 ${props.onlyTime ? '시간' : '날짜'}보다 빨라야 합니다.`,
                  type: 'common'
                });
                return false;
              }

              setEndDate(date);
            }}
            dateFormat={props.useTime || props.onlyTime ? props.onlyTime ? 'h:mm aa' : 'MMMM d, yyyy h:mm aa' : 'yyyy년 MM월 dd일'}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            showTimeInput={props.useTime}
            // customTimeInput={<CustomTimeInput />}
            showYearDropdown
            showTimeSelect={props.useTime || props.onlyTime}
            showTimeSelectOnly={props.onlyTime}
            timeIntervals={15}
            timeCaption="Time"
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            isClearable={isClearable}
            disabled={disabled}
            readOnly={disabled}
          />
        </div>
      </div>
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        hide={toggleAlert}
        type={alertModal.type}
      />
    </React.Fragment>
  );
};

export default RangeDatepicker;
