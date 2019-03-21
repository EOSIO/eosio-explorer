import './InfoPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import Headblock from './components/Headblock';
import apiRpc from '@eos-toppings/api-rpc';
import axios from 'axios';
import DragDropCodeViewer from '../../components/DragDropCodeViewer/DragDropCodeViewer';

class InfoPage extends Component {

  constructor(){
    super()
    this.state = { text: `default`, info: `default`}
  }

  componentDidMount(){
    axios
      .get(`/api/mongodb/get_accounts`)
      .then(({data})=>{
        this.setState({
          text: JSON.stringify(data), 
          jsonData: ""
        });
      })
    let query = {"endpoint": "http://localhost:8888", "privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"};  
    apiRpc
      .get_info(query) 
      .then((data) => {
        this.setState({info: JSON.stringify(data)});        
      })
  }
  
  onDrop(fileContents) {
    this.setState({
      text: this.state.text,
      jsonData: fileContents
    });
  }

  onChange(newValue) {
    this.setState({
      text: this.state.text,
      jsonData: newValue
    });
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

                <Row className="mb-3">
                  <Col col="3" sm="3">
                    <h2>D&amp;D</h2>
                  </Col>
                  <Col col="9" sm="9">
                    <Row>
                      <Col col="12" sm="12" xs="12">
                        <h2>Monaco Editor</h2>

                        <DragDropCodeViewer height="300px" readOnly={false}
                                            value={this.state.jsonData} 
                                            onChange={this.onChange.bind(this)}
                                            onDrop={this.onDrop.bind(this)} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                

                <p>Json String: {this.state.jsonData}</p>
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
