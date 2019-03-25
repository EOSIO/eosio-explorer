import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardBody, Col, Row, Table,Button,Input} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router'
import styled from 'styled-components';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';

import SearchButton from 'styled/SearchButton';

const CheckBoxStyled = styled.input`
  -webkit-appearance: checkbox; 
`

const LabelFilterStyled = styled.label`
  padding-left: 10px;
  font-weight: bold;
`

const SearchInputStyled = styled(Input)`
  width: 50%;
  margin-top: -6px;
`

const DivFlexStyled = styled.div`
  display: flex;
`

const TableStyled = styled(Table)`
  text-align: center;
  font-family: monospace, monospace; 
`
const SearchLabel = styled.label`
  font-weight: bold;
  padding-right: 10px;
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
      <Card>
        <CardBody>        
          <Row>
            <Col sm="6">
              <CardTitle>   
                {filter 
                  ? <CheckBoxStyled onChange={props.filterToggle} type="checkbox" checked/>
                  : <CheckBoxStyled onChange={props.filterToggle} type="checkbox"/>}           
                  <LabelFilterStyled>No empty blocks</LabelFilterStyled>               
              </CardTitle>
            </Col>
            <Col sm="6">
              <CardTitle>
                <DivFlexStyled>
                  <SearchLabel>Search&nbsp;Blocks:</SearchLabel>
                  <SearchInputStyled 
                        placeholder="username"
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
                  <SearchButton
                        color="secondary"                           
                        onClick={evt=> {
                          setInputValue("")
                          {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");}                          
                        }}>
                  Search</SearchButton>
                </DivFlexStyled>
              </CardTitle>
            </Col>
          </Row>
          <div>
            { error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <TableStyled dark>
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
                        <tr key={eachBlock.block_id}>
                          <th>{eachBlock.block_num}</th>
                          <th><Link to={`/block/${eachBlock.block_id}`}>{eachBlock.block_id}</Link></th>
                          <th>{eachBlock.block.transactions.length}</th>
                          <th>{eachBlock.createdAt}</th>
                        </tr>)}
                    </tbody>
                  </TableStyled>}
          </div>        
        </CardBody>
      </Card>
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
