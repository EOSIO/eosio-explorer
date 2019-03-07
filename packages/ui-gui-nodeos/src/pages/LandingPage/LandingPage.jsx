import './LandingPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';

import axios from 'axios';

class LandingPage extends Component {

  constructor(){
    super()
    this.state = { text: `default`}
  }

  componentDidMount(){
    axios
      .get(`/api/getAccounts`)
      .then(({data})=>{
        this.setState({text: JSON.stringify(data)})
      })
  }

  render() {

    let { text } = this.state;
    return (
      <StandardTemplate>
        <div className="LandingPage">
            <div className="high-block">
              <div>
                Landing Page Content <br/><br/>
                Calls from mongodb: {text}<br/><br/>
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
