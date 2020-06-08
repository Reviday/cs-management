import React, { useContext } from 'react';
import { withRouter, Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { CollapseContext } from 'contexts/CollapseContext';
import Left from 'components/Left';
import DashBoard from 'components/Contents/DashBoard';
import CustomerInfo from 'components/Contents/CustomerInfo';
import OrderRelease from 'components/Contents/OrderRelease';
import NotFound from 'components/Common/NotFound';
import './Content.scss';

const Content = () => {
  const [isCollapse] = useContext(CollapseContext);

  return (
    <div className="v_content">
      <Router>
        <div className="vc_middle">
          <Left />
          <div className={`vc_content ${isCollapse ? 'collpase' : ''}`}>
            <Switch>
              <Route exact path="/" component={DashBoard} />

              <Route exact path="/dashboard" component={DashBoard} />
              <Route exact path="/customer" component={CustomerInfo} />
              <Route exact path="/order" component={OrderRelease} />

              <Route path="/NotFound" component={NotFound} />
              <Redirect from="*" exact to="/NotFound" />
            </Switch>
          </div>
        </div>
      </Router>

    </div>
  );
};

export default withRouter(Content);
