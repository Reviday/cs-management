import React from 'react';
import Record from './TableRecord';

const TableBody = (props) => {
  const headerSet = props.headerSet;
  const data = props.data;
  const tableStyle = props.tableStyle;
  const recordLimit = props.recordLimit;

  let count = 0;

  return (
    <React.Fragment>
      <tbody className="_tbody">
        {data.length === 0
          ? (
            <tr>결과 목록이 없습니다.</tr>
          )
          : data.map((record) => {
            if (recordLimit !== 'none' && count >= recordLimit) {
              return;
            }
            
            return (
              <Record key={count} id={count++} headerSet={headerSet} record={record} />
            );
          })
        }
      </tbody>
    </React.Fragment>
  );
};

export default TableBody;
