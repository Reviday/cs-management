import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Left.scss';

// Context
import { CollapseContext } from 'contexts/CollapseContext';
import { UserInfoContext } from 'contexts/UserInfoContext';

// auth 값에 따라 그 '이상의 권한'을 가지고 있을 때만 보여지게 함
// 0 > 1 > 2 순으로 권한 등급을 갖는다.
const navList = [
  { name: 'dashboard', explain: 'DASHBOARD', url: '/dashboard', auth: 2 },
  { name: 'order-release', explain: '입/출고 조회', url: '/order', auth: 2 },
  { name: 'customer-info', explain: '고객정보 조회', url: '/customer', auth: 1 }
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
  const [userInfo] = useContext(UserInfoContext);

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
              {
                userInfo?.auth <= item.auth
                  && (
                    <ul className="navi" title={`${isCollapse ? '' : item.explain}`}>
                      <li className={`icn ${item.name} left_menu`} />
                      {isCollapse ? <li className="text">{item.explain}</li> : ''}
                    </ul>
                  )
              }
            </NavLink>
          );
        })
      }
      <CollapseButton active={isCollapse === true} onClick={() => onHandle()} />
    </React.Fragment>
  );
};

export default Navigate;
