import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Blockdetail from './components/Blockdetail';
import { PageTitleDivStyled } from 'styled';


class BlockdetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlockdetailPage ">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Blocks Page | Block Detail</PageTitleDivStyled>
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
