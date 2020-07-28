import React from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

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

const Datepicker = (props) => {
  
  const title = props.title; // 상단 제목
  const isClearable = props.isClearable; // clear 기능 사용 여부
  const disabled = props.disabled; // disabled 설정

  // 기본 Date Format은 new Date()를 사용하여
  // 출력된 형식을 사용하는 듯 하니 주의.
  const [date, setDate] = props.state;

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
        <div className="select_date">
          <div className="picker_title">
            {title}
          </div>
          <DatePicker
            locale="ko"
            selected={date}
            onChange={date => setDate(date)}
            dateFormat={props.useTime || props.onlyTime ? props.onlyTime ? 'h:mm aa' : 'MMMM d, yyyy h:mm aa' : 'yyyy년 MM월 dd일'}
            selectsStart
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
          />
        </div>
      </div>
      
    </React.Fragment>
  );
};

export default Datepicker;
