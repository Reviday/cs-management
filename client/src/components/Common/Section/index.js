import React, { useContext } from 'react';
import './Section.css';
import { NavLink } from 'react-router-dom';

function Section(props) {
  return (
    <div className="_sec">
      {props.sectionList.map((item) => {
        return (
          <NavLink to={item.url} key={item.name}>
            <div className="_sec_item">
              {item.name}
            </div>
          </NavLink>
        );
      })
        }
    </div>
  );
}
  
  
export default Section;
