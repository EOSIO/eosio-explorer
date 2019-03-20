import './BlockdetailPage.scss';

import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Blockdetail from './components/Blockdetail';


class BlockdetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlockdetailPage animated fadeIn">
          <Card>
            <CardHeader>
              Blockdetail Page
            </CardHeader>
            <CardBody>
              <Blockdetail/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default BlockdetailPage;
