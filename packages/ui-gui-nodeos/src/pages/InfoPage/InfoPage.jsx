import './InfoPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import Headblock from './components/Headblock';
import apiRpc from '@eos-toppings/api-rpc';
import axios from 'axios';

class InfoPage extends Component {

  constructor(){
    super()
    this.state = { text: `default`, info: `default`}
  }

  componentDidMount(){
    axios
      .get(`/api/mongodb/get_accounts`)
      .then(({data})=>{
        this.setState({text: JSON.stringify(data)})
      })
    let query = {"endpoint": "http://localhost:8888", "privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"};  
    apiRpc
      .get_info(query) 
      .then((data) => {
        this.setState({info: JSON.stringify(data)});        
      })
  }

  render() {

    let { text, info } = this.state;
    return (
      <StandardTemplate>
        <div className="InfoPage animated fadeIn">
            <Card>
              <CardHeader>
                Landing Page Content
              </CardHeader>
              <CardBody>
                <p><strong>Calls from mongodb:</strong> {text}</p>
                <p><strong>Blockchain info from RPC API: </strong> {info}</p>
                <p><strong>Counter:</strong> {this.props.count}</p>
                <Col col="4" sm="8" md="4" className="mb-3 text-center">
                  <Button block color="primary" onClick={()=>{this.props.updateCounter(2)}}>Click here to increase counter by 2</Button>
                </Col>
                <Headblock/>
                <p>Scroll down</p>
                <p>
                  <Link to={'/some'}>Go to Some Page</Link>
                </p>
              </CardBody>
            </Card>
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
)(InfoPage);