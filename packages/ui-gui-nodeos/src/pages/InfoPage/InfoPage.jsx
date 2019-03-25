import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, InputGroup, InputGroupAddon, Form, FormGroup, Input, Label } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import axios from 'axios';
import Headblock from './components/Headblock';
import BlockchainInfo from './components/BlockchainInfo';
import LastIrreversibleBlockInfo from './components/LastIrreversibleBlockInfo';

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
                  <LastIrreversibleBlockInfo />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* <Row>
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
                </CardBody>
              </Card>
            </Col>
          </Row> */}

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
