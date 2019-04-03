import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop } from './TransactionlistReducer';
import { Card, CardTitle, CardBody, Col, Row, Table,Input} from 'reactstrap';
import styled from 'styled-components';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, CheckBoxDivStyled, InputStyled} from 'styled';

import SearchButton from 'styled/SearchButton';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`


const SearchLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const CardTitleStyled = styled(CardTitle)`
  font-weight: bold;
  text-decoration: underline;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const SearchInputStyled = styled(InputStyled)`
  width: 30%;
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
      <FirstCardStyled>
        <CardHeaderStyled>Transaction List</CardHeaderStyled>
        <CardBody>         
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
              &nbsp;&nbsp;&nbsp;      
              <ButtonPrimary             
                    onClick={evt=> {
                      setInputValue("")
                      {inputValue ? props.push('/transaction/'+inputValue) : console.log("No search text");}                          
                    }}>
              Search</ButtonPrimary>
            </DivFlexStyled>
          </CardTitle>
           
          <div>{error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <TableStyled borderless>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Block Number</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.map(eachTransaction=>
                        <tr onClick={evt=>props.push(`/transaction/${eachTransaction.trx_id}`)} key={eachTransaction.trx_id}>
                          <td width="50%">{eachTransaction.trx_id}</td>
                          <td width="20%">{eachTransaction.block_num}</td>
                          <td width="30%">{eachTransaction.createdAt}</td>
                        </tr>)}
                    </tbody>
                  </TableStyled>
                }                  
          </div>              
        </CardBody>
      </FirstCardStyled>      
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
