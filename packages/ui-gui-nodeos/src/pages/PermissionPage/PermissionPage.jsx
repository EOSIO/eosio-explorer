import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';
import CreateAccount from './components/CreateAccount';

class PermissionPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="PermissionPage">
          <Card>
            <CardHeader>
              Permission Page
            </CardHeader>
            <CardBody>
              <CreateAccount/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default PermissionPage;
