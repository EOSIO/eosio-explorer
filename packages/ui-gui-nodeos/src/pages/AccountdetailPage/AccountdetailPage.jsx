import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Accountdetail from './components/AccountDetail';

class AccountdetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="AccountdetailPage">
          <Card>
            <CardHeader>
              Account Detail Page
            </CardHeader>
            <CardBody>
              <Accountdetail/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default AccountdetailPage;
