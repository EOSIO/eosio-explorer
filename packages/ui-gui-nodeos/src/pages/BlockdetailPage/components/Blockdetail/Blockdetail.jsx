import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { fetchStart, paramsSet } from './BlockdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import { CardStyled, CardHeaderStyled, TableStyled, ErrorDivStyled } from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const CustomTable = styled(TableStyled)`
  thead tr{
    background-color: #ffffff;
  }
`
const Blockdetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
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
                  ? <ErrorDivStyled>No block found with block id or block number {params.id_or_num}</ErrorDivStyled>
                  : <div>
                      <Row>
                        <Col sm="12">
                          <FirstCardStyled>
                            <CardHeaderStyled>Block Detail</CardHeaderStyled>
                            <CardBody>
                              <Form> 
                                <FormGroup row>
                                  <Col sm={2}>Block Number:</Col>
                                  <Col sm={10}>
                                    {payload[0].block_num}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Block ID:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].block_id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Timestamp:</Col>
                                  <Col sm={10}>
                                    {payload[0].createdAt}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Number of Transactions:</Col>
                                  <Col sm={10}>
                                    {payload[0].block.transactions.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </FirstCardStyled>
                        </Col>
                      </Row>

                      {(payload[0].block.transactions).length > 0 
                        ?<Row>
                          <Col sm="12">
                            <CardStyled>
                              <CardHeaderStyled>Transaction List</CardHeaderStyled>
                              <CardBody>
                                <CustomTable borderless>
                                <thead>
                                  <tr>
                                    <th width="16%">Index</th>
                                    <th width="84%">Transaction ID</th>                                    
                                  </tr>
                                </thead>
                                <tbody>
                                  {(payload[0].block.transactions).map((eachTransaction,index)=>
                                    <tr key={(typeof(eachTransaction.trx) !== "string") ? eachTransaction.trx.id : eachTransaction.trx} 
                                        onClick={evt=> (typeof(eachTransaction.trx) !== "string") ? props.push(`/transaction/${eachTransaction.trx.id}`): ""}>
                                      <td>{index+1}</td>
                                      <td className="hashText">{(typeof(eachTransaction.trx) !== "string") ? eachTransaction.trx.id : "Deferred transactions"}</td>                                      
                                    </tr>)}
                                </tbody>
                                </CustomTable>                               
                              </CardBody>
                            </CardStyled>
                          </Col>
                        </Row>
                        : console.log("No transactions") 
                      }  
                      <Row>
                        <Col sm="12">
                          <CardStyled>
                            <CardHeaderStyled>Block Raw JSON</CardHeaderStyled>
                            <CardBody>
                              <CodeViewer
                                language="json"
                                value={JSON.stringify(payload, null, 2)}
                                readOnly={true}
                                height={600}
                              />  
                            </CardBody>
                          </CardStyled>
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
    push
  }

)(Blockdetail);
