import './PermissionsPage.scss';

import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';
import CreateAccount from './components/CreateAccount';

class PermissionsPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="PermissionsPage">
          <Card>
            <CardHeader>
              Permissions Page
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

export default PermissionsPage;
