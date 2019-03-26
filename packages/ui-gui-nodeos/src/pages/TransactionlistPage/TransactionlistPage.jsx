import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Transactionlist from './components/Transactionlist';


class TransactionlistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="TransactionlistPage animated fadeIn">
          <Card>
            <CardHeader>
              Transactions List Page
            </CardHeader>
            <CardBody>
              <Transactionlist/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default TransactionlistPage;
