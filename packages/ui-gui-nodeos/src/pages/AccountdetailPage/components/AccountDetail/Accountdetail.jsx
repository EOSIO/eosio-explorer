import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStart, paramsSet } from './AccountdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { CardBody, Col, Row, Form, FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import { CardStyled, CardHeaderStyled, ButtonPrimary, InputStyled, ErrorDivStyled } from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const SearchLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const SearchInputStyled = styled(InputStyled)`
  width: 30%;
  margin-right: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const CustomButton = styled(ButtonPrimary)`
  width: 170px;
`

const Accountdetail = (props) => {

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    if(pathname === '/account' || pathname === '/account/'){
      setShowDetailsSection(false);
    }else{
      setShowDetailsSection(true)
      props.paramsSet({account_name: pathNameConsumer(pathname) });
      props.fetchStart();
    }
  }, [])

  let { accountdetail: { isFetching, data, params } } = props;
  let { payload={}, error } = data;

  return (
    <div className="Accountdetail">
    <Row>
      <Col sm="12">
        <FirstCardStyled> 
          <CardHeaderStyled>Search Account</CardHeaderStyled>
          <CardBody>         
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
              <ButtonPrimary                        
                    onClick={evt=> {
                      setInputValue("")
                      {inputValue ? props.push('/account/'+inputValue) : console.log("No search text") }                          
                    }}>
              Search</ButtonPrimary>
            </DivFlexStyled>            
          </CardBody>
        </FirstCardStyled>
      </Col>
    </Row>
      <div>
        { showDetailsSection                     
          ? error
            ? <ErrorDivStyled>No account found with Account Name {params.account_name}</ErrorDivStyled>
            : isFetching
              ? `loading...`
              : (Object.keys(payload).length === 0 && payload.constructor === Object) 
                ? `loading...`
                : <div>
                    <Row>
                      <Col sm="12">
                        <CardStyled> 
                          <CardHeaderStyled>Account Detail</CardHeaderStyled>
                          <CardBody>  
                            <Form> 
                              <FormGroup row>
                                <Col sm={2}>Account Name:</Col>
                                <Col sm={10}>
                                  {payload.account_name}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>Account Creation Date:</Col>
                                <Col sm={10}>
                                  {payload.created}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>Owner Public Key:</Col>
                                <Col sm={10}>                                            
                                  {payload.permissions[0].perm_name === "owner" 
                                    ? payload.permissions[0].required_auth.keys[0].key 
                                    : payload.permissions[1].required_auth.keys[0].key}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>Active Public Key:</Col>
                                <Col sm={10}>
                                  {payload.permissions[0].perm_name === "active" 
                                    ? payload.permissions[0].required_auth.keys[0].key 
                                    : payload.permissions[1].required_auth.keys[0].key}
                                </Col>
                              </FormGroup>
                              <FormGroup>
                              <Link to={`/contract/${payload.account_name}`}><CustomButton>View Smart Contract</CustomButton></Link>
                              </FormGroup>
                            </Form>
                          </CardBody>
                        </CardStyled>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12">
                        <CardStyled>
                          <CardHeaderStyled>Account Raw JSON</CardHeaderStyled>
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
          : console.log("No details section") }                                         
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
