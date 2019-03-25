import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop } from './TransactionlistReducer';
import { Card, CardTitle, CardBody, Col, Row, Table,Input} from 'reactstrap';
import styled from 'styled-components';

import SearchButton from 'styled/SearchButton';

const TableStyled = styled(Table)`
  text-align: center;
  font-family: monospace, monospace; 
`
const SearchLabel = styled.label`
  font-weight: bold;
  padding-right: 10px;
`
const CardTitleStyled = styled(CardTitle)`
  font-weight: bold;
  text-decoration: underline;
`
const DivFlexStyled = styled.div`
  display: flex;
`
const SearchInputStyled = styled(Input)`
  width: 50%;
  margin-top: -6px;
`
const Transactionlist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { transactionlist: { isFetching, data, filter } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Transactionlist">
      <Card>
        <CardBody>
          <Row>
            <Col sm="6"></Col>
            <Col sm="6">
              <CardTitle>
                <DivFlexStyled>
                  <SearchLabel>Search Transactions:</SearchLabel>
                  <SearchInputStyled 
                        placeholder="Transaction ID"
                        value={inputValue}
                        onKeyDown={
                          evt => {
                            if (evt.key === 'Enter') {
                              setInputValue("")
                               {inputValue ? props.push('/transaction/'+inputValue) : console.log("No search text");} 
                            }
                          }
                        }
                        onChange={evt=>{setInputValue(evt.target.value)}}/>
                  <SearchButton
                        color="secondary"                           
                        onClick={evt=> {
                          setInputValue("")
                          {inputValue ? props.push('/transaction/'+inputValue) : console.log("No search text");}                          
                        }}>
                  Search</SearchButton>
                </DivFlexStyled>
              </CardTitle>
            </Col>
          </Row>
          <CardTitleStyled>Transaction List</CardTitleStyled>
          <div>{error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <TableStyled dark>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Block Number</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.map(eachTransaction=>
                        <tr key={eachTransaction.trx_id}>
                          <th><Link to={`/transaction/${eachTransaction.trx_id}`}>{eachTransaction.trx_id}</Link></th>
                          <th>{eachTransaction.block_num}</th>
                          <th>{eachTransaction.createdAt}</th>
                        </tr>)}
                    </tbody>
                  </TableStyled>
                }                  
          </div>              
        </CardBody>
      </Card>      
    </div>
  );
}

export default connect(
  ({ transactionlistPage: { transactionlist }}) => ({
    transactionlist
  }),
  {
    pollingStart,
    pollingStop,
    push
  }

)(Transactionlist);
