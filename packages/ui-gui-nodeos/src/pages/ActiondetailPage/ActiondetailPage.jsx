import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Actiondetail from './components/Actiondetail';


class ActiondetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="ActiondetailPage animated fadeIn">
          <Card>
            <CardHeader>
              Actiondetail Page
            </CardHeader>
            <CardBody>
              <Actiondetail/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default ActiondetailPage;
