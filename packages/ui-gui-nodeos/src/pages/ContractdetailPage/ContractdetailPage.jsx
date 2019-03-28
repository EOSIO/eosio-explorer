import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Contractdetail from './components/Contractdetail';

class ContractdetailPage extends Component {
  render() {
    return (
      <StandardTemplate>
        <div className="ContractdetailPage">
          <Card>
            <CardHeader>
              Smart Contract Detail Page
            </CardHeader>
            <CardBody>
              <Contractdetail />
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default ContractdetailPage;
