import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Actionlist from './components/Actionlist';


class ActionlistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="ActionlistPage animated fadeIn">
          <Row>
            <Col xs="12">
              <h2 className="pageTitle text-center mb-4">Action List Page</h2>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Action List
                </CardHeader>
                <CardBody>
                  <Actionlist/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}

export default ActionlistPage;
