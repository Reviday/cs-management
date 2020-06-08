import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CollapseContext } from 'contexts/CollapseContext';
import './Left.scss';

const navList = [
  { name: 'dashboard', explain: 'DASHBOARD', url: '/dashboard' },
  { name: 'order-release', explain: '입/출고 조회', url: '/order' },
  { name: 'customer-info', explain: '고객정보 조회', url: '/customer' }
];

const CollapseButton = ({ active, onClick }) => {
  return (
    <div className={`colItem ${active ? 'active' : ''}`} onClick={onClick}>
      {active ? '접기' : '열기'}
    </div>
  );
};

const Navigate = () => {

  const [isCollapse, setCollapse] = useContext(CollapseContext);

  const onHandle = () => {
    if (isCollapse) setCollapse(false);
    else setCollapse(true);
  };
  // page[item.explain]

  return (
    <React.Fragment>
      {
        navList.map((item) => {
          return (
            <NavLink className="Link" to={`${item.url}`} key={item.name}>
              <ul className="navi" title={`${isCollapse ? '' : item.explain}`}>
                <li className={`icn ${item.name} left_menu`} />
                {isCollapse ? <li className="text">{item.explain}</li> : ''}
              </ul>
            </NavLink>
          );
        })
      }
      <CollapseButton active={isCollapse === true} onClick={() => onHandle()} />
    </React.Fragment>
  );
};

export default Navigate;
