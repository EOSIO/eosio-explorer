import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Transactiondetail from './components/Transactiondetail';


class TransactiondetailPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="TransactiondetailPage animated fadeIn">
          <Card>
            <CardHeader>
              Transactiondetail Page
            </CardHeader>
            <CardBody>
              <Transactiondetail/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default TransactiondetailPage;
