import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardBody, Col, Row, Table,Input} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router'
import styled from 'styled-components';
import { CardStyled, TableStyled, ButtonPrimary, CheckBoxStyled, InputStyled} from 'styled';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';



const LabelFilterStyled = styled.label`
  padding-left: 10px;
  margin-top: 10px;
`

const SearchInputStyled = styled(InputStyled)`
  width: 70%;
`

const DivFlexStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
`


const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { blocklist: { isFetching, data, filter } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Blocklist">
      <CardStyled>
        <CardBody>        
          <Row>
            <Col sm="8">               
              {filter 
                ? <CheckBoxStyled onChange={props.filterToggle} type="checkbox" checked/>
                : <CheckBoxStyled onChange={props.filterToggle} type="checkbox"/>}           
                <LabelFilterStyled>No empty blocks</LabelFilterStyled>               
            </Col>
            <Col sm="4">
              
                <DivFlexStyled>
                  <SearchInputStyled 
                        placeholder="Search by Block number / Block ID"
                        value={inputValue}
                        onKeyDown={
                          evt => {
                            if (evt.key === 'Enter') {
                              setInputValue("")
                               {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");} 
                            }
                          }
                        }
                        onChange={evt=>{setInputValue(evt.target.value)}}/>
                  <ButtonPrimary
                        color="secondary"                           
                        onClick={evt=> {
                          setInputValue("")
                          {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");}                          
                        }}>
                  SEARCH</ButtonPrimary>
                </DivFlexStyled>
              
            </Col>
          </Row>
          <div>
            { error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <TableStyled borderless>
                    <thead>
                      <tr>
                        <th>Block Number</th>
                        <th>Block ID</th>
                        <th>Number of Transactions</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.map(eachBlock=>
                        <tr onClick={evt=>props.push(`/block/${eachBlock.block_id}`)} key={eachBlock.block_id}>
                          <td>{eachBlock.block_num}</td>
                          <td>{eachBlock.block_id}</td>
                          <td>{eachBlock.block.transactions.length}</td>
                          <td>{eachBlock.createdAt}</td>
                        </tr>)}
                    </tbody>
                  </TableStyled>}
          </div>        
        </CardBody>
      </CardStyled>
    </div>
  );
}

export default connect(
  ({ blocklistPage: { blocklist }}) => ({
    blocklist
  }),
  {
    pollingStart,
    pollingStop,
    filterToggle,
    push
  }

)(Blocklist);
