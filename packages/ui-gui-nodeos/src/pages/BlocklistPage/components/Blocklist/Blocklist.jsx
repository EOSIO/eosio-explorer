import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardBody, Col, Row, Table,Button,Input} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router'

import styled from 'styled-components';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';

import SearchButton from 'styled/SearchButton';

const InputStyled = styled(Input)`
  width: 50%;
  margin-top: -6px;
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
    <Card>
      <CardBody>
        <div className="Blocklist">
          <Row>
            <Col sm="6">
              <CardTitle>   
                {filter 
                  ? <input style={{"WebkitAppearance":"checkbox"}} onChange={props.filterToggle} type="checkbox" checked/>
                  : <input style={{"WebkitAppearance":"checkbox"}} onChange={props.filterToggle} type="checkbox"/>}           
                  <label style={{"paddingLeft":"10px"}}>No empty blocks</label>               
              </CardTitle>
            </Col>
            <Col sm="6">
              <CardTitle>
                <div style={{display:"flex"}}>
                  <label>Search&nbsp;Blocks:&nbsp;&nbsp;</label>
                  <InputStyled 
                        placeholder="username"
                        value={inputValue}
                        onChange={evt=>{setInputValue(evt.target.value)}}/>
                  <SearchButton
                        color="secondary"   
                        onClick={evt=> {
                          setInputValue("")
                          {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");}                          
                        }}>
                  Search</SearchButton>
                </div>
              </CardTitle>
            </Col>
          </Row>
          <div>
            { error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <Table style={{textAlign:"center"}} dark>
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
                          <th>{eachBlock.block.timestamp}</th>
                        </tr>)}
                    </tbody>
                  </Table>}
          </div>
        </div>
      </CardBody>
    </Card>
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
