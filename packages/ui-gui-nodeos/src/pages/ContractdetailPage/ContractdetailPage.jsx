import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';

class ContractdetailPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="ContractdetailPage">
          <Card>
            <CardHeader>
              Permission Page
            </CardHeader>
            <CardBody>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default ContractdetailPage;
