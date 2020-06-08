import React, { useContext, useEffect } from 'react';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import sha512 from 'crypto-js/sha512';
import Header from 'components/Header';
import Login from 'components/Login';
import Content from 'components/Contents';
import NotFound from 'components/Common/NotFound';
import 'resources/styles/common.scss';
import 'resources/ref/ionicons.css';
import { UserInfoContext } from 'contexts/UserInfoContext';

const Contents = (props) => {
  return (
    <React.Fragment>
      <Header
        {...props}
      />
      <Content />
    </React.Fragment>
  );
};


const App = (props) => {
  const [userInfo, setUserInfo] = useContext(UserInfoContext);
  const isAuthenticated = userInfo.isLogged;

  const initalization = () => {
    if (!window.sessionStorage.getItem(sha512('id'))) {
      props.history.push('/login');
      return false;
    }

    setUserInfo({
      isLogged: true,
      userId: window.sessionStorage.getItem(sha512('id')),
      userName: window.sessionStorage.getItem(sha512('name'))
    });
  };
  
  useEffect(() => {
    if (!isAuthenticated) initalization();
  }, [userInfo]);

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Redirect to={{ pathname: '/dashboard' }} />
        </Route>
        <Route exact path="/login" render={(routerProps) => { return (<Login {...routerProps} />); }} />
        <Route path="/:left" render={(routerProps) => { return (<Contents {...routerProps} />); }} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
