import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import axios from 'axios';
import Nodeswitch from './components/Nodeswitch';
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
            <Col xs="12">
              <Card>
                <CardHeader>
                  Node Information
                </CardHeader>
                <CardBody>
                  <Nodeswitch/>
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
