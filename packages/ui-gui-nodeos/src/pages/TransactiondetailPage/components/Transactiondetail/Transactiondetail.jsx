import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStart, paramsSet } from './TransactiondetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { Card, CardTitle, CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';

const CardTitleStyled = styled(CardTitle)`
  text-decoration: underline;
  font-weight: bold;
`

const ColBoldStyled = styled(Col)`
  font-weight: bold;
`

const ColBoldUnderlineStyled = styled(Col)`
  font-weight: bold;
  text-decoration: underline;
`

const Transactiondetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    props.paramsSet({id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { transactiondetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Transactiondetail">
      <div>{ error
              ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching           
                ? `loading...`
                : payload.length === 0 
                  ? `No transaction found with transaction id = ${params.id}`
                  : <div>
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <CardTitleStyled>Transaction Detail</CardTitleStyled>
                              <Form>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Transaction ID:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Block Number:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].block_num}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Timestamp:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].createdAt}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Number of Actions:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].action_traces.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>

                      {(payload[0].action_traces.length) > 0
                        ? <Row>
                            <Col sm={12}>
                              <Card>
                                <CardBody>
                                  <CardTitleStyled>Action List</CardTitleStyled>
                                  <Form>
                                    <FormGroup row>
                                      <ColBoldUnderlineStyled sm={2}>Index</ColBoldUnderlineStyled>
                                      <ColBoldUnderlineStyled sm={3}>Action Name</ColBoldUnderlineStyled>
                                      <ColBoldUnderlineStyled sm={7}>Smart Contract Name</ColBoldUnderlineStyled>
                                    </FormGroup>
                                    {(payload[0].action_traces).map((eachAction, index)=> 
                                      <FormGroup key={index} row>
                                        <Col sm={2}>{index+1}</Col>    
                                        <Col sm={3}><Link to={`/action/${eachAction.receipt.global_sequence}`}>{eachAction.act.name}</Link></Col>
                                        <Col sm={7}>{eachAction.act.account}</Col>
                                      </FormGroup>                                    
                                    )}
                                  </Form>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        : console.log("No actions")
                      }

                      <Row>
                        <Col sm={12}>
                          <CardBody>
                            <CodeViewer
                              language="json"
                              value={JSON.stringify(payload, null, 2)}
                              readOnly={true}
                              height={600}
                            />                            
                          </CardBody>
                        </Col>
                      </Row>
                    </div>
            }
      </div>
    </div>
  );
}

export default connect(
  ({ transactiondetailPage: { transactiondetail }, router}) => ({
    transactiondetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }

)(Transactiondetail);
