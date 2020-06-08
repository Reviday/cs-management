import React from 'react';
import './Table.css';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = (props) => {
  const headerSet = props.headerSet;
  const data = props.data;
  const viewModal = props.viewModal || '';
  const tableStyle = props.tableStyle || {};
  // 사용자 정의 컬럼, 사용될 테이블의 양식이나 사용법에 맞춰서 커스텀 한다. (기본 양식은 없음)
  const CustomRecord = props.CustomRecord;
  /*
    기본적인 default style이 있고, 어느 정도 style 부여가 가능하게 했지만
    불편하다 싶으면 css로 직접 다룰 수 있게끔 field 명을 class로 부여해 놓았다.
    field명을 그대로 사용하되, 공백은 '_'로 치환되게 하였다.
  */
  
  return (
    <React.Fragment>
      <div className="_table" style={tableStyle}>
        <TableHeader headerSet={headerSet} />
        <TableBody
          headerSet={headerSet}
          data={data}
          viewModal={viewModal}
          tableStyle={tableStyle}
          CustomRecord={CustomRecord}
        />
      </div>
    </React.Fragment>
  );
};
  
export default Table;
