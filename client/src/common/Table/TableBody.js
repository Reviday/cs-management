import React from 'react';

function TableBody(props) {
  const headerSet = props.headerSet;
  const data = props.data;
  const viewModal = props.viewModal;
  const tableStyle = props.tableStyle;
  const CustomRecord = props.CustomRecord;

  let count = 0;

  return (
    <div className="_body" style={tableStyle}>
      {data.length === 0
        ? (
          <div className="noItem">
            설정 목록이 없습니다.
          </div>
        )
        : data.map((record) => {
          return (
            <CustomRecord key={count} id={count++} headerSet={headerSet} record={record} viewModal={viewModal} />
          );
        })
      }
    </div>
  );
}

export default TableBody;
