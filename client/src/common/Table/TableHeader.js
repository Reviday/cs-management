import React from 'react';

const TableHeader = (props) => {
  const headerSet = props.headerSet;

  return (
    <React.Fragment>
      <thead className="_thead">
        <tr>
          {headerSet.map((item) => {
            let headerStyle = item.style || {};

            return (
              <th key={item.field.replace(' ', '_')} className={item.field.replace(' ', '_')} style={headerStyle}>
                {item.text}
              </th>
            );
          })}
        </tr>
      </thead>
    </React.Fragment>
  );
};

export default TableHeader;
