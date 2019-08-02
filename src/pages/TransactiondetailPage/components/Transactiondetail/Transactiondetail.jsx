import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { fetchStart, paramsSet } from './TransactiondetailReducer';
import isObjectEmpty from 'helpers/is-object-empty';
import pathNameConsumer from 'helpers/pathname-consumer';
import { CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer, LoadingSpinner } from 'components';
import { Link } from 'react-router-dom';
import { CardStyled, CardHeaderStyled, TableStyled, ErrorButton, ErrorDivStyled, ButtonPrimary } from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const CustomTable = styled(TableStyled)`
  thead tr{
    background-color: #ffffff;
  }
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
              ? 
                <>
                  {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
                  <ErrorButton onClick={props.fetchStart}>Connection error, click to reload</ErrorButton>
                </>
              : isFetching           
                ? <LoadingSpinner />
                : payload.length === 0 
                  ? <CardStyled>
                      <CardHeaderStyled></CardHeaderStyled>
                      <CardBody>
                        <ErrorDivStyled>No Transaction found with Transaction ID {params.id} <br/><br/>
                          <ButtonPrimary
                            onClick={evt=> props.push(`/transaction-list`)}>Back
                          </ButtonPrimary>           
                        </ErrorDivStyled>           
                      </CardBody>
                    </CardStyled>
                  : <div>
                      <Row>
                        <Col sm="12">
                          <FirstCardStyled>
                            <CardHeaderStyled>Transaction Detail</CardHeaderStyled>
                            <CardBody>                              
                              <Form>
                                <FormGroup row>
                                  <Col sm={2}>Transaction ID:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Block Number:</Col>
                                  <Col sm={10} className="hashText">
                                    <Link to={`/block/${payload[0].block_num}`}>{payload[0].block_num}</Link>
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Timestamp:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].partial_expiration}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>Number of Actions:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].action_traces.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </FirstCardStyled>
                        </Col>
                      </Row>

                      {(payload[0].action_traces.length) > 0
                        && <Row>
                            <Col sm={12}>
                              <CardStyled>
                                <CardHeaderStyled>Action List</CardHeaderStyled>
                                <CardBody>                                 
                                  <CustomTable borderless>
                                  <thead>
                                    <tr>
                                      <th width="16%">Index</th>
                                      <th width="34%">Action Name</th>   
                                      <th width="40%">Smart Contract Name</th>                                   
                                    </tr>
                                  </thead>
                                  <tbody className="hashText">
                                    {(payload[0].action_traces).map((eachAction,index)=>
                                      <tr key={index} onClick={evt=> props.push(`/action/${payload[0].id}/${eachAction.action_ordinal}`)}>
                                        <td>{index+1}</td>
                                        <td>{eachAction.act_name}</td>  
                                        <td>{eachAction.act_account}</td>                                    
                                      </tr>)}
                                  </tbody>
                                  </CustomTable> 
                                </CardBody>
                              </CardStyled>
                            </Col>
                          </Row>
                      }

                      <Row>
                        <Col sm={12}>
                          <CardStyled>
                            <CardHeaderStyled>Transaction Raw JSON</CardHeaderStyled>
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
    push
  }

)(Transactiondetail);
