import './LandingPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';

const { hello, addSomething } = require('@eos-toppings/api-mongodb-plugin');

class LandingPage extends Component {

  render() {
    return (
      <StandardTemplate>
        <div className="LandingPage">
            <div className="high-block">
              <div>
                Landing Page Content <br/><br/>
                Import from packages/api-mongodb-plugin: {addSomething(hello('test'))}<br/><br/>
                Counter: {this.props.count}<br/><br/>
                <button onClick={()=>{this.props.updateCounter(2)}}>Click here to increase counter by 2</button>
              </div>
              <div>Scroll down</div>
              <div>
                <Link to={'/some'}>Go to Some Page</Link>
              </div>
            </div>
        </div>
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ counter }) => ({
    count: counter.count,
  }),
  dispatch => ({
      updateCounter: (number) => dispatch(increaseCounter(number)),
  })
)(LandingPage);
