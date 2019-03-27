import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Actiondetail from './components/Actiondetail';
import Actionjson from './components/Actionjson';


class ActiondetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="ActiondetailPage animated fadeIn">
          <Card>
            <CardHeader>
              Action Detail Page
            </CardHeader>
            <CardBody>
              <Actiondetail/>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Action Raw JSON
            </CardHeader>
            <CardBody>
              <Actionjson/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default ActiondetailPage;
