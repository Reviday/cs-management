import React, { useState, createContext } from 'react';
const UserInfoContext = createContext();
const UserInfoProvider = (props) => {

  const [userInfo, setUserInfo] = useState({
    isLogged: false,
    userId: '',
    userName: '',
    auth: 1 // 0 : 관리자, 1 : 매니저
  });

  return (
    <UserInfoContext.Provider value={[userInfo, setUserInfo]}>
      {props.children}
    </UserInfoContext.Provider>
  );
};

export { UserInfoProvider, UserInfoContext };
