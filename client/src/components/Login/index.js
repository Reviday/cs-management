import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import sha512 from 'crypto-js/sha512';
// import logo from 'resources/images/ibricks_img.png';
import config from 'config';
import './Login.css';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';

const Login = () => {
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');

  const doLogin = () => {
    try {
      // Axios({
    //   url: 'http://localhost:3001/login',
    //   method: 'post',
    //   data: {
    //     userId: inputId,
    //     password: inputPw
    //   }
    // }).then((response) => {
    //   let result = JSON.parse(response.request.response).result;
    //   console.log('result : ', result);
    //   console.log('result.userId : ', result.userId);
    //   setUserInfo({
    //     userId: result.userId,
    //     userName: result.userName
    //   });
    // });
      setUserInfo({
        isLogged: true,
        userId: inputId,
        userName: inputId
      });

      // if (response.result === 'ok') {
      //   setHasCookie(true);
      // } else {
      //   throw new Error(response.error);
      // }
      window.sessionStorage.setItem(sha512('id'), inputId);
      window.sessionStorage.setItem(sha512('name'), inputId);

    } catch (err) {
      alert('로그인에 실패했습니다.' + err);
      setInputId('');
      setInputPw('');
      console.error('login error', err);
    }
    
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      doLogin();
    }
  };

  // useEffect(() => {
  //   if (!isAuthenticated) initalization();
  // }, [userInfo]);

  return (
    <>
      {userInfo.isLogged && <Redirect to="/dashboard" />}
      <div className="v_container">
        <div className="center_layout">
          <div className="login_box">
            <div className="top">
              {/* <img className="main_logo" src={logo} alt="i-bricks" /> */}
              <ul className="_ul">
                <li className="tit main_logo_tit">
                  {/* title */}
                </li>
              </ul>
              <ul className="_ul">
                <li className="ver">Prototype</li>
              </ul>
              <div
                style={{
                  border: '0px solid #ddd',
                  width: '120px',
                  height: '120px',
                  float: 'left'
                }}
              />
            </div>
            <div className="cont">
              <ul className="_ul">
                <li className="_li inp">
                  <input
                    type="text"
                    className="user_id"
                    placeholder="INSERT ID"
                    value={inputId}
                    onChange={e => setInputId(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span className="ion-ios-contact-outline" />
                </li>
              </ul>
              <ul className="_ul mt10">
                <li className="_li inp">
                  <input
                    type="password"
                    className="user_passwd"
                    placeholder="INSERT PASSWORD"
                    value={inputPw}
                    onChange={e => setInputPw(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span className="ion-android-lock" />
                </li>
              </ul>
            </div>
            <div className="bot">
              <ul className="_ul mt10">
                <li className="_li log_btn" onClick={doLogin}>LOGIN</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
