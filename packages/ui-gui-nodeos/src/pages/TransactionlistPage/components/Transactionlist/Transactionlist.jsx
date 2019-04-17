import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop, recordsUpdate } from './TransactionlistReducer';
import { Row, Col, CardTitle, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { LimitSelectDropdown, LoadingSpinner } from 'components';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, ButtonSecondary, InputStyled} from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const SearchInputStyled = styled(InputStyled)`
  width: 30%;
  margin-right: 10px;
`
const CustomErrorButton = styled(ButtonSecondary)`
  width: auto;
`

const Transactionlist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { transactionlist: { isFetching, data, records } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Transactionlist">
      <FirstCardStyled>
        <CardHeaderStyled>Transaction List</CardHeaderStyled>
        <CardBody>         
          <CardTitle>
            <DivFlexStyled>
              <SearchInputStyled 
                    placeholder="Transaction ID"
                    value={inputValue}
                    onKeyDown={
                      evt => {
                        if (evt.key === 'Enter') {
                          setInputValue("");
                          if(inputValue !== "")
                            props.push('/transaction/'+inputValue) 
                        }
                      }
                    }
                    onChange={evt=>{setInputValue(evt.target.value)}}/>
              <ButtonPrimary             
                    onClick={evt=> {
                      setInputValue("");
                      if(inputValue !== "")
                        props.push('/transaction/'+inputValue)                           
                    }}>
              Search</ButtonPrimary>
            </DivFlexStyled>
          </CardTitle>
           
          <div>{error
              ? <CustomErrorButton onClick={props.pollingStart}>Connection error, click to reload</CustomErrorButton>
              : isFetching
                ? <LoadingSpinner />
                : 
                  <Row>
                    <Col xs="12">
                      <TableStyled borderless>
                        <thead>
                          <tr>
                            <th width="50%">Transaction ID</th>
                            <th width="20%">Block Number</th>
                            <th width="30%">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="hashText">
                          {payload.map(eachTransaction=>
                            <tr onClick={evt=>props.push(`/transaction/${eachTransaction.trx_id}`)} key={eachTransaction.trx_id}>
                              <td>{eachTransaction.trx_id}</td>
                              <td>{eachTransaction.block_num}</td>
                              <td>{eachTransaction.createdAt}</td>
                            </tr>)}
                        </tbody>
                      </TableStyled>
                    </Col>
                    {payload.length > 0 &&
                      <Col xs="12" className="text-right">
                        <LimitSelectDropdown limit={records} onChange={(limit) => { props.recordsUpdate(limit) }} />
                      </Col>
                    }
                  </Row>
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
    recordsUpdate,
    push
  }

)(Transactionlist);
