import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import './Table.css';

const Table = (props) => {
  const headerSet = props.headerSet; // Header Columns Set
  const data = props.data; // Table body data
  const onClick = props.onClick; // Table Row onClick Event Function
  const tableStyle = props.tableStyle || {};
  const recordLimit = props.recordLimit || 'none'; // 테이블에 출력되는 Row의 최대값.

  return (
    <React.Fragment>
      <table className="_table" style={tableStyle}>
        <TableHeader headerSet={headerSet} />
        <TableBody
          headerSet={headerSet}
          data={data}
          onClick={onClick}
          tableStyle={tableStyle}
          recordLimit={recordLimit}
        />
      </table>
    </React.Fragment>
  );
};

export default Table;
