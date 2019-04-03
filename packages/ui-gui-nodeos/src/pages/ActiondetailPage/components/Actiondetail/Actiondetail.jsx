import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Col, Form, FormGroup, Label } from 'reactstrap';

const Actiondetail = (props) => {

  let { actiondetailPage: { data } } = props;
  let { payload } = data;

  return (
    <>
      { payload && (payload.length > 0 ? (
        payload.map((action, index) =>
        <Form key={index} className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Smart Contract Name:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{action && action.act.account}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Action Type:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{action && action.act.name}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Timestamp:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{action && action.createdAt}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Transaction ID:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">
                {action && <Link to={`/transaction/${action.trx_id}`}>{action.trx_id}</Link> }
              </p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Actor:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">
                { action && (action.act && (action.act.authorization && 
                  action.act.authorization.map((auth, i) => (
                    auth.actor + (i > 0 && i < (action.act.authorization.length - 1) ? ", " : "")
                  )
                ))) }
              </p>
            </Col>
          </FormGroup>
        </Form>
      )) :
        <div className="text-center">
          <p className="text-danger mb-0">Action data empty</p>
        </div>
      )}
    </>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  })
)(Actiondetail);
