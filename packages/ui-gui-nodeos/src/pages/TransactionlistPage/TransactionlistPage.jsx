import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Transactionlist from './components/Transactionlist';
import { PageTitleDivStyled } from 'styled';

class TransactionlistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="TransactionlistPage animated fadeIn">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Transaction List Page</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
            <Transactionlist/>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}

export default TransactionlistPage;
