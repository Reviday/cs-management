import React from 'react';

function TableHeader(props) {
  const headerSet = props.headerSet;

  return (
    <React.Fragment>
      <ul className="_header">
        {headerSet.map((item) => {
          let headerStyle = item.style || {};

          return (
            <li key={item.field.replace(' ', '_')} className={item.field.replace(' ', '_')} style={headerStyle}>
              {item.field}
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
}

export default TableHeader;
