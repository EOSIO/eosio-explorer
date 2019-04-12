import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './ContractdetailReducer';
import MultiIndex from '../MultiIndex';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { Row, Col, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import { CardStyled, CardHeaderStyled, ButtonPrimary, ButtonSecondary, ErrorDivStyled, InputStyled} from 'styled';

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

const DivMessageStyled = styled.div`
  font-weight: bold;
  padding-bottom: 20px;
`
const CustomErrorButton = styled(ButtonSecondary)`
  width: auto;
`


const Contractdetail = (props) => {

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    if(pathname === '/contract' || pathname === '/contract/'){
      setShowDetailsSection(false);
    }else{
      setShowDetailsSection(true)
      props.paramsSet({account_name:  pathNameConsumer(pathname) });
      props.fetchStart();  
    }       
  }, [])  
  
  let { contractdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Contractdetail">
      <Row> 
        <Col sm="12">
          <FirstCardStyled>
            <CardHeaderStyled>Search Smart Contract</CardHeaderStyled>
            <CardBody>
              <DivFlexStyled>
                <SearchLabel>Multi-Index Table Search by Smart Contract Name:</SearchLabel>
                <SearchInputStyled 
                      placeholder="Smart Contract Name"
                      value={inputValue}
                      onKeyDown={
                        evt => {
                          if (evt.key === 'Enter') {
                            setInputValue("")
                            if(inputValue !== "")
                              props.push('/contract/'+inputValue)
                          }
                        }
                      }
                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                <ButtonPrimary
                      color="secondary"                           
                      onClick={evt=> {
                        setInputValue("")
                        if(inputValue !== "")
                          props.push('/contract/'+inputValue)                         
                      }}>
                Search</ButtonPrimary>
              </DivFlexStyled>
            </CardBody>
          </FirstCardStyled>
               
        </Col>                
      </Row>

      {showDetailsSection && 
        <div>
          {error
            ? <CustomErrorButton onClick={props.fetchStart}>Connection error, click to reload</CustomErrorButton>
            : isFetching
              ? `loading...`
              : !(payload.length !== 0 && payload[0].hasOwnProperty("abi") === true)
                ? <ErrorDivStyled>No Smart Contract found with Smart Contract Name {params.account_name}</ErrorDivStyled>
                : <div>
                    <Row> 
                      <Col sm="12">
                        <CardStyled>
                          <CardHeaderStyled>Smart Contract Detail</CardHeaderStyled>
                          <CardBody>
                            <CodeViewer 
                              language="json"
                              value={JSON.stringify(payload[0].abi, null, 2)}
                              readOnly={true}
                              height={300}
                            />
                          </CardBody>
                        </CardStyled>
                      </Col>
                    </Row>  
                    
                    { payload[0].abi.tables.length === 0 
                      ? <DivMessageStyled>No Multi-Index table present for this contract</DivMessageStyled>
                      : <MultiIndex abiData={payload[0]} />}
                  </div>      
          } 
        </div>    
      }
    </div>
  );
}

export default connect(
  ({ contractdetailPage: { contractdetail }, router}) => ({
    contractdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Contractdetail);
