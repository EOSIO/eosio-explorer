import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Transactiondetail from './components/Transactiondetail';
import { PageTitleDivStyled } from 'styled';

class TransactiondetailPage extends Component {

  render() {
    return (
      <StandardTemplate>
        <div className="TransactiondetailPage animated fadeIn">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Transactions Page | Transaction Detail</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">              
              <Transactiondetail/>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}
export default TransactiondetailPage;
