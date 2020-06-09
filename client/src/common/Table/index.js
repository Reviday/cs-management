import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import './Table.css';

const Table = (props) => {
  const headerSet = props.headerSet;
  const data = props.data;
  const tableStyle = props.tableStyle || {};
  const recordLimit = props.recordLimit || 'none';

  return (
    <React.Fragment>
      <table className="_table" style={tableStyle}>
        <TableHeader headerSet={headerSet} />
        <TableBody
          headerSet={headerSet}
          data={data}
          tableStyle={tableStyle}
          recordLimit={recordLimit}
        />
      </table>
    </React.Fragment>
  );
};

export default Table;
