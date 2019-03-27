import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './BlockdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { Card, CardTitle, CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import CodeViewer from '../../../../components/CodeViewer';

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

const Blockdetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    console.log("pathname ", pathname);
    props.paramsSet({id_or_num: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { blockdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Blockdetail">
      <div>{ error
              ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching 
                ? `loading...`
                : payload.length === 0 
                  ? `No block found with block id/ block number = ${params.id_or_num}`
                  : <div>
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <CardTitleStyled>Block Detail</CardTitleStyled>
                              <Form> 
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Block Number:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].block_num}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Block ID:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].block_id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Timestamp:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].createdAt}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <ColBoldStyled sm={2}>Number of Transactions:</ColBoldStyled>
                                  <Col sm={10}>
                                    {payload[0].block.transactions.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>

                      {(payload[0].block.transactions).length > 0 
                        ?<Row>
                          <Col sm="12">
                            <Card>
                              <CardBody>
                                <CardTitleStyled>Transaction List</CardTitleStyled>                              
                                <Form> 
                                  <FormGroup row>
                                    <ColBoldUnderlineStyled sm={2}>Index</ColBoldUnderlineStyled>
                                    <ColBoldUnderlineStyled sm={10}>Transaction ID</ColBoldUnderlineStyled>
                                  </FormGroup>
                                  {(payload[0].block.transactions).map((eachTransaction,index)=>
                                  <FormGroup key={index} row>
                                    <Col sm={2}>{index+1}</Col>
                                    <Col sm={10}>{eachTransaction.trx.id}</Col>
                                  </FormGroup>
                                  )}                              
                                </Form>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                        : console.log("No transactions") 
                      }  

                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                            <CodeViewer
                                language="json"
                                value={JSON.stringify(payload, null, 2)}
                                readOnly={true}
                                height={600}
                                />
                            </CardBody>        
                          </Card>          
                        </Col>
                      </Row>
                    </div>}    
      </div>
    </div>
  );
}

export default connect(
  ({ blockdetailPage: { blockdetail }, router}) => ({
    blockdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }

)(Blockdetail);
