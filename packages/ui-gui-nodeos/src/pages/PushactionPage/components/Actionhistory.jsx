import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Table, Button, Row, Col, Input } from 'reactstrap';

import { LoadingSpinner } from 'components';

const Actionhistory = (props) => {

  let { pushactionPage: { isFetching, data: { actionsList = [] } } } = props;

  return (
    <div className="Actionhistory">
      <Row>
        <Col xs="12">
        { isFetching ? (
          <LoadingSpinner />
        ) : (
          <Table responsive striped>
            <thead>
              <tr className="font-weight-bold">
                <th>Smart Contract Name</th>
                <th>Action Type</th>
                <th>Timestamp</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {actionsList.length < 1 ?
                <tr><td colSpan="4" className="text-center">No actions could be found for the given Smart Contract name</td></tr>
              : actionsList.map((action, index)=>
                <tr key={index}>
                  <td>{action.act.account}</td>
                  <td>{action.act.name}</td>
                  <td>{action.createdAt}</td>
                  <td><Button block color="primary" size="sm" onClick={(e) => { e.preventDefault(); props.prefillCallback(action.receipt.global_sequence); }}>Prefill</Button></td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        </Col>
      </Row>
    </div>
  );
}

export default connect(
  ({ pushactionPage, router}) => ({
    pushactionPage,
    router
  })
)(Actionhistory);