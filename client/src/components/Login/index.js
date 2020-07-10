import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import crypto from 'crypto';
import sha512 from 'crypto-js/sha512';

// import logo from 'resources/images/ibricks_img.png';
import Alert from 'common/Modal/ModalAlert';
import Config from 'config';
import './Login.css';

// context
import { UserInfoContext } from 'contexts/UserInfoContext';

const Login = () => {
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');

  // alertModal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    content: '',
    type: ''
  });

  const toggleAlert = () => {
    setAlertModal({
      show: false,
      title: '',
      content: '',
      type: ''
    });
  };

  const checkValidate = () => {
    let validation = true;
    let message = '';

    /**
     * check validate
     */

    // 1. 빈 값 체크
    if (validation) {
      if (!inputId || inputId === '') {
        validation = false;
        message = '아이디를 입력하시기 바랍니다.';
      } else if (!inputPw || inputPw === '') {
        validation = false;
        message = '패스워드를 입력하시기 바랍니다.';
      }
    }

    // validation에서 체크되지 않은 항목이 존재하면 alert창 출력
    if (!validation) {
      setAlertModal({
        show: true,
        title: '안내 메시지',
        content: message,
        type: 'common'
      });
    }

    return validation;
  };

  const doLogin = async () => {
    if (!checkValidate()) return false;
    
    // 비밀번호 암호화
    const cipher = crypto.createCipher('aes-256-cbc', 'tailer');
    let cryptoPassword = cipher.update(inputPw, 'utf8', 'base64');
    cryptoPassword += cipher.final('base64');

    let options = {
      url: `http://${Config.API_HOST.IP}/api/account/login`,
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

      console.log(result);

      if (result && typeof result === 'object') {
        setUserInfo({
          isLogged: true,
          userId: result.id,
          userName: result.name,
          site: result.site,
          auth: result.auth
        });
  
        window.sessionStorage.setItem(sha512('id'), result.id);
        window.sessionStorage.setItem(sha512('name'), result.name);
        window.sessionStorage.setItem(sha512('site'), result.site);
        window.sessionStorage.setItem(sha512('auth'), result.auth);

      } else if (result === false) {
        setAlertModal({
          show: true,
          title: '안내 메시지',
          content: '등록되지 않은 아이디거나, 잘못된 비밀번호입니다.',
          type: 'common'
        });
      }

    } catch (err) {
      setAlertModal({
        show: true,
        title: '에러 메시지',
        content: err,
        type: 'common'
      });
      setInputId('');
      setInputPw('');
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
      <Alert
        view={alertModal.show}
        title={alertModal.title}
        content={alertModal.content}
        type={alertModal.type}
        hide={toggleAlert}
      />
    </>
  );
};

export default Login;
