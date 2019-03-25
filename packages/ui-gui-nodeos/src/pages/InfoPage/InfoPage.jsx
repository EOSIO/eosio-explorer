import './InfoPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, InputGroup, InputGroupAddon, Form, FormGroup, Input, Label } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import Headblock from './components/Headblock';
import apiRpc from '@eos-toppings/api-rpc';
import axios from 'axios';
import BlockchainInfo from './components/BlockchainInfo';

class InfoPage extends Component {

  constructor(){
    super()
    this.state = { text: `default`, blockchainInfo: `default`}
  }

  componentDidMount(){
    axios
      .get(`/api/mongodb/get_accounts`)
      .then(({data})=>{
        this.setState({text: JSON.stringify(data)})
      })
    // let query = {"endpoint": "http://localhost:8888", "privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"};  
    // apiRpc
    //   .get_info(query) 
    //   .then((data) => {
    //     this.setState({
    //       blockchainInfo: JSON.stringify(data)
    //     });
    //   })
  }

  render() {

    let { text, blockchainInfo } = this.state;
    return (
      <StandardTemplate>
        <div className="InfoPage animated fadeIn">
          <Row>
            <Col xs="12">
              <h2 className="pageTitle text-center mb-4">Info Page</h2>
            </Col>
          </Row>

          <Row>
            <Col xs="6">
              <Card>
                <CardHeader>
                  Nodeos
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row className="mb-0">
                      <Col xs="4">
                        <Label htmlFor="nodeosEndPoint">Connected Nodeos</Label>
                      </Col>
                      <Col xs="8">
                        <InputGroup>
                          <Input type="email" id="nodeosEndPoint" name="nodeosEndPoint" placeholder="Enter Endpoint..." />
                          <InputGroupAddon addonType="append">
                            <Button type="button" color="primary">Connect</Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6">
              <Card>
                <CardHeader>
                  Mongodb
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row className="mb-0">
                      <Col xs="4">
                        <Label htmlFor="mongodbEndPoint">Connected Mongodb</Label>
                      </Col>
                      <Col xs="8">
                        <InputGroup>
                          <Input type="email" id="mongodbEndPoint" name="mongodbEndPoint" placeholder="Enter Endpoint..." />
                          <InputGroupAddon addonType="append">
                            <Button type="button" color="primary">Connect</Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Blockchain Information
                </CardHeader>
                <CardBody>
                  <BlockchainInfo />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Head Block Information
                </CardHeader>
                <CardBody>
                  <Headblock/>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Last Irreversible Block Information
                </CardHeader>
                <CardBody>
                  <Form className="form-horizontal">
                    <FormGroup row className="mb-0">
                      <Col xs="2">
                        <Label><strong>Block Number</strong></Label>
                      </Col>
                      <Col xs="10">
                        <p className="form-control-static">42671296</p>
                      </Col>
                    </FormGroup>
                    <FormGroup row className="mb-0">
                      <Col xs="2">
                        <Label><strong>Block ID</strong></Label>
                      </Col>
                      <Col xs="10">
                        <p className="form-control-static">0000d86d5dba32b2ead57692f03fce45403331340451e296dae7295c180c3064</p>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Landing Page Content
                </CardHeader>
                <CardBody>
                  <p><strong>Calls from mongodb:</strong> {text}</p>
                  <p><strong>Blockchain info from RPC API: </strong> {blockchainInfo}</p>
                  <p><strong>Counter:</strong> {this.props.count}</p>
                  <Col col="4" sm="8" md="4" className="mb-3 text-center">
                    <Button block color="primary" onClick={()=>{this.props.updateCounter(2)}}>Click here to increase counter by 2</Button>
                  </Col>
                  <Headblock/>
                  <p>Scroll down</p>
                </CardBody>
              </Card>
            </Col>
          </Row>

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
