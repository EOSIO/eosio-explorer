import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Blocklist from './components/Blocklist';
import { PageTitleDivStyled } from 'styled';


class BlocklistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlocklistPage animated fadeIn">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>Blocks Page</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Blocklist/>                
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}

export default BlocklistPage;
