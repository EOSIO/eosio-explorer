import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';

class PushactionPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="PushactionPage">
          <Card>
            <CardHeader>
              Push Action Page
            </CardHeader>
            <CardBody>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default PushactionPage;
