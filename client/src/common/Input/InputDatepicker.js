import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './Input.css';

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

const InputDatepicker = (props) => {
  
  const startTitle = props.startTitle; // start_date 부분 상단 제목
  const endTitle = props.endTitle; // end_date 부분 상단 제목
  const isClearable = props.isClearable; // clear 기능 사용 여부
  const disabled = props.disabled; // disabled 설정

  // 기본 Date Format은 new Date()를 사용하여
  // 출력된 형식을 사용하는 듯 하니 주의.
  const [startDate, setStartDate] = props.startState;
  const [endDate, setEndDate] = props.endState;

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
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat={props.useTime ? 'MMMM d, yyyy h:mm aa' : 'yyyy/MM/dd'}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeInput={props.useTime}
            // customTimeInput={<CustomTimeInput />}
            showYearDropdown
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            isClearable={isClearable}
            disabled={disabled}
          />
        </div>
        <div className="end_date">
          <div className="picker_title">
            {endTitle}
          </div>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat={props.useTime ? 'MMMM d, yyyy h:mm aa' : 'yyyy/MM/dd'}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            showTimeInput={props.useTime}
            // customTimeInput={<CustomTimeInput />}
            showYearDropdown
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            isClearable={isClearable}
            disabled={disabled}
          />
        </div>
      </div>
      
    </React.Fragment>
  );
};

export default InputDatepicker;
