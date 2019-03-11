import './reset.scss';
import './site.scss';
import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { InfoPage, SomePage, NotFoundPage } from 'pages';
import { WillRoute } from 'hocs';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <WillRoute exact path="/" component={ InfoPage }/>
          <WillRoute exact path="/some" component={ SomePage }/>
          <WillRoute exact path="/404" component={ NotFoundPage }/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    );
  }
}

export default App;
