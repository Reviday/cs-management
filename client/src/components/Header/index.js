import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import sha512 from 'crypto-js/sha512';
import './Header.scss';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';
// import icon from '../../config/navicon_config';
// import Svg from './Svg';

function Header() {
  const [isShown, setIsShown] = useState(false);
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  const doLogout = () => {
    // 추후, alert 창 디자인해서 추가할 예정.
    alert('로그아웃 되었습니다.');
    // if(confirm("로그아웃 하시겠습니까?")) {
    setUserInfo({
      isLogged: false,
      userId: '',
      userName: ''
    });

    window.sessionStorage.removeItem(sha512('id'));
    window.sessionStorage.removeItem(sha512('name'));
    // }
  };

  return (
    <header>
      <div className="v-top">
        <div className="t_left">
          <Link to="/">
            <div className="logo" />
            <div className="title">untitled</div>
          </Link>
        </div>
        
        <div className="t_right">
          <div className="search_field">
            <input type="text" className="search" placeholder="Search" />
            <button type="button" className="search_btn" />
          </div>
          <div
            className="pointer profile"
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
          >
            <div className="pro_icon ion-ios-contact">
              {/* <Svg viewBox={icon.user.viewBox} d={icon.user.d} /> */}
            </div>
            <div className="pro_id">{userInfo.userName}</div>
            {isShown && (
              <div className="pro_view pointer">
                <div className="">사용자 설정</div>
                <div className="logoutBtn" onClick={doLogout}>로그아웃</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
