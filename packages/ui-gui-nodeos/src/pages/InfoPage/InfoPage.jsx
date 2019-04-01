import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Nodeswitch from './components/Nodeswitch';
import Headblock from './components/Headblock';
import BlockchainInfo from './components/BlockchainInfo';
import LastIrreversibleBlockInfo from './components/LastIrreversibleBlockInfo';
import { CardStyled, CardHeaderStyled } from 'styled';
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
              <CardStyled>
                <CardHeaderStyled>
                  Connections
                </CardHeaderStyled>
                <CardBody>
                  <Nodeswitch/>
                </CardBody>
              </CardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  Blockchain Information
                </CardHeaderStyled>
                <CardBody>
                  <BlockchainInfo />
                </CardBody>
              </CardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  Head Block Information
                </CardHeaderStyled>
                <CardBody>
                  <Headblock/>
                </CardBody>
              </CardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  Last Irreversible Block Information
                </CardHeaderStyled>
                <CardBody>
                  <LastIrreversibleBlockInfo />
                </CardBody>
              </CardStyled>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}

export default InfoPage;
