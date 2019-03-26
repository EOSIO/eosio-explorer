import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Nodeswitch from './components/Nodeswitch';
import Headblock from './components/Headblock';
import BlockchainInfo from './components/BlockchainInfo';
import LastIrreversibleBlockInfo from './components/LastIrreversibleBlockInfo';

class InfoPage extends Component {

  render() {

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
        </div>
      </StandardTemplate>
    );
  }
}

export default InfoPage;
