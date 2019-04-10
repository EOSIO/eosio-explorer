import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardBody, Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Nodeswitch from './components/Nodeswitch';
import Headblock from './components/Headblock';
import BlockchainInfo from './components/BlockchainInfo';
import LastIrreversibleBlockInfo from './components/LastIrreversibleBlockInfo';
import { CardStyled, CardHeaderStyled, PageTitleDivStyled } from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

class InfoPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="InfoPage animated fadeIn">
          <Row>
            <Col xs="12">
              <PageTitleDivStyled>Info Page</PageTitleDivStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <FirstCardStyled>
                <CardHeaderStyled>
                  Connections
                </CardHeaderStyled>
                <CardBody>
                  <Nodeswitch/>
                </CardBody>
              </FirstCardStyled>
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
