import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Blockdetail from './components/Blockdetail';
import { PageTitleDivStyled } from 'styled';


class BlockdetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlockdetailPage animated fadeIn">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Block Detail Page</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Blockdetail/>
            </Col>
          </Row>   
        </div>
      </StandardTemplate>
    );
  }
}

export default BlockdetailPage;
