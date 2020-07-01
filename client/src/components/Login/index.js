import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import crypto from 'crypto';
import sha512 from 'crypto-js/sha512';

// import logo from 'resources/images/ibricks_img.png';
import Config from 'config';
import './Login.css';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';

const Login = () => {
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');

  const doLogin = async () => {
    // 비밀번호 암호화
    const cipher = crypto.createCipher('aes-256-cbc', 'tailer');
    let cryptoPassword = cipher.update(inputPw, 'utf8', 'base64');
    cryptoPassword += cipher.final('base64');

    let options = {
      url: `http://${Config.API_HOST.IP}:${Config.API_HOST.PORT}/api/account/login`,
      method: 'post',
      data: {
        id: inputId,
        password: cryptoPassword
      }
    };

    try {
      let setData = await axios(options);
      console.log('Login result :::', setData);

      let result = setData.data.data;

      setUserInfo({
        isLogged: true,
        userId: result.id,
        userName: result.name,
        site: result.site,
        auth: result.auth
      });

      // if (response.result === 'ok') {
      //   setHasCookie(true);
      // } else {
      //   throw new Error(response.error);
      // }

      window.sessionStorage.setItem(sha512('id'), result.id);
      window.sessionStorage.setItem(sha512('name'), result.name);

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
