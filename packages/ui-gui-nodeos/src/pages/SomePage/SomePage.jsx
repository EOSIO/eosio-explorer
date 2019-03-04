import './SomePage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';


class SomePage extends Component {

  render() {
    return (
      <StandardTemplate>
        <div className="SomePage">
          <div className="high-block">
            <div>
              Some Page<br/><br/>
              Counter: {this.props.count}<br/><br/>
              <button onClick={()=>{this.props.updateCounter(3)}}>Click here to increase counter by 3</button>
            </div>
            <div>Scroll down</div>
            <div>
              <Link to={'/404'}>Go to 404 Page</Link>
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
)(SomePage);
