import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';

class DeploymentPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="DeploymentPage">
          <Card>
            <CardHeader>
              Deployment Page
            </CardHeader>
            <CardBody>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default DeploymentPage;
