import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Accountdetail from './components/AccountDetail';
import { PageTitleDivStyled } from 'styled';

class AccountdetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="AccountdetailPage">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Account Detail Page</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Accountdetail/>
            </Col>
          </Row>          
        </div>
      </StandardTemplate>
    );
  }
}

export default AccountdetailPage;
