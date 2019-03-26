import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './AccountdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { Card, CardTitle, CardBody, Col, Row, Form, FormGroup, Input} from 'reactstrap';
import styled from 'styled-components';
import CodeViewer from '../../../../components/CodeViewer';
import SearchButton from 'styled/SearchButton';

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

const SearchLabel = styled.label`
  font-weight: bold;
  padding-right: 10px;
`
const SearchInputStyled = styled(Input)`
  width: 50%;
  margin-top: -6px;
`

const DivFlexStyled = styled.div`
  display: flex;
`

const SearchCardTitle = styled(CardTitle)`
  padding-top: 1.5rem;
`
const Accountdetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    console.log("pathname ",pathname);
    if(pathname == '/account' || pathname == '/account/'){
      console.log(); 
      setShowDetailsSection(false);
    }else{
      setShowDetailsSection(true)
      props.paramsSet({account_name:  pathNameConsumer(pathname) });
      props.fetchStart();  
    }       
  }, [])

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);
  
  let { accountdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Accountdetail">
      <div>{ error
              ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching 
                ? `loading...`
                : <div>
                    <Row>
                      <Col sm="12">
                        <Card> 
                          <CardBody>                       
                            <SearchCardTitle>
                              <DivFlexStyled>
                                <SearchLabel>Search Account Name:</SearchLabel>
                                <SearchInputStyled 
                                      placeholder="Account Name"
                                      value={inputValue}
                                      onKeyDown={
                                        evt => {
                                          if (evt.key === 'Enter') {
                                            setInputValue("")
                                            { inputValue ? props.push('/account/'+inputValue) : console.log("No search text")} 
                                          }
                                        }
                                      }
                                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                                <SearchButton
                                      color="secondary"                           
                                      onClick={evt=> {
                                        setInputValue("")
                                        {inputValue ? props.push('/account/'+inputValue) : console.log("No search text") }                          
                                      }}>
                                Search</SearchButton>
                              </DivFlexStyled>
                            </SearchCardTitle>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>                       
                    {showDetailsSection                     
                      ? error
                        ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
                        : isFetching
                          ? `loading...`
                          : payload.length === 0
                            ? `No account found for Account name: ${params.account_name}`
                            : <div>
                                <Row>
                                  <Col sm="12">
                                    <Card> 
                                      <CardBody>  
                                        <CardTitleStyled>Account Detail</CardTitleStyled>
                                        <Form> 
                                          <FormGroup row>
                                            <ColBoldStyled sm={2}>Account Name:</ColBoldStyled>
                                            <Col sm={10}>
                                              {payload[0].account}
                                            </Col>
                                          </FormGroup>
                                          <FormGroup row>
                                            <ColBoldStyled sm={2}>Account Creation Date:</ColBoldStyled>
                                            <Col sm={10}>
                                              {payload[0].createdAt}
                                            </Col>
                                          </FormGroup>
                                          <FormGroup row>
                                            <ColBoldStyled sm={2}>Owner Public Key:</ColBoldStyled>
                                            <Col sm={10}>
                                              {payload[0].permission == "owner" ? payload[0].public_key : payload[1].public_key}
                                            </Col>
                                          </FormGroup>
                                          <FormGroup row>
                                            <ColBoldStyled sm={2}>Active Public Key:</ColBoldStyled>
                                            <Col sm={10}>
                                              {payload[0].permission == "active" ? payload[0].public_key : payload[1].public_key}
                                            </Col>
                                          </FormGroup>
                                        </Form>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col sm="12">
                                    <CodeViewer
                                      language="json"
                                      value={JSON.stringify(payload, null, 2)}
                                      readOnly={true}
                                      height={300}
                                    />
                                  </Col>  
                                </Row>        
                              </div> 
                        : console.log("No details section") }
            </div>}                              
      </div>
    </div>
  );
}

export default connect(
  ({ accountdetailPage: { accountdetail }, router}) => ({
    accountdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Accountdetail);
