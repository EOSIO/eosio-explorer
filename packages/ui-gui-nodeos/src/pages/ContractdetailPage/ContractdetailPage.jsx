import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Contractdetail from './components/Contractdetail';
import { PageTitleDivStyled } from 'styled';

class ContractdetailPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="ContractdetailPage">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Smart Contract Detail Page</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Contractdetail />
            </Col>
          </Row>          
        </div>
      </StandardTemplate>
    );
  }
}

export default ContractdetailPage;
