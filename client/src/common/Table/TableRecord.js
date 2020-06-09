import React, { useState } from 'react';

const TableRecord = (props) => {
  const [record, setRecord] = useState(props.record);
  const headerSet = props.headerSet;
      
  return (
    <React.Fragment>
      <tr>
        {
        headerSet.map((item) => {
          let headerStyle = item.style || {};
          let field = item.field.replace(' ', '_');

          return (
            <td key={field} className={field} style={headerStyle}>
              {record[field]}
            </td>
          );
        })
      }
      </tr>
    </React.Fragment>
  );
};

export default TableRecord;
