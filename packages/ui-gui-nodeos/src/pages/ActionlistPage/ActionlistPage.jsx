import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Actionlist from './components/Actionlist';


class ActionlistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="ActionlistPage animated fadeIn">
          <Card>
            <CardHeader>
              Action List Page
            </CardHeader>
            <CardBody>
              <Actionlist/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default ActionlistPage;
