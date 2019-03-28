import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './ContractdetailReducer';
import MultiIndex from '../MultiIndex';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { Input } from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import SearchButton from 'styled/SearchButton';


const SearchLabel = styled.label`
  font-weight: bold;
  padding-right: 10px;
`
const SearchInputStyled = styled(Input)`
  width: 30%;
  margin-top: -6px;
`

const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
`
const DivMessageStyled = styled.div`
  font-weight: bold;
  padding: 15px;
`

const Contractdetail = (props) => {

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    if(pathname == '/contract' || pathname == '/contract/'){
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
      <div>    
        <DivFlexStyled>
          <SearchLabel>Multi-Index Table Search by Smart Contract Name:</SearchLabel>
          <SearchInputStyled 
                placeholder="Smart Contract Name"
                value={inputValue}
                onKeyDown={
                  evt => {
                    if (evt.key === 'Enter') {
                      setInputValue("")
                      { inputValue ? props.push('/contract/'+inputValue) : console.log("No search text")} 
                    }
                  }
                }
                onChange={evt=>{setInputValue(evt.target.value)}}/>
          <SearchButton
                color="secondary"                           
                onClick={evt=> {
                  setInputValue("")
                  {inputValue ? props.push('/contract/'+inputValue) : console.log("No search text") }                          
                }}>
          Search</SearchButton>
        </DivFlexStyled>                  
      </div>

      {showDetailsSection 
        ? error
          ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
          : isFetching
            ? `loading...`
            : !(payload.length !== 0 && payload[0].hasOwnProperty("abi") === true)
              ? `No Smart Contract found for the account name: ${params.account_name}`
              : <div>
                  <CodeViewer 
                    language="json"
                    value={JSON.stringify(payload[0].abi, null, 2)}
                    readOnly={true}
                    height={400}
                  />
                  { payload[0].abi.tables.length === 0 
                    ? <DivMessageStyled>No Multi-Index table present for this contract</DivMessageStyled>
                    : <MultiIndex abiData={payload[0]} />}
                </div>        
        :console.log("No details section")      
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
